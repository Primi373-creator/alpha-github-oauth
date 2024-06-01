import React, { useState } from "react";
import "../css/d-k.css";
import Copyright from "./copyright";

const Koyeb = () => {
  const [koyebName, setKoyebName] = useState("");
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [koyebApiKey, setKoyebApiKey] = useState("");
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  const handleInputChange = () => {
    // Check if all fields are filled
    if (koyebName && databaseUrl && sessionId && koyebApiKey) {
      setAllFieldsFilled(true);
    } else {
      setAllFieldsFilled(false);
    }
  };

  const handleDeploy = () => {
    if (allFieldsFilled) {
      const uri =
        "https://app.koyeb.com/apps/deploy?type=git&repository=github.com/C-iph3r/alpha-md&branch=main&name=${encodeURIComponent(koyebName)}&builder=dockerfile&env[REACT]=command&env[SESSION_ID]=${encodeURIComponent(sessionId)}&env[DATABASE_URL]=${encodeURIComponent(databaseUrl)}&env[BOT_INFO]=alpha-md;C-iph3r;https://i.imgur.com/nXqqjPL.jpg&env[PREFIX]=!&env[KOYEB_API]=${encodeURIComponent(koyebApiKey)}&env[AUDIO_DATA]=alpha-md;C-iph3r;https://i.imgur.com/nXqqjPL.jpg&env[WARNCOUNT]=3&env[STATUS_VIEW]=false&env[STICKER_DATA]=C-iph3r;alpha-md&env[WORKTYPE]=private&env[ALPHA_KEY]=alpha-free&env[SUDO]=";
      window.location.href = uri;
    } else {
      alert("Please fill in all fields before deploying.");
    }
  };

  return (
    <div className="koyeb-container">
      <input
        type="text"
        placeholder="KOYEB_APP_NAME"
        value={koyebName}
        onChange={(e) => {
          setKoyebName(e.target.value);
          handleInputChange();
        }}
        className="input"
      />
      <input
        type="text"
        placeholder="DATABASE_URL"
        value={databaseUrl}
        onChange={(e) => {
          setDatabaseUrl(e.target.value);
          handleInputChange();
        }}
        className="input"
      />
      <input
        type="text"
        placeholder="SESSION_ID"
        value={sessionId}
        onChange={(e) => {
          setSessionId(e.target.value);
          handleInputChange();
        }}
        className="input"
      />
      <input
        type="text"
        placeholder="KOYEB_API_KEY"
        value={koyebApiKey}
        onChange={(e) => {
          setKoyebApiKey(e.target.value);
          handleInputChange();
        }}
        className="input"
      />
      <button
        className={`button button-deploy ${allFieldsFilled ? "" : "disabled"}`}
        onClick={handleDeploy}
        disabled={!allFieldsFilled}
      >
        Deploy
      </button>
      <div className="w-full flex justify-center">
        <Copyright />
      </div>
    </div>
  );
};

export default Koyeb;
