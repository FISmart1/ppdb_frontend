'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import 'animate.css';
import { ChevronDown } from 'lucide-react';

interface KesehatanForm {
  tinggiBadan: string;
  beratBadan: string;
  penyakitMenular: string;
  penyakitNonMenular: string;
  golonganDarah: string;
  kesehatanMental: string;
  butaWarna: string;
  perokok: string;
}

const PageFormKesehatan: React.FC = () => {
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  // State untuk input dan mode "lainnya"
  const [isMenularLainnya, setIsMenularLainnya] = useState(false);
  const [isNonMenularLainnya, setIsNonMenularLainnya] = useState(false);

  const [formData, setFormData] = useState<KesehatanForm>({
    tinggiBadan: '',
    beratBadan: '',
    penyakitMenular: '',
    penyakitNonMenular: '',
    golonganDarah: '',
    kesehatanMental: '',
    butaWarna: '',
    perokok: '',
  });
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id) return;
if (user.validasi_pendaftaran === "sudah") {
    router.replace("/dashboard");
    return;
  }
    const fetchData = async () => {
      const res = await fetch(`https://backend_spmb.smktibazma.sch.id/api/pendaftaran/form-kesehatan/${user.id}`);
      const data = await res.json();

      if (res.ok && data && Object.keys(data).length > 0) {
        setIsEdit(true);
        setFormData((prev) => ({ ...prev, ...data }));
      }
    };

    fetchData();
  }, []);

  const inputClass = 'w-full border border-gray-300 rounded-full px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none';
  const selectClass = 'w-full border border-gray-300 rounded-full px-4 py-3 text-sm sm:text-base bg-white focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none appearance-none pr-10';

  // 🔹 Fungsi umum ubah data form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Menular: ubah ke input kalau "lainnya"
  const handleSelectMenular = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'lainnya') {
      setIsMenularLainnya(true);
      setFormData((prev) => ({ ...prev, penyakitMenular: '' }));
    } else {
      setIsMenularLainnya(false);
      setFormData((prev) => ({ ...prev, penyakitMenular: value }));
    }
  };

  // 🔹 Non-Menular: ubah ke input kalau "lainnya"
  const handleSelectNonMenular = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'lainnya') {
      setIsNonMenularLainnya(true);
      setFormData((prev) => ({ ...prev, penyakitNonMenular: '' }));
    } else {
      setIsNonMenularLainnya(false);
      setFormData((prev) => ({ ...prev, penyakitNonMenular: value }));
    }
  };

  // 🔹 Komponen dropdown dengan ikon
  const SelectWithIcon = ({ name, value, onChange, options, placeholder }: { name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[]; placeholder: string }) => (
    <div className="relative">
      <select name={name} value={value} onChange={onChange} className={selectClass}>
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
    </div>
  );

  // 🔹 Validasi isi form
  const validateForm = () => {
  const labels: Record<keyof KesehatanForm, string> = {
    tinggiBadan: "Tinggi Badan",
    beratBadan: "Berat Badan",
    penyakitMenular: "Penyakit Menular",
    penyakitNonMenular: "Penyakit Non-Menular / Alergi",
    golonganDarah: "Golongan Darah",
    kesehatanMental: "Riwayat Kesehatan Mental",
    butaWarna: "Kondisi Buta Warna",
    perokok: "Status Merokok",
  };

  const emptyFields: string[] = [];

  (Object.keys(formData) as (keyof KesehatanForm)[]).forEach((key) => {
    const value = formData[key];

    // 💥 pastikan dibandingkan sebagai string
    const str = value !== undefined && value !== null ? String(value).trim() : "";

    if (str === "") {
      emptyFields.push(labels[key]);
    }
  });

  return emptyFields;
};


  // 🔹 Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emptyFields = validateForm();
    if (emptyFields.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap!',
        html: `
        <p class="mb-2">Lengkapi kolom berikut:</p>
        <ul style="text-align:left; display:inline-block;">
          ${emptyFields.map((f) => `<li>• ${f}</li>`).join('')}
        </ul>
      `,
        confirmButtonText: 'Oke',
        confirmButtonColor: '#1E3A8A',
      });
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user?.id;

    if (!user_id) {
      Swal.fire({
        icon: 'error',
        title: 'User tidak ditemukan!',
        text: 'Silakan login ulang.',
      });
      return;
    }

    // 🔥 CEK: apakah user sudah pernah isi form kesehatan?
    const check = await fetch(`https://backend_spmb.smktibazma.sch.id/api/pendaftaran/form-kesehatan/${user_id}`);

    const resCheck = await check.json();
