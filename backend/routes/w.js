const QRCode = require("qrcode");
const express = require("express");
const SSE = require("express-sse");
const fs = require("fs");
const { makeid } = require("../lib/makeid");
const pino = require("pino");
const compression = require("compression");
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

let router = express.Router();
const sse = new SSE();

// Use compression middleware
router.use(compression());

router.get("/qr", async (req, res) => {
  const id = makeid();
  sse.init(req, res, { flush: false }); // Initialize SSE once at the beginning
  console.log("SSE connection initialized");

  async function Getqr() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");
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
        sse.send(
          { type: "qr", data: qrBuffer.toString("base64") },
          { flush: false },
        );
        console.log("QR code sent");
      }

      if (connection == "open") {
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
        sse.send(
          { type: "session", data: { sessionId: id } },
          { flush: false },
        );
        console.log("Session ID sent:", id);
        await delay(1000 * 2);
        process.exit(0);
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
