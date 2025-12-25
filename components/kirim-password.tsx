"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function SendPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Email Tidak Boleh Kosong!",
        text: "Silahkan masukkan email anda.",
      });
      return;
    }

    try {
      const res = await fetch("https://backend_spmb.smktibazma.sch.id/api/auth/request-reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Email Tidak Ditemukan",
          text: "Pastikan email sudah terdaftar!",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Link reset kata sandi telah dikirim ke email Anda!",
        confirmButtonText: "Kembali ke Login",
      }).then(() => {
        router.push("/");
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Silahkan coba lagi nanti!",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        name="email"
        placeholder="Masukkan Email Anda"
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d2b6f] outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-[#1d2b6f] text-white py-3 rounded-md hover:bg-[#16215a] transition font-semibold"
      >
        Kirim Link Reset
      </button>

      <p className="text-center text-sm text-gray-600 mt-2">
        Sudah ingat kata sandi?{" "}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="font-semibold text-[#1d2b6f] hover:underline"
        >
          Masuk Disini
        </button>
      </p>
    </form>
  );
}
