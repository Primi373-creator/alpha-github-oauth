const QRCode = require("qrcode");
const express = require("express");
const fs = require("fs");
const { makeid } = require("../lib/makeid");
const {
  makeWASocket,
  useMultiFileAuthState,
  Browsers,
  delay,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");
const Paste = require("../models/session");

const router = express.Router();

const io = require("socket.io")();

router.get("/qr", async (req, res) => {
  const id = makeid();

  async function Getqr() {
    const { state, saveCreds } = await useMultiFileAuthState(
      `./session/${id}/`,
    );
    const { version } = await fetchLatestBaileysVersion();

    const client = makeWASocket({
      printQRInTerminal: false,
      downloadHistory: false,
      syncFullHistory: false,
      browser: Browsers.macOS("Desktop"),
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, { level: "silent" }),
      },
      version,
    });

    client.ev.on("connection.update", async (node) => {
      const { connection, lastDisconnect, qr } = node;
      console.log("Connection update:", node);

      if (qr) {
        const qrBuffer = await QRCode.toBuffer(qr);
        const qrBase64 = qrBuffer.toString("base64");
        if (!res.headersSent) {
          res.json({ qr: qrBase64 });
        }
      }

      if (connection === "open") {
        await delay(1000 * 20);
        const unique = fs.readFileSync(__dirname + `/session/${id}/creds.json`);
        const content = Buffer.from(unique).toString("base64");
        const paste = new Paste({
          id: id,
          number: client.user.id,
          banned: false,
          content: content,
        });
        await paste.save();
        await client.ws.close();
        await delay(1000 * 2);
        if (io && req.io) {
          console.log("Connection opened");
          io.emit("session", { sessionId: id });
          console.log("Session ID emitted:", id);
        }
      }

      if (
        connection === "close" &&
        lastDisconnect &&
        lastDisconnect.error &&
        lastDisconnect.error.output.statusCode != 401
      ) {
        console.log("Connection closed, attempting to reconnect");
        Getqr();
      }
    });

    client.ev.on("creds.update", saveCreds);
    client.ev.on("messages.upsert", () => {});
  }

  await Getqr();
});

module.exports = { router, io };