const exists = check.ok && Object.keys(resCheck).length > 0;


    const method = exists ? 'PUT' : 'POST';
    const url = exists ? `https://backend_spmb.smktibazma.sch.id/api/pendaftaran/form-kesehatan/${user_id}` : `https://backend_spmb.smktibazma.sch.id/api/pendaftaran/form-kesehatan`;
setIsLoading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          ...formData,
        }),
      });

      const data = await res.json();
setIsLoading(false);
      if (!res.ok) {
        return Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: data.message || 'Terjadi kesalahan.',
        });
      }

      Swal.fire({
        icon: 'success',
        title: exists ? 'Data Diperbarui!' : 'Data Tersimpan!',
        text: exists ? 'Form kesehatan berhasil diperbarui.' : 'Form kesehatan berhasil disimpan.',
        confirmButtonText: 'Lanjutkan',
        confirmButtonColor: '#1E3A8A',
      }).then(() => {
        router.push('/page-pendaftaran/page-uploadberkas');
      });
    } catch (err) {
      setIsLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Kesalahan Server',
        text: 'Tidak dapat menghubungi server.',
      });
    }
  };

  const handleBack = () => router.push('/page-pendaftaran/page-rumahtinggal');

  return (
    <>
      {/* HEADER */}
      <header className="relative h-64 md:h-72 overflow-hidden">
        <img src="/bck.png" alt="Background Indonesia" className="absolute inset-0 w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/70 via-[#1E3A8A]/10 to-white"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-[#EAF0FF] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">Formulir Pendaftaran Calon Murid</h1>
          <p className="mt-3 text-[#949494] text-base sm:text-lg md:text-xl font-medium opacity-95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]">Data Kesehatan</p>
        </div>
      </header>

      {/* FORM */}
      {/* 🏠 FORM BAGIAN UTAMA */}
      <div className="w-full max-w-6xl mx-auto bg-gray-50 rounded-xl p-4 sm:p-6 md:p-10 shadow-sm animate__animated animate__fadeIn mt-6">
        <div className="mb-8 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A8A] mb-4">Formulir Pendaftaran Calon Murid</h1>

          <div className="flex justify-center items-center flex-wrap gap-4">
            {[4, 5, 6].map((num, i) => (
              <React.Fragment key={num}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-semibold text-sm sm:text-base ${num === 5 ? 'bg-[#1E3A8A] text-white' : 'bg-gray-300 text-gray-600'}`}>{num}</div>
                  <p className={`mt-1 text-xs sm:text-sm ${num === 5 ? 'text-[#1E3A8A]' : 'text-gray-500'}`}>{num === 5 ? 'Data Kesehatan' : num === 6 ? 'Upload Berkas' : 'Data Rumah'}</p>
                </div>
                {i < 2 && <div className="hidden sm:flex flex-1 h-[2px] bg-gray-300 max-w-[60px]" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <h2 className="bg-[#1E3A8A] text-white text-base sm:text-lg font-semibold px-6 py-3">Riwayat Kesehatan Calon Murid</h2>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tinggi & Berat */}
              <div className="relative">
                <input type="number" name="tinggiBadan" placeholder="Tinggi Badan (cm)" value={formData.tinggiBadan} onChange={handleChange} className={inputClass} min={0} />
              </div>
              <div className="relative">
                <input type="number" name="beratBadan" placeholder="Berat Badan (kg)" value={formData.beratBadan} onChange={handleChange} className={inputClass} min={0} />
              </div>

              {/* Penyakit Menular */}
              {!isMenularLainnya ? (
                <SelectWithIcon
                  name="penyakitMenular"
                  value={formData.penyakitMenular}
                  onChange={handleSelectMenular}
                  placeholder="Penyakit Menular"
                  options={[
                    { value: 'tbc', label: 'TBC' },
                    { value: 'hiv', label: 'HIV/AIDS' },
                    { value: 'scabies', label: 'Scabies' },
                    { value: 'lainnya', label: 'Lainnya' },
                  ]}
                />
              ) : (
                <input
                  name="penyakitMenular"
                  placeholder="Tuliskan penyakit menular lainnya"
                  value={formData.penyakitMenular}
                  onChange={handleChange}
                  onBlur={() => {
                    if (formData.penyakitMenular.trim() === '') setIsMenularLainnya(false);
                  }}
                  className={inputClass}
                  autoFocus
                />
              )}

              {/* Penyakit Non-Menular */}
              {!isNonMenularLainnya ? (
                <SelectWithIcon
                  name="penyakitNonMenular"
                  value={formData.penyakitNonMenular}
                  onChange={handleSelectNonMenular}
                  placeholder="Penyakit Non-Menular / Alergi"
                  options={[
                    { value: 'asma', label: 'Asma' },
                    { value: 'alergi', label: 'Alergi' },
                    { value: 'lainnya', label: 'Lainnya' },
                  ]}
                />
              ) : (
                <input
                  name="penyakitNonMenular"
                  placeholder="Tuliskan penyakit non-menular / alergi lainnya"
                  value={formData.penyakitNonMenular}
                  onChange={handleChange}
                  onBlur={() => {
                    if (formData.penyakitNonMenular.trim() === '') setIsNonMenularLainnya(false);
                  }}
                  className={inputClass}
                  autoFocus
                />
              )}

              {/* Riwayat Kesehatan Mental */}
              <SelectWithIcon
                name="kesehatanMental"
                value={formData.kesehatanMental}
                onChange={handleChange}
                placeholder="Memiliki riwayat kesehatan mental?"
                options={[
                  { value: 'ya', label: 'Ya' },
                  { value: 'tidak', label: 'Tidak' },
                ]}
              />

              {/* Golongan Darah */}
              <SelectWithIcon
                name="golonganDarah"
                value={formData.golonganDarah}
                onChange={handleChange}
                placeholder="Golongan Darah"
                options={[
                  { value: 'A', label: 'A' },
                  { value: 'B', label: 'B' },
                  { value: 'AB', label: 'AB' },
                  { value: 'O', label: 'O' },
                  { value: 'belum', label: 'Belum Pernah Tes' },
                ]}
              />

              {/* Buta Warna */}
              <SelectWithIcon
                name="butaWarna"
                value={formData.butaWarna}
                onChange={handleChange}
                placeholder="Apakah Anda Buta Warna?"
                options={[
                  { value: 'ya', label: 'Ya' },
                  { value: 'tidak', label: 'Tidak' },
                ]}
              />

              {/* Perokok */}
              <SelectWithIcon
                name="perokok"
                value={formData.perokok}
                onChange={handleChange}
                placeholder="Apakah Anda Perokok?"
                options={[
                  { value: 'ya', label: 'Aktif' },
                  { value: 'tidak', label: 'Pasif' },
                  { value: 'bukan', label: 'Tidak sama sekali' },
                ]}
              />
            </div>
          </section>

          <p className="text-center text-xs sm:text-sm text-gray-500">Pastikan semua data kesehatan sudah diisi dengan benar.</p>

          {/* Tombol */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button type="button" onClick={handleBack} className="w-full sm:w-auto bg-gray-300 text-gray-800 font-medium px-6 sm:px-8 py-2 rounded-full hover:bg-gray-400 transition">
              Kembali
            </button>
            <button type="submit" className="w-full sm:w-auto bg-[#1E3A8A] text-white font-medium px-6 sm:px-8 py-2 rounded-full hover:bg-[#162d66] transition">
              Selanjutnya
            </button>
          </div>
        </form>
      </div>
      {isLoading && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[9999] flex flex-col items-center justify-center animate__animated animate__fadeIn">
    <div className="relative w-24 h-24">
      {/* Pulse outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>

      {/* Inner spinning ring */}
      <div className="absolute inset-3 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
    </div>

    <p className="text-white font-semibold mt-6 text-lg tracking-wide animate__animated animate__fadeIn animate__slow">
      Menyimpan data...
    </p>
  </div>
)}
    </>
  );
};

export default PageFormKesehatan;
