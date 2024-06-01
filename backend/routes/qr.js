const QRCode = require("qrcode");
const express = require("express");
const fs = require("fs");
const { makeid } = require("../lib/makeid");
const pino = require("pino");
const {
  makeWASocket,
  useMultiFileAuthState,
  Browsers,
  delay,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");
const Paste = require("../models/session");

const router = express.Router();

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
        req.io.emit("qr", qrBuffer.toString("base64"));
        console.log("QR code sent");
      }

      if (connection === "open") {
        console.log("Connection opened");
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
        return req.io.emit("session", { sessionId: id }).then(() => {
          console.log("Session ID sent:", id);
        });
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

  return await Getqr();
});

module.exports = router;
