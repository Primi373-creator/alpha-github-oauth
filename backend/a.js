const {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
  fetchLatestBaileysVersion,
  delay,
  makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");

const connectToWhatsApp = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const { version } = await fetchLatestBaileysVersion();

  const client = makeWASocket({
    printQRInTerminal: true,
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
    const { connection, lastDisconnect } = node;
    if (connection == "open") {
      console.log("Connecting to Whatsapp...");
      console.log("connected");
    }
    if (connection === "close") {
      if (
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
      ) {
        await delay(300);
        connectToWhatsApp();
        console.log("reconnecting...");
        console.log(node);
      } else {
        console.log("connection closed");
        await delay(3000);
        process.exit(0);
      }
    }
  });

  client.ev.on("creds.update", saveCreds);

  return client;
};

connectToWhatsApp();
