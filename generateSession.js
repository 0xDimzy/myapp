import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input"; // npm install input

const apiId = XXXXXX; // ganti dengan API_ID Anda
const apiHash = "XXXX"; // ganti dengan API_HASH Anda

const stringSession = new StringSession(""); // kosong dulu

async function main() {
  console.log("=== Generate Telegram Session String ===");

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Masukkan nomor Telegram: "),
    password: async () => await input.text("Password 2FA (jika ada): "),
    phoneCode: async () => await input.text("Kode OTP Telegram: "),
    onError: (err) => console.log(err),
  });

  console.log("\n? Login berhasil!");
  console.log("?? Session string Anda:\n");
  console.log(client.session.save()); // <-- ini yang disalin ke .env.local
  process.exit();
}

main();

