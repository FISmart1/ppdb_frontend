"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export default function PagePengumuman() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const stages = [
    { key: "seleksi_berkas", text: "Seleksi Berkas" },
    { key: "tes_akademik", text: "Tes Akademik" },
    { key: "tes_psikotes", text: "Tes Psikotes" },
    { key: "wawancara", text: "Wawancara" },
    { key: "tes_baca_quran", text: "Tes Baca Qur'an" },
    { key: "home_visit", text: "Home Visit" },
    { key: "pengumuman_akhir", text: "Pengumuman Akhir" },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) {
      setLoading(false);
      return;
    }

    fetch(`https://backend_spmb.smktibazma.sch.id/api/pengumuman/${user.id}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center mt-20">Memuat data...</p>;

  if (!data)
    return (
      <div className="text-center mt-20">
        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold mt-4">Belum Ada Pengumuman</h2>
      </div>
    );

  // === CARI STATUS AKHIR ===
  let lastStage = null;

  for (let s of stages) {
    if (data[s.key] !== "pending") {
      lastStage = { ...s, status: data[s.key] };
    }
  }

  // Jika semua pending
  if (!lastStage)
    return (
      <div className="text-center mt-20">
        <Clock className="w-16 h-16 text-yellow-500 mx-auto" />
        <h2 className="text-2xl font-bold text-[#1E3A8A] mt-3">
          Berkas Sedang Diverifikasi
        </h2>
        <p className="text-gray-600 mt-2">
          Mohon menunggu hasil seleksi dari panitia.
        </p>
      </div>
    );

  // === STATUS TIDAK LOLOS ===
  if (lastStage.status === "tidak")
    return (
      <div className="text-center mt-20">
        <XCircle className="w-20 h-20 text-red-500 mx-auto" />
        <h1 className="text-3xl font-bold text-red-600 mt-4">
          Maaf, Anda Tidak Lolos {lastStage.text}
        </h1>
        <p className="text-gray-600 mt-2">
          Tetap semangat, masih banyak kesempatan baik lainnya.
        </p>
      </div>
    );

  // === STATUS LOLOS ===
  if (lastStage.status === "ya")
    return (
      <div className="text-center mt-20">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold text-green-600 mt-4">
          Selamat! Anda Lolos {lastStage.text}
        </h1>
        <p className="text-gray-700 mt-2">
          Silakan mengikuti tahap selanjutnya.
        </p>
      </div>
    );

  return null;
}
