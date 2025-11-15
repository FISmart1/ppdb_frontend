'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FileText, Megaphone, Clock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Step Alur Pendaftaran
const steps = [
  {
    name: 'Pendaftaran',
    activeImg: '/icons/1 (3).png',
    inactiveImg: '/icons/1 (2).png',
  },
  {
    name: 'Tes Akademik',
    activeImg: '/icons/1 (5).png',
    inactiveImg: '/icons/1 (6).png',
  },
  {
    name: "Tes Baca Al-Qur'an",
    activeImg: '/icons/1 (5).png',
    inactiveImg: '/icons/1 (6).png',
  },
  {
    name: 'Wawancara',
    activeImg: '/icons/1 (9).png',
    inactiveImg: '/icons/1 (10).png',
  },
  {
    name: 'Psikotes',
    activeImg: '/icons/1 (7).png',
    inactiveImg: '/icons/1 (8).png',
  },
  {
    name: 'Home Visit',
    activeImg: '/icons/1 (14).png',
    inactiveImg: '/icons/1 (13).png',
  },
  {
    name: 'Pengumuman',
    activeImg: '/icons/1 (11).png',
    inactiveImg: '/icons/1 (12).png',
  },
];

export default function PagePendaftaran() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<'none' | 'pending' | 'accepted'>('none');
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    setMounted(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      setStatus('none');
      setLoadingStatus(false);
      return;
    }

    const checkComplete = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/pendaftaran/user/${user.id}/is-complete`);
        const result = await res.json();

        if (result.isComplete) {
          setStatus('accepted'); // SUDAH MENDAFTAR / SUDAH LENGKAP
        } else {
          setStatus('none'); // BELUM MENGISI FORM
        }
      } catch (err) {
        console.error(err);
        setStatus('none');
      }
      setLoadingStatus(false);
    };

    checkComplete();
  }, []);

  const activeStep = status === 'none' ? 0 : status === 'pending' ? 1 : status === 'accepted' ? 5 : 0;

  return (
    <div>
      {/* Header breadcrumb */}
      <section className="w-full bg-white border-b px-8 py-3 flex justify-between items-center">
        <p className="text-sm text-gray-700 font-medium">
          <b>Home / Pendaftaran</b>
        </p>
      </section>

      {/* Header Info Pendaftaran */}
      <section className="mt-20 w-full ">
        <div className="bg-[#1E3A8A] text-white rounded-xl shadow-lg p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-10">
            {/* ICON BERDASARKAN STATUS */}
            {status === 'none' && <FileText className="w-10 h-10 text-white" />}
            {status === 'pending' && <Clock className="w-10 h-10 text-yellow-300" />}
            {status === 'accepted' && <CheckCircle className="w-10 h-10 text-green-400" />}

            <div>
              {status === 'none' && (
                <>
                  <h2 className="text-xl font-bold">Belum Mendaftar</h2>
                  <p className="text-sm text-gray-200">Lengkapi formulir untuk memulai pendaftaran SPMB SMK TI Bazma.</p>
                </>
              )}

              {status === 'accepted' && (
                <>
                  <h2 className="text-xl font-bold text-green-300">Selamat, Anda Telah Terdaftar!</h2>
                  <p className="text-sm text-gray-200">Data kamu sudah lengkap dan sudah masuk ke sistem.</p>
                </>
              )}
            </div>
          </div>

          {status === 'none' && (
            <button onClick={() => router.push('/page-pendaftaran')} className="bg-white text-[#1E3A8A] font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition">
              Daftar Sekarang →
            </button>
          )}

          {status === 'accepted' && <span className="text-green-200 font-semibold">✔ Anda sudah mendaftar</span>}
        </div>
      </section>

      <section className="relative mb-16 text-center py-14 px-6 bg-gradient-to-r from-[#e8eeff] to-[#f5f8ff] rounded-2xl shadow-lg overflow-hidden mt-10">
        {/* Ornamen latar */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-[#1E3A8A]/10 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-[#3b82f6]/10 rounded-full blur-3xl -z-0"></div>

        {/* Konten utama */}
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E3A8A] mb-4 tracking-tight">Ikuti Langkah-langkah Pendaftaran SPMB</h2>

          <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
            Proses pendaftaran di <b>SMK TI Bazma</b> dibuat mudah, cepat, dan transparan. Ikuti setiap tahap di bawah ini dan raih kesempatan menjadi bagian dari generasi teknologi masa depan!
          </p>

          {/* Garis hias di bawah teks */}
          <div className="flex justify-center">
            <div className="w-24 h-1 rounded-full bg-[#1E3A8A]"></div>
          </div>
        </div>
      </section>

      {/* Gambar Header + Tombol Modal */}
      <section className="mb-10 mt-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative">
            <img src="/Frame 30171.png" alt="Alur Pendaftaran Header" className="w-full h-auto" />
            <div className="absolute inset-0 flex justify-end items-center px-6">
              <button onClick={() => setShowModal(true)} className="border border-white text-white px-4 py-1 rounded-lg text-sm hover:bg-white hover:text-[#1E3A8A] transition">
                Tata Cara Pendaftaran
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL TATA CARA PENDAFTARAN */}
      {showModal && (
        <>
          {/* Latar belakang hitam transparan */}
          <div className="fixed inset-0 bg-black/50 z-[1000]" onClick={() => setShowModal(false)}></div>

          {/* Kontainer popup */}
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 animate-fadeIn">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto">
              {/* Tombol close (X) */}
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
                ✕
              </button>

              {/* Judul */}
              <h2 className="text-2xl font-bold text-[#1E3A8A] text-center mb-8">Rangkaian Alur Seleksi</h2>

              {/* Langkah-langkah singkat */}
              <ol className="list-decimal list-inside space-y-3 text-gray-700 text-sm md:text-base leading-relaxed">
                <li>
                  <b>Daftar Akun:</b> Buat akun di website resmi SPMB SMK TI Bazma.
                </li>
                <li>
                  <b>Lengkapi Formulir:</b> Isi data diri dan unggah dokumen yang diminta.
                </li>
                <li>
                  <b>Ikuti Keseluruhan Rangkaian Seleksi:</b> Tes Akademik, Tes Bacaan Al-Qur'an, Wawancara, Survey Faktual, Psikotes.
                </li>
                <li>
                  <b>Pantuhir:</b> Penentuan Akhir.
                </li>

                <li>
                  <b>Pengumuman:</b> Cek hasil seleksi di website atau grup resmi.
                </li>
                <li>
                  <b>Daftar Ulang:</b> Selesaikan proses daftar ulang jika dinyatakan lulus.
                </li>
              </ol>

              {/* Garis pemisah */}
              <div className="border-t my-8 border-gray-300"></div>

              {/* Bagian Berkas yang Harus Disiapkan */}
              <div>
                <h3 className="text-xl font-semibold text-[#1E3A8A] mb-3 flex items-center gap-2">📄 Berkas yang Harus Disiapkan</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
                  <li>Dokumen Nilai Rapor Semester 3-5</li>
                  <li>Screenshot Bukti Follow IG @smktibazma</li>
                  <li>Scan/Foto Kartu Keluarga</li>
                  <li>Scan/Foto Kartu BPJS atau KIS</li>
                  <li>Scan/Foto Kartu Indonesia Pintar (Jika Ada)</li>
                  <li>Surat Rekomendasi dari Sekolah Asal</li>
                  <li>Surat Keterangan Tidak Mampu (SKTM) dari DKM Masjid Setempat</li>
                  <li>Membuat Video Reels Sesuai Ketentuan</li>
                  <li>Bukti Pembayaran Listrik</li>
                  <li>Pas Foto Berwarna Ukuran 3x4 </li>
                </ul>

                {/* Tombol unduh template per berkas */}
                <div className="mt-6 space-y-3">
                  <p className="text-sm text-gray-600 mb-2">Gunakan template resmi berikut untuk mempermudah pembuatan surat:</p>

                  <div className="flex flex-col md:flex-row gap-3">
                    {/* Surat Rekomendasi */}
                    <a href="/files/suratrekomendasi.pdf" download="suratrekomendasi.pdf" className="flex-1 text-center px-5 py-2 bg-[#1E3A8A] text-white rounded-full hover:bg-[#162c6e] transition">
                      📘 Unduh Surat Rekomendasi
                    </a>

                    {/* Surat SKTM */}
                    <a href="/files/sktmdarimasjid.pdf" download="sktmdarimasjid.pdf" className="flex-1 text-center px-5 py-2 bg-[#1E3A8A] text-white rounded-full hover:bg-[#162c6e] transition">
                      📄 Unduh Surat SKTM
                    </a>
                  </div>
                </div>
              </div>

              {/* Tombol tutup */}
              <div className="flex justify-center mt-8">
                <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-[#1E3A8A] text-white rounded-full hover:bg-[#162c6e] transition">
                  Saya Mengerti
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Alur Pendaftaran (Stepper) */}
      <section className="mb-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
          {/* Desktop */}
          <div className="hidden md:flex relative justify-between items-start">
            {steps.map((step, idx) => {
              const isActive = idx <= activeStep;
              return (
                <div key={idx} className="flex flex-col items-center text-center relative flex-1">
                  {idx !== steps.length - 1 && (
                    <div
                      className={`absolute top-10 left-1/2 w-full h-[2px] ${idx < activeStep ? 'bg-green-500' : 'bg-gray-300'}`}
                      style={{
                        transform: 'translateX(50%)',
                        width: 'calc(50%)',
                      }}
                    ></div>
                  )}
                  <div className="relative z-10 inline-block">
                    <div className={`absolute -top-3 -left-3 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>{idx + 1}</div>
                    <img src={isActive ? step.activeImg : step.inactiveImg} alt={step.name} className="w-20 h-20 md:w-24 md:h-24 object-contain" />
                  </div>
                  <p className={`mt-2 text-sm md:text-base ${isActive ? 'font-semibold text-[#1E3A8A]' : 'text-gray-600'}`}>{step.name}</p>
                </div>
              );
            })}
          </div>

          {/* Mobile */}
          {/* Versi mobile: grid 2 kolom */}
          <div className="grid grid-cols-2 gap-6 md:hidden place-items-center">
            {steps.map((step, idx) => {
              const isActive = idx === 0;
              const isLastOdd = steps.length % 2 !== 0 && idx === steps.length - 1; // ganjil & elemen terakhir

              return (
                <div key={idx} className={`flex flex-col items-center ${isLastOdd ? 'col-span-2 justify-self-center' : ''}`}>
                  <div className="relative">
                    <div className={`absolute -top-2 -left-2 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${isActive ? 'bg-green-500 text-white' : 'bg-[#1E3A8A] text-white'}`}>{idx + 1}</div>
                    <img src={isActive ? step.activeImg : step.inactiveImg} alt={step.name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
                  </div>
                  <p className={`text-xs sm:text-sm mt-2 text-center ${isActive ? 'font-semibold text-[#1E3A8A]' : 'text-gray-600'}`}>{step.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
