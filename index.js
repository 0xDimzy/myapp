// app/page.jsx (Next.js 13+ dengan React Server Components)
"use client";

import { useState } from "react";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { Api } from "telegram/tl";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [result, setResult] = useState("");
  const [client, setClient] = useState(null);

  const apiId = 123456; // Ganti dengan API_ID Anda
  const apiHash = "123456"; // Ganti dengan API_HASH Anda

  async function login() {
    const stringSession = new StringSession("");
    const tgClient = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    await tgClient.start({
      phoneNumber: async () => window.prompt("Masukkan nomor akun Telegram Anda:"),
      password: async () => window.prompt("Masukkan 2FA password (jika ada):"),
      phoneCode: async () => window.prompt("Masukkan kode OTP Telegram:"),
      onError: (err) => alert(err),
    });

    setClient(tgClient);
    alert("Login berhasil!");
  }

  async function cekNomor() {
    if (!client) {
      alert("Silakan login dulu!");
      return;
    }

    const result = await client.invoke(
      new Api.contacts.ImportContacts({
        contacts: [
          new Api.InputPhoneContact({
            clientId: 0,
            phone: phoneNumber,
            firstName: "Test",
            lastName: "",
          }),
        ],
      })
    );

    if (result.users.length > 0) {
      setResult(`Nomor ${phoneNumber} TERDAFTAR di Telegram.`);
    } else {
      setResult(`Nomor ${phoneNumber} TIDAK terdaftar di Telegram.`);
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Cek Nomor Telegram</h1>
      <button
        onClick={login}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-4"
      >
        Login Telegram
      </button>
      <input
        type="text"
        placeholder="+628123456789"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />
      <button
        onClick={cekNomor}
        className="px-4 py-2 bg-green-500 text-white rounded-lg"
      >
        Cek Nomor
      </button>
      {result && <p className="mt-4 font-semibold">{result}</p>}
    </div>
  );
}

