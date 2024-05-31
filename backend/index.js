const express = require("express");
const app = express();
var session = require("express-session");
const fetch = require("node-fetch");

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

async function getAccessToken(code, client_id, client_secret) {
  const request = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code,
    }),
  });
  const text = await request.text();
  console.log("RESPONSE!!!");
  console.log(text);
  const params = new URLSearchParams(text);
  return params.get("access_token");
}

async function fetchGitHubUser(token) {
  const request = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: "token " + token,
    },
  });
  return await request.json();
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  }),
);

app.get("/login/github", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user%20public_repo`,
  );
});

app.get("/login/github/callback", async (req, res) => {
  const code = req.query.code;
  const access_token = await getAccessToken(code, clientID, clientSecret);
  console.log(access_token);
  req.session.token = access_token;
  const user = await fetchGitHubUser(access_token);

  if (user) {
    req.session.access_token = access_token;
    req.session.github = user;
    req.session.githubId = user.id;
    req.session.loggedin = true;
    req.session.username = user.login;
    res.redirect("/home"); // or to wherever you want to redirect to after logging in
  } else {
    res.send("Login did not succeed!");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(function () {
    res.redirect("/");
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
