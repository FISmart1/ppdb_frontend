"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import Swal from "sweetalert2";
import "animate.css";

const PageFormAturan: React.FC = () => {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>([null, null, null]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleBack = () => {
    router.push("/page-pendaftaran/page-uploadberkas");
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const belumIsi = answers
    .map((ans, i) => (ans === null ? `Pernyataan ${i + 1}` : null))
    .filter(Boolean);

  const tidakSetuju = answers
    .map((ans, i) => (ans === "tidak" ? `Pernyataan ${i + 1}` : null))
    .filter(Boolean);

  if (belumIsi.length > 0) {
    Swal.fire({
      icon: "warning",
      title: "Belum Semua Pernyataan Disetujui!",
      html: `
        <p class="mb-2">Kamu belum memilih jawaban untuk:</p>
        <ul style="text-align:left; display:inline-block;">
          ${belumIsi.map((f) => `<li>• ${f}</li>`).join("")}
        </ul>
      `,
      confirmButtonColor: "#1E3A8A"
    });
    return;
  }

  if (tidakSetuju.length > 0) {
    Swal.fire({
      icon: "error",
      title: "Ada Pernyataan yang Tidak Disetujui",
      text: "Semua pernyataan harus dipilih 'Ya' untuk melanjutkan.",
      confirmButtonColor: "#1E3A8A"
    });
    return;
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const user_id = user?.id;

  if (!user_id) {
    Swal.fire({
      icon: "error",
      title: "User tidak ditemukan!",
      text: "Silakan login ulang."
    });
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/pendaftaran/form-aturan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        pernyataan1: answers[0],
        pernyataan2: answers[1],
        pernyataan3: answers[2],
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: data.message || "Terjadi kesalahan.",
      });
    }

    Swal.fire({
      icon: "success",
      title: "Semua Pernyataan Disetujui!",
      confirmButtonColor: "#1E3A8A",
    }).then(() => router.push("/page-pendaftaran/page-terimakasih"));

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Kesalahan Server!",
      text: "Tidak dapat terhubung ke server."
    });
  }
};


  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // 🟦 Pernyataan udah disamain persis seperti versi "Section Aturan Sekolah"
  const pernyataanList = [
    `Saya dengan sungguh-sungguh menyatakan bahwa:
1. Seluruh data dan dokumen yang saya lampirkan dalam berkas pendaftaran PPDB SMK TI BAZMA TA 2025-2026 adalah benar;
2. Saya mendukung anak/tanggungan saya untuk mengikuti seluruh rangkaian seleksi PPDB SMK TI BAZMA yang telah ditetapkan;
3. Jika anak/tanggungan saya diterima, saya memberi izin untuk tinggal di asrama selama masa pendidikan.
(pilihan Ya, atau Tidak)`,
    `Saya dengan sungguh-sungguh menyatakan bahwa:
1. Saya bersedia mematuhi seluruh aturan, tata tertib, dan kebijakan yang berlaku di SMK TI BAZMA;
2. Saya memahami bahwa pelanggaran terhadap aturan dapat mengakibatkan sanksi sesuai ketentuan sekolah.
(pilihan Ya, atau Tidak)`,
    `Saya dengan sungguh-sungguh menyatakan bahwa:
1. Semua informasi yang saya berikan adalah benar;
2. Apabila dibutuhkan, saya bersedia memberikan dokumen tambahan untuk melengkapi data pendaftaran.
(pilihan Ya, atau Tidak)`,
  ];

  return (
    <>
      {/* 🔵 HEADER DENGAN GRADIENT BIRU & PETA INDONESIA */}
      <header className="relative h-64 md:h-72 overflow-hidden">
        <img
          src="/bck.png"
          alt="Background Indonesia"
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/70 via-[#1E3A8A]/10 to-white"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-[#EAF0FF] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
            Formulir Pendaftaran Calon Murid
          </h1>
          <p className="mt-3 text-[#949494] text-base sm:text-lg md:text-xl font-medium opacity-95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]">
            Aturan Sekolah
          </p>
        </div>
      </header>

      {/* 🔷 FORM CONTAINER */}
      <div className="w-full max-w-6xl mx-auto bg-gray-50 rounded-2xl p-4 sm:p-6 md:p-10 shadow-md animate__animated animate__fadeIn animate__slow">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A8A] mb-4">
            Formulir Pendaftaran Calon Murid
          </h1>

          {/* Stepper */}
          <div className="flex justify-center items-center flex-wrap gap-4">

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#1E3A8A] text-white font-semibold text-sm sm:text-base">
                7
              </div>
              <p className="mt-1 text-xs sm:text-sm font-medium text-[#1E3A8A] text-center">
                Aturan Sekolah
              </p>
            </div>
          </div>
        </div>

        {/* 🟩 Judul Tengah */}
        <div className="bg-[#1E3A8A] text-white rounded-t-lg text-center py-3 mb-0 font-semibold text-lg sm:text-xl">
          Section Aturan Sekolah
        </div>

        {/* 🧾 Catatan */}
        <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-b-lg p-4 mb-6 text-sm sm:text-base leading-relaxed">
          <p className="font-semibold mb-2">Catatan:</p>
          <p>
            Bagian ini <span className="font-semibold">diisi oleh Orang Tua atau Wali Murid</span>.
            Harap membaca setiap pernyataan dengan seksama dan memilih “Ya” apabila setuju dengan isi pernyataan.
            Dengan menyetujui semua pernyataan, Orang Tua/Wali dianggap memahami dan mendukung seluruh kebijakan serta aturan sekolah SMK TI BAZMA.
          </p>
        </div>

        {/* 🧩 Accordion Pernyataan */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {pernyataanList.map((text, index) => (
            <div
              key={index}
              className="bg-white border rounded-xl shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                <span>Pernyataan {index + 1}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4 text-sm text-gray-700 whitespace-pre-line animate__animated animate__fadeIn animate__slow">
                  {text}
                  <div className="mt-4 flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`pernyataan-${index}`}
                        value="ya"
                        checked={answers[index] === "ya"}
                        onChange={() => handleAnswerChange(index, "ya")}
                        className="text-[#1E3A8A] focus:ring-[#1E3A8A]"
                      />
                      <span>Ya</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`pernyataan-${index}`}
                        value="tidak"
                        checked={answers[index] === "tidak"}
                        onChange={() => handleAnswerChange(index, "tidak")}
                        className="text-red-500 focus:ring-red-500"
                      />
                      <span>Tidak</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 🔘 Tombol Navigasi */}
          <div className="flex flex-col sm:flex-row justify-between mt-8 gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="w-full sm:w-auto bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-full hover:bg-gray-400 transition"
            >
              Kembali
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-[#1E3A8A] text-white font-medium px-6 py-2 rounded-full hover:bg-[#162d66] transition"
            >
              Selesai
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PageFormAturan;
