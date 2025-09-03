import { NextResponse } from "next/server";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { Api } from "telegram";

const apiId = parseInt(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;
const stringSession = new StringSession(process.env.TELEGRAM_SESSION);

export async function POST(req) {
  try {
    const { phoneNumber } = await req.json();

    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    await client.connect();

    const result = await client.invoke(
      new Api.contacts.ImportContacts({
        contacts: [
          new Api.InputPhoneContact({
            clientId: 0,
            phone: phoneNumber,
            firstName: "Check",
            lastName: "",
          }),
        ],
      })
    );

    const status =
      result.users.length > 0
        ? ` Nomor ${phoneNumber} TERDAFTAR di Telegram`
        : ` Nomor ${phoneNumber} TIDAK terdaftar di Telegram`;

    return NextResponse.json({ success: true, status });
  } catch (err) {
    console.error("Error cek nomor:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
