'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import 'animate.css';
import { ChevronDown } from 'lucide-react';

interface RumahForm {
  luasTanah: string;
  kualitasRumah: string;
  statusKepemilikanRumah: string;
  kendaraanDimiliki: string;
  statusKendaraan: string;
  hartaTidakBergerak: string;
  statusHarta: string;
  dayaListrik: string;
  sumberAir: string;
}

export default function PageFormRumah() {
  const router = useRouter();

  const [formData, setFormData] = useState<RumahForm>({
    luasTanah: '',
    kualitasRumah: '',
    statusKepemilikanRumah: '',
    kendaraanDimiliki: '',
    statusKendaraan: '',
    hartaTidakBergerak: '',
    statusHarta: '',
    dayaListrik: '',
    sumberAir: '',
  });

  const [isLainnya, setIsLainnya] = useState({
    statusKendaraan: false,
    statusHarta: false,
    sumberAir: false,
  });

  const inputClass = 'border border-gray-300 rounded-full px-4 py-3 text-sm sm:text-base placeholder:text-gray-500 focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none w-full min-h-[48px]';
  const selectClass = 'border border-gray-300 rounded-full px-4 py-3 text-sm sm:text-base bg-white focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none w-full min-h-[48px] pr-10 appearance-none';

  const handleNumberOnly = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const onlyNums = value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, [name]: onlyNums }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (['statusKendaraan', 'statusHarta', 'sumberAir'].includes(name) && value.trim() === '') {
      setIsLainnya((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (value === 'lainnya') {
      setIsLainnya((prev) => ({ ...prev, [name]: true }));
      setFormData((prev) => ({ ...prev, [name]: '' }));
    } else {
      setIsLainnya((prev) => ({ ...prev, [name]: false }));
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const emptyFields: string[] = [];
    const labels: Record<keyof RumahForm, string> = {
      luasTanah: 'Luas Tanah',
      kualitasRumah: 'Kualitas Rumah',
      statusKepemilikanRumah: 'Status Kepemilikan Rumah',
      kendaraanDimiliki: 'Kendaraan Bermotor',
      statusKendaraan: 'Status Kendaraan',
      hartaTidakBergerak: 'Harta Tidak Bergerak',
      statusHarta: 'Status Harta',
      dayaListrik: 'Daya Listrik',
      sumberAir: 'Sumber Air',
    };

    const requiredFields: (keyof RumahForm)[] = ['luasTanah', 'kualitasRumah', 'statusKepemilikanRumah', 'dayaListrik', 'sumberAir'];

    requiredFields.forEach((key) => {
      if (!formData[key] || formData[key].trim() === '') {
        emptyFields.push(labels[key]);
      }
    });

    return emptyFields;
  };

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
        confirmButtonText: 'Oke, isi sekarang',
        confirmButtonColor: '#1E3A8A',
      });
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
const user_id = user.id;


    if (!user_id) {
      Swal.fire({
        icon: 'error',
        title: 'User tidak ditemukan!',
        text: 'Silakan login ulang.',
      });
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/pendaftaran/form-rumah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: data.message || 'Terjadi kesalahan.',
        });
      }

      Swal.fire({
        icon: 'success',
        title: 'Data Tersimpan!',
        text: 'Form Data Rumah berhasil disimpan.',
        confirmButtonText: 'Lanjutkan',
        confirmButtonColor: '#1E3A8A',
      }).then(() => router.push('/page-pendaftaran/page-kesehatan'));
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Kesalahan Server',
        text: 'Tidak dapat menghubungi server.',
      });
    }
  };

  const handleBack = () => router.push('/page-pendaftaran/page-orangtua');

  // Komponen select dengan ikon
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

  return (
    <>
      {/* 🔵 HEADER DENGAN GRADIENT */}
      <header className="relative h-64 md:h-72 overflow-hidden">
        <img src="/bck.png" alt="Background Indonesia" className="absolute inset-0 w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/70 via-[#1E3A8A]/10 to-white"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-[#EAF0FF] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">Formulir Pendaftaran Calon Murid</h1>
          <p className="mt-3 text-[#949494] text-base sm:text-lg md:text-xl font-medium opacity-95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]">Data Rumah</p>
        </div>
      </header>

      {/* 🏠 FORM BAGIAN UTAMA */}
      <div className="w-full max-w-6xl mx-auto bg-gray-50 rounded-2xl p-4 sm:p-6 md:p-10 shadow-md animate__animated animate__fadeIn animate__slow">
        <div className="mb-8 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A8A] mb-4">Formulir Pendaftaran Calon Murid</h1>

          <div className="flex justify-center items-center flex-wrap gap-4">
            {[4, 5, 6].map((num, i) => (
              <React.Fragment key={num}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-semibold text-sm sm:text-base ${num === 4 ? 'bg-[#1E3A8A] text-white' : 'bg-gray-300 text-gray-600'}`}>{num}</div>
                  <p className={`mt-1 text-xs sm:text-sm ${num === 4 ? 'text-[#1E3A8A]' : 'text-gray-500'}`}>{num === 5 ? 'Data Kesehatan' : num === 6 ? 'Upload Berkas' : 'Data Rumah'}</p>
                </div>
                {i < 2 && <div className="hidden sm:flex flex-1 h-[2px] bg-gray-300 max-w-[60px]" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
          {/* Data Rumah */}
          <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <h2 className="bg-[#1E3A8A] text-white text-base sm:text-lg font-semibold px-6 py-3">Data Rumah</h2>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input name="luasTanah" placeholder="Luas Tanah" value={formData.luasTanah} onChange={handleNumberOnly} className={`${inputClass} sm:col-span-2`} inputMode="numeric" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">m²</span>
              </div>

              <SelectWithIcon
                name="kualitasRumah"
                value={formData.kualitasRumah}
                onChange={handleChange}
                placeholder="Kualitas Rumah"
                options={[
                  { value: 'permanen', label: 'Permanen' },
                  { value: 'semipermanen', label: 'Semi Permanen' },
                ]}
              />

              <div className="w-full sm:col-span-2">
                <SelectWithIcon
                  name="statusKepemilikanRumah"
                  value={formData.statusKepemilikanRumah}
                  onChange={handleChange}
                  placeholder="Status Kepemilikan Rumah"
                  options={[
                    { value: 'milik_sendiri', label: 'Milik Sendiri' },
                    { value: 'sewa', label: 'Kontrak / Sewa' },
                    { value: 'menumpang', label: 'Menumpang' },
                  ]}
                />
              </div>
            </div>
          </section>

          {/* Fasilitas dan Harta */}
          <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <h2 className="bg-[#1E3A8A] text-white text-base sm:text-lg font-semibold px-6 py-3">Fasilitas dan Harta</h2>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectWithIcon
                name="kendaraanDimiliki"
                value={formData.kendaraanDimiliki}
                onChange={handleChange}
                placeholder="Kendaraan"
                options={[
                  { value: 'motor', label: 'Motor' },
                  { value: 'mobil', label: 'Mobil' },
                  { value: 'tidak_ada', label: 'Tidak Ada' },
                ]}
              />

              <div className="relative transition-all duration-300 ease-in-out">
                {!isLainnya.statusKendaraan ? (
                  <SelectWithIcon
                    name="statusKendaraan"
                    value={formData.statusKendaraan}
                    onChange={handleSelectChange}
                    placeholder="Status Kepemilikan Kendaraan (Jika ada)"
                    options={[
                      { value: 'milik_sendiri', label: 'Milik Sendiri' },
                      { value: 'pinjam', label: 'Pinjam' },
                      { value: 'lainnya', label: 'Lainnya' },
                    ]}
                  />
                ) : (
                  <input
                    name="statusKendaraan"
                    placeholder="Tuliskan status kepemilikan kendaraan..."
                    value={formData.statusKendaraan}
                    onChange={handleChange}
                    onBlur={() => {
                      if (formData.statusKendaraan.trim() === '')
                        setIsLainnya((prev) => ({
                          ...prev,
                          statusKendaraan: false,
                        }));
                    }}
                    className={`${inputClass} bg-blue-50 border-blue-300 animate-fadeIn`}
                    autoFocus
                  />
                )}
              </div>

              <SelectWithIcon
                name="hartaTidakBergerak"
                value={formData.hartaTidakBergerak}
                onChange={handleChange}
                placeholder="Harta Tidak Bergerak (opsional)"
                options={[
                  { value: 'tanah', label: 'Tanah' },
                  { value: 'bangunan', label: 'Bangunan' },
                  { value: 'tidak_ada', label: 'Tidak Ada' },
                ]}
              />

              <div className="relative transition-all duration-300 ease-in-out">
                {!isLainnya.statusHarta ? (
                  <SelectWithIcon
                    name="statusHarta"
                    value={formData.statusHarta}
                    onChange={handleSelectChange}
                    placeholder="Status Kepemilikan Harta"
                    options={[
                      { value: 'milik_sendiri', label: 'Milik Sendiri' },
                      { value: 'warisan', label: 'Warisan' },
                      { value: 'lainnya', label: 'Lainnya' },
                    ]}
                  />
                ) : (
                  <input
                    name="statusHarta"
                    placeholder="Tuliskan status kepemilikan harta..."
                    value={formData.statusHarta}
                    onChange={handleChange}
                    onBlur={() => {
                      if (formData.statusHarta.trim() === '')
                        setIsLainnya((prev) => ({
                          ...prev,
                          statusHarta: false,
                        }));
                    }}
                    className={`${inputClass} bg-blue-50 border-blue-300 animate-fadeIn`}
                    autoFocus
                  />
                )}
              </div>

              <SelectWithIcon
                name="dayaListrik"
                value={formData.dayaListrik}
                onChange={handleChange}
                placeholder="Daya Listrik"
                options={[
                  { value: '450', label: '450 VA' },
                  { value: '900', label: '900 VA' },
                  { value: '1300', label: '1300 VA' },
                  { value: '2200', label: '2200 VA' },
                ]}
              />

              <div className="relative transition-all duration-300 ease-in-out">
                {!isLainnya.sumberAir ? (
                  <SelectWithIcon
                    name="sumberAir"
                    value={formData.sumberAir}
                    onChange={handleSelectChange}
                    placeholder="Sumber Air"
                    options={[
                      { value: 'sumur', label: 'Sumur' },
                      { value: 'pdam', label: 'PDAM' },
                      { value: 'lainnya', label: 'Lainnya' },
                    ]}
                  />
                ) : (
                  <input
                    name="sumberAir"
                    placeholder="Tuliskan sumber air lainnya..."
                    value={formData.sumberAir}
                    onChange={handleChange}
                    onBlur={() => {
                      if (formData.sumberAir.trim() === '') setIsLainnya((prev) => ({ ...prev, sumberAir: false }));
                    }}
                    className={`${inputClass} bg-blue-50 border-blue-300 animate-fadeIn`}
                    autoFocus
                  />
                )}
              </div>
            </div>
          </section>

          <p className="text-center text-xs sm:text-sm text-gray-500">Kolom bertanda (opsional) boleh dikosongkan.</p>

          <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
            <button type="button" onClick={handleBack} className="w-full sm:w-auto bg-gray-300 text-gray-800 font-medium px-6 sm:px-8 py-2 rounded-full hover:bg-gray-400 transition">
              Kembali
            </button>
            <button type="submit" className="w-full sm:w-auto bg-[#1E3A8A] text-white font-medium px-6 sm:px-8 py-2 rounded-full hover:bg-[#162d66] transition">
              Selanjutnya
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-in-out;
        }
      `}</style>
    </>
  );
}
