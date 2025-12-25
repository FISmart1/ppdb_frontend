"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      Swal.fire("Error", "Token tidak valid", "error");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire("Error", "Password tidak cocok", "error");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        password: formData.newPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Password berhasil diubah",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/");
    } catch (err: any) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Token kadaluarsa",
        "error"
      );
    }
  };

  return (
    <form onSubmit={handleReset} className="space-y-4 w-full max-w-sm">
      <input
        type="password"
        name="newPassword"
        placeholder="Password Baru"
        value={formData.newPassword}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded"
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Konfirmasi Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded"
      >
        Reset Password
      </button>
    </form>
  );
}
