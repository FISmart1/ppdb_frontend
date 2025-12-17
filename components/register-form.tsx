"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    nowa: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, password, confirmPassword , nowa} = formData;

    if (!name || !email || !password || !confirmPassword || !nowa) {
      return alert("Semua field wajib diisi!");
    }

    if (password !== confirmPassword) {
      return alert("Konfirmasi password tidak cocok!");
    }

    try {
      const res = await fetch("https://backend_spmb.smktibazma.sch.id/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name,
          email,
          password,
          nowa,
        }),
      });

      const data = await res.json();
      alert(data.message);
      console.log(res.json());
      if (res.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Terjadi kesalahan pada server!");
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">

      <input
        type="text"
        name="name"
        placeholder="Nama Lengkap"
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d2b6f] outline-none"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Alamat Email"
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d2b6f] outline-none"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="nowa"
        placeholder="Nomor Whatsapp"
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d2b6f] outline-none"
        value={formData.nowa}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Kata Sandi"
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d2b6f] outline-none"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Konfirmasi Kata Sandi"
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d2b6f] outline-none"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        className="w-full bg-[#1d2b6f] text-white py-3 rounded-md hover:bg-[#16215a] transition font-semibold"
      >
        Daftar
      </button>

      <p className="text-center text-sm text-gray-600 mt-2">
        Sudah ada akun?{" "}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="font-semibold text-[#1d2b6f] hover:underline"
        >
          Masuk Disini.
        </button>
      </p>
    </form>
  );
}
