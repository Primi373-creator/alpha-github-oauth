const QRCode = require("qrcode");
const express = require("express");
const pino = require("pino");
const fs = require("fs");
const { makeid } = require("../lib/makeid");
const Paste = require("../models/session");
const {
  makeWASocket,
  useMultiFileAuthState,
  Browsers,
  delay,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const router = express.Router();
const path = require("path");
const tempFolderPath = path.join(__dirname, "temp");

function removeFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  fs.rmSync(filePath, {
    recursive: true,
    force: true,
  });
}

router.get("/qr", async (req, res) => {
  const id = makeid();
  async function Getqr() {
    const { state, saveCreds } = await useMultiFileAuthState(
      path.join(tempFolderPath, id),
    );
    const { version } = await fetchLatestBaileysVersion();
    try {
      const client = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        logger: pino({
          level: "silent",
        }),
        browser: ['Chrome', 'Ubuntu', '3.0'],
      });

      client.ev.on("creds.update", saveCreds);
      client.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect, qr } = s;
        if (qr) await res.end(await QRCode.toBuffer(qr));
        if (connection == "open") {
          await delay(5000);
          await delay(5000);
          const credsPath = path.join(tempFolderPath, id, "creds.json");
          const unique = fs.readFileSync(credsPath);
          const content = Buffer.from(unique).toString("base64");
          const paste = new Paste({
            id: id,
            number: client.user.id,
            banned: false,
            content: content,
          });
          await paste.save();
          await client.sendMessage(client.user.id, { text: id });
          await delay(100);
          await client.ws.close();
          return await removeFile(path.join(tempFolderPath, id));
        } else if (
          connection === "close" &&
          lastDisconnect &&
          lastDisconnect.error &&
          lastDisconnect.error.output.statusCode != 401
        ) {
          await delay(10000);
          Getqr();
        }
      });
    } catch (err) {
      if (!res.headersSent) {
        await res.json({
          code: "Service Unavailable",
        });
      }
      console.log(err);
      await removeFile(path.join(tempFolderPath, id));
    }
  }
  return await Getqr();
});

module.exports = router;
