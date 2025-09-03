"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!phoneNumber) {
      setResult("⚠️ Masukkan nomor terlebih dahulu.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/ceknomor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.status);
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setResult(`🚫 Gagal koneksi ke server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 text-gray-900 p-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[380px] bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 flex flex-col items-center"
      >
        <div className="flex items-center gap-2 mb-6">
          <Search className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">
            Cek Nomor Terdaftar Telegram
          </h1>
        </div>

        <input
          type="text"
          placeholder="Contoh: +6281234567890"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="px-4 py-2 mb-4 rounded-lg text-gray-800 w-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
        />

        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl text-white px-4 py-2 font-semibold disabled:opacity-50"
        >
          {loading ? "Mengecek..." : "Cek Nomor"}
        </button>

        {result && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 text-center text-lg bg-blue-50 text-blue-900 px-4 py-3 rounded-lg w-full shadow"
          >
            {result}
          </motion.p>
        )}
      </motion.div>

      <p className="fixed bottom-4 text-sm text-gray-600 italic">
        Ini dibuat oleh Sahun El Puter
      </p>
    </main>
  );
}


