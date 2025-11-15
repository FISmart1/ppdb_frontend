"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function PagePengumuman() {
  const [status, setStatus] = useState<"none" | "pending" | "accepted">("none");

  // 🔍 Cek status dari localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setStatus(parsed.status || "pending"); // default “pending” kalau belum diubah
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* === Header === */}
      <section className="w-full bg-white border-b px-8 py-3 flex justify-between items-center">
        <p className="text-sm text-gray-700 font-medium">
          <b>Home / Pengumuman</b>
        </p>
      </section>

      {/* === Conditional Banner === */}
      {status === "accepted" ? (
        // ✅ LULUS
        <section className="w-full relative mt-10 px-4 md:px-8 animate-fade-in">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img
              src="/lulus-banner.png"
              alt="Banner Lulus"
              className="w-full h-56 md:h-80 object-cover rounded-2xl"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <CheckCircle className="w-14 h-14 text-green-400 mb-4" />
              <h1 className="text-white text-2xl md:text-4xl font-extrabold">
                Selamat Anda Lulus!
              </h1>
              <p className="text-white text-sm md:text-lg opacity-90 mt-2">
                Anda telah berhasil lulus ujian dengan hasil memuaskan.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <h2 className="text-lg md:text-2xl font-bold text-[#1E3A8A]">
              Silakan Lanjut ke Tahap Daftar Ulang
            </h2>
            <button
              onClick={() => alert("Menuju ke halaman daftar ulang")}
              className="mt-4 inline-flex items-center gap-2 bg-[#1E3A8A] text-white px-8 py-3 rounded-full font-medium hover:bg-[#162d66] transition"
            >
              Daftar Ulang →
            </button>
          </div>
        </section>
      ) : status === "pending" ? (
        // ⏳ DALAM PROSES VERIFIKASI
        <section className="w-full mt-10 px-6 sm:px-10 flex flex-col items-center text-center">
          <Clock className="w-16 h-16 text-yellow-500 mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A8A] mb-2">
            Berkas Kamu Sedang Diverifikasi
          </h1>
          <p className="text-gray-700 max-w-xl text-sm sm:text-base leading-relaxed">
            Terima kasih telah mengirimkan formulir pendaftaran ke{" "}
            <b>SMK TI BAZMA</b>. Tim kami sedang memeriksa kelengkapan berkas
            kamu. Mohon menunggu 1–2 hari kerja.  
          </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-yellow-50 border border-yellow-200 px-6 py-4 rounded-lg shadow-sm">
              <p className="text-yellow-700 text-sm sm:text-base">
                ⏳ Status Saat Ini: <b>Menunggu Verifikasi Panitia</b>
              </p>
            </div>
          </div>
        </section>
      ) : (
        // ⚠️ BELUM MENDAFTAR
        <section className="w-full mt-16 px-6 sm:px-10 flex flex-col items-center text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A8A] mb-3">
            Belum Ada Pengumuman
          </h1>
          <p className="text-gray-700 text-sm sm:text-base max-w-xl">
            Kamu belum mengirimkan formulir pendaftaran.  
            Silakan melakukan pendaftaran terlebih dahulu melalui halaman
            <b> Pendaftaran</b>.
          </p>
        </section>
      )}

      {/* === Footer CTA === */}
      <section className="mt-16 px-8">
        <div className="border-b border-gray-300 mb-6"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold">Informasi Lebih Lanjut</h3>
            <p className="text-sm text-gray-600">
              Hubungi kami untuk informasi lebih lanjut.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button
              onClick={() => alert("Menuju ke kontak")}
              className="inline-flex items-center gap-2 border border-[#1E3A8A] text-[#1E3A8A] px-5 py-2 rounded-full font-medium hover:bg-[#1E3A8A] hover:text-white transition"
            >
              Kontak
            </button>
            <button
              onClick={() => window.open("https://wa.me/6285591575527", "_blank")}
              className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2 rounded-full font-medium hover:bg-[#1DA851] transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-5 h-5 fill-current"
              >
                <path d="M16 .395C7.164.395.002 7.558.002 16.395c0 2.883.754 5.701 2.188 8.193L0 32l7.707-2.03c2.39 1.303 5.08 1.988 7.861 1.988h.002c8.838 0 16-7.162 16-16 0-4.271-1.664-8.285-4.688-11.309C24.287 2.059 20.273.395 16 .395zM16 29.08h-.002c-2.523 0-4.992-.674-7.137-1.951l-.51-.301-4.576 1.203 1.219-4.461-.332-.523C3.621 21.816 2.793 19.164 2.793 16.395c0-7.34 5.869-13.199 13.207-13.199 3.523 0 6.84 1.371 9.332 3.863 2.492 2.492 3.863 5.809 3.863 9.332 0 7.338-5.861 13.189-13.195 13.189zm7.232-9.846c-.396-.199-2.352-1.16-2.715-1.289-.363-.133-.629-.199-.895.199-.266.395-1.027 1.285-1.258 1.551-.232.262-.463.295-.859.098-.396-.199-1.672-.615-3.184-1.961-1.176-1.051-1.977-2.348-2.207-2.742-.23-.395-.025-.607.174-.805.178-.178.395-.463.594-.695.199-.23.266-.395.396-.66.131-.262.066-.496-.033-.695-.098-.199-.895-2.156-1.227-2.953-.322-.777-.65-.67-.895-.684-.23-.012-.496-.014-.762-.014s-.695.1-1.059.496c-.363.395-1.395 1.363-1.395 3.324s1.43 3.855 1.629 4.123c.199.262 2.809 4.293 6.805 6.02.949.41 1.688.652 2.262.836.951.303 1.82.26 2.504.158.764-.115 2.352-.961 2.684-1.889.332-.926.332-1.719.232-1.889-.098-.178-.363-.277-.76-.475z" />
              </svg>
              WhatsApp
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
