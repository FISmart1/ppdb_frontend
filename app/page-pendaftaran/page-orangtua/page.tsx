"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "animate.css";
import { ChevronDown } from "lucide-react";

interface OrangTuaForm {
  // 🔹 Ayah
  ayah_nama: string;
  ayah_alamat: string;
  ayah_telepon: string;
  ayah_pekerjaan: string;
  ayah_tanggungan: string;
  ayah_penghasilan: string;

  // 🔹 Ibu
  ibu_nama: string;
  ibu_alamat: string;
  ibu_telepon: string;
  ibu_pekerjaan: string;
  ibu_tanggungan: string;
  ibu_penghasilan: string;

  // 🔹 Wali
  wali_nama: string;
  wali_hubungan: string;
  wali_tanggungan: string;
  wali_pekerjaan: string;
  wali_alamat: string;
  wali_sumber: string;
  wali_penghasilan: string;


  // 🔹 Info tambahan
  info_ppdb: string;
  saudara_beasiswa: string;
}

export default function PageFormOrangTua() {
  const router = useRouter();
  const [isLainnya, setIsLainnya] = useState(false);
  const [isLainnyaInfo, setIsLainnyaInfo] = useState(false);
const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState<OrangTuaForm>({
    ayah_nama: "",
    ayah_alamat: "",
    ayah_telepon: "",
    ayah_pekerjaan: "",
    ayah_tanggungan: "",
    ayah_penghasilan: "",

    ibu_nama: "",
    ibu_alamat: "",
    ibu_telepon: "",
    ibu_pekerjaan: "",
    ibu_tanggungan: "",
    ibu_penghasilan: "",

    wali_nama: "",
    wali_hubungan: "",
    wali_tanggungan: "",
    wali_pekerjaan: "",
    wali_alamat: "",
    wali_sumber: "",
    wali_penghasilan: "",

    info_ppdb: "",
    saudara_beasiswa: "",
  });

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user?.id) return;

  const fetchData = async () => {
    const res = await fetch(`https://backend_spmb.smktibazma.sch.id/api/pendaftaran/form-orangtua/${user.id}`);
    const data = await res.json();

    if (res.ok && data && Object.keys(data).length > 0) {
  setIsEdit(true);
  setFormData((prev) => ({
    ...prev,
    ...data,
  }));
}

  };

  fetchData();
}, []);


  const inputClass =
    "border border-gray-300 rounded-full px-4 py-3 text-sm sm:text-base w-full placeholder:text-gray-500 focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none min-h-[50px] sm:min-h-[56px]";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = [
      "ayah_telepon",
      "ayah_penghasilan",
      "ayah_tanggungan",
      "ibu_telepon",
      "ibu_penghasilan",
      "ibu_tanggungan",
      "wali_penghasilan",
      "wali_tanggungan",
      "kerabatTelepon",
    ];
    const finalValue = numericFields.includes(name)
      ? value.replace(/\D/g, "")
      : value;

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    // 🔹 Tambahan logika otomatis balik ke dropdown
    if (name === "wali_sumber" && finalValue.trim() === "") setIsLainnya(false);
    if (name === "info_ppdb" && finalValue.trim() === "")
      setIsLainnyaInfo(false);
  };

  const handleSelectWithOther = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setOther: React.Dispatch<React.SetStateAction<boolean>>,
    key: keyof OrangTuaForm
  ) => {
    const value = e.target.value;

    if (value === "lainnya") {
      // Munculkan input teks "lainnya"
      setOther(true);
      setFormData((prev) => ({ ...prev, [key]: "" }));
    } else {
      // Kalau user ganti pilihan (bukan lainnya), balikin ke dropdown
      setOther(false);
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const validateForm = () => {
    const emptyFields: string[] = [];
    const labels: Record<keyof OrangTuaForm, string> = {
      ayah_nama: "Nama Ayah",
      ayah_alamat: "Alamat Ayah",
      ayah_telepon: "Nomor Telepon Ayah",
      ayah_pekerjaan: "Pekerjaan Ayah",
      ayah_tanggungan: "Jumlah Tanggungan Ayah",
      ayah_penghasilan: "Penghasilan Ayah",

      ibu_nama: "Nama Ibu",
      ibu_alamat: "Alamat Ibu",
      ibu_telepon: "Nomor Telepon Ibu",
      ibu_pekerjaan: "Pekerjaan Ibu",
      ibu_tanggungan: "Jumlah Tanggungan Ibu",
      ibu_penghasilan: "Penghasilan Ibu",

      wali_nama: "Nama Wali",
      wali_hubungan: "Hubungan dengan Calon Murid",
      wali_tanggungan: "Jumlah Tanggungan Wali",
      wali_pekerjaan: "Pekerjaan Wali",
      wali_alamat: "Alamat Wali",
      wali_sumber: "Sumber Penghasilan Wali",
      wali_penghasilan: "Penghasilan Wali",



      info_ppdb: "Mengetahui Informasi PPDB dari",
      saudara_beasiswa: "Memiliki Saudara Penerima Beasiswa",
    };

    const wajibDiisi: (keyof OrangTuaForm)[] = [

      "info_ppdb",
      "saudara_beasiswa",
    ];

    wajibDiisi.forEach((key) => {
      if (!formData[key] || formData[key].trim() === "")
        emptyFields.push(labels[key]);
    });

    return emptyFields;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // VALIDASI REQUIRED
  const emptyFields = Object.entries(formData)
    .filter(([_, value]) => value === "")
    .map(([key]) => key);

  if (emptyFields.length > 0) {
    Swal.fire({
      icon: "warning",
      title: "Data belum lengkap!",
      text: `Field berikut wajib diisi: ${emptyFields.join(", ")}`,
      confirmButtonColor: "#1E3A8A",
    });
    return;
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user?.id) {
    Swal.fire({
      icon: "error",
      title: "Anda belum login!",
      confirmButtonColor: "#1E3A8A",
    });
    return;
  }

  const bodyToSend = { user_id: user.id, ...formData };
// CEK apakah data orang tua sudah ada
const check = await fetch(`https://backend_spmb.smktibazma.sch.id/api/pendaftaran/form-orangtua/${user.id}`);
const checkData = await check.json();

const exists = check.ok && Object.keys(checkData).length > 0;

  try {
    const url = exists
  ? `https://backend_spmb.smktibazma.sch.id/api/pendaftaran/form-orangtua/${user.id}`
  : `https://backend_spmb.smktibazma.sch.id/api/pendaftaran/form-orangtua`;

const method = exists ? "PUT" : "POST";


    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyToSend),
    });

    const data = await res.json();

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan!",
        text: data.message,
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: isEdit ? "Data diperbarui!" : "Data disimpan!",
      text: "Lanjutkan ke tahap berikutnya.",
      confirmButtonColor: "#1E3A8A",
    }).then(() => router.push("/page-pendaftaran/page-rumahtinggal"));

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Server error!",
      text: "Terjadi kesalahan koneksi.",
    });
  }
};



  const handleBack = () => router.push("/page-pendaftaran/page-prestasi");

  const SelectWithIcon = ({
    name,
    value,
    onChange,
    options,
    placeholder,
  }: {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    placeholder: string;
  }) => (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={inputClass + " appearance-none pr-10"}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={20}
      />
    </div>
  );

  return (
    <>
      {/* Header */}
      <header className="relative h-64 md:h-72 overflow-hidden">
        <img
          src="/bck.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/70 via-[#1E3A8A]/10 to-white"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-[#EAF0FF] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
            Formulir Pendaftaran Calon Murid
          </h1>
          <p className="mt-3 text-[#949494] text-base sm:text-lg md:text-xl font-medium opacity-95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]">
            Data Orang Tua/Wali
          </p>
        </div>
      </header>

      {/* Form */}
      <div className="w-full max-w-6xl mx-auto bg-gray-50 rounded-2xl p-4 sm:p-6 md:p-10 shadow-md animate__animated animate__fadeIn animate__slow">
        {/* Stepper */}
        <div className="mb-8 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A8A] mb-4">
            Formulir Pendaftaran Calon Murid
          </h1>
          <div className="flex justify-center items-center flex-wrap gap-4">
            {["1", "2", "3"].map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-semibold ${step === "3"
                        ? "bg-[#1E3A8A] text-white"
                        : "bg-gray-300 text-gray-600"
                      }`}
                  >
                    {step}
                  </div>
                  <p
                    className={`mt-1 text-xs sm:text-sm ${step === "3" ? "text-[#1E3A8A]" : "text-gray-500"
                      }`}
                  >
                    {step === "1"
                      ? "Data Pribadi"
                      : step === "2"
                        ? "Data Prestasi"
                        : "Data Orang Tua / Wali"}
                  </p>
                </div>
                {i < 2 && (
                  <div className="hidden sm:flex flex-1 h-[2px] bg-gray-300 max-w-[60px]" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-10 text-gray-800">
          {/* Bagian Orang Tua */}
          <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <h2 className="bg-[#1E3A8A] text-white text-base sm:text-lg font-semibold px-6 py-3">
              Orang Tua Kandung
            </h2>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* AYAH */}
              <h3 className="col-span-1 md:col-span-2 font-semibold text-[#1E3A8A]">
                Ayah
              </h3>

              <input
                name="ayah_nama"
                placeholder="Nama Ayah"
                value={formData.ayah_nama}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ayah_alamat"
                placeholder="Alamat Ayah"
                value={formData.ayah_alamat}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ayah_telepon"
                placeholder="Nomor Telepon"
                value={formData.ayah_telepon}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ayah_pekerjaan"
                placeholder="Pekerjaan Ayah"
                value={formData.ayah_pekerjaan}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ayah_tanggungan"
                placeholder="Jumlah Tanggungan"
                value={formData.ayah_tanggungan}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ayah_penghasilan"
                placeholder="Penghasilan Ayah"
                value={formData.ayah_penghasilan}
                onChange={handleChange}
                className={inputClass}
              />

              {/* IBU */}
              <h3 className="col-span-1 md:col-span-2 font-semibold text-[#1E3A8A] mt-4">
                Ibu
              </h3>

              <input
                name="ibu_nama"
                placeholder="Nama Ibu"
                value={formData.ibu_nama}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ibu_alamat"
                placeholder="Alamat Ibu"
                value={formData.ibu_alamat}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ibu_telepon"
                placeholder="Nomor Telepon"
                value={formData.ibu_telepon}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ibu_pekerjaan"
                placeholder="Pekerjaan Ibu"
                value={formData.ibu_pekerjaan}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ibu_tanggungan"
                placeholder="Jumlah Tanggungan"
                value={formData.ibu_tanggungan}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ibu_penghasilan"
                placeholder="Penghasilan Ibu"
                value={formData.ibu_penghasilan}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </section>


          {/* Wali */}
          <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <h2 className="bg-[#1E3A8A] text-white text-base sm:text-lg font-semibold px-6 py-3">
              Informasi Wali
            </h2>
            {/* 🧾 Catatan */}
            <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-b-lg p-4 mb-6 text-sm sm:text-base leading-relaxed">
              <p className="font-semibold mb-2">Catatan:</p>
              <p>
                Bagian ini <span className="font-semibold">diisi oleh Orang Tua atau Wali Murid</span>.
                Apabila Murid tidak memiliki wali, silakan isi kolom terkait dengan tanda “-” (strip).
                Untuk kolom yang memerlukan isian angka seperti penghasilan atau tanggungan,
                silakan isi dengan “0” (nol) jika data tidak tersedia. Pastikan seluruh kolom terisi agar proses pendaftaran dapat berjalan dengan lancar dan sistem dapat menyimpan data dengan benar.
              </p>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "wali_nama",
                "wali_hubungan",
                "wali_tanggungan",
                "wali_pekerjaan",
                "wali_alamat",
                "wali_penghasilan",
              ].map((key) => (
                <input
                  key={key}
                  name={key}
                  placeholder={key
                    .replace(/^wali/, "")
                    .replace(/([A-Z])/g, " $1")}
                  value={(formData as any)[key]}
                  onChange={handleChange}
                  className={inputClass}
                />
              ))}

              {!isLainnya ? (
                <div className="md:col-span-2">
                  <SelectWithIcon
                    name="wali_sumber"
                    value={formData.wali_sumber}
                    onChange={(e) =>
                      handleSelectWithOther(e, setIsLainnya, "wali_sumber")
                    }
                    placeholder="Sumber Penghasilan Wali"
                    options={[
                      { value: "usaha", label: "Usaha" },
                      { value: "kerja", label: "Pekerjaan Tetap" },
                      { value: "lainnya", label: "Lainnya" },
                    ]}
                  />
                </div>
              ) : (
                <input
                  name="wali_sumber"
                  placeholder="Tuliskan sumber penghasilan lainnya"
                  value={formData.wali_sumber}
                  onChange={handleChange}
                  onBlur={() => {
                    if (formData.wali_sumber.trim() === "") setIsLainnya(false);
                  }}
                  className={`${inputClass} md:col-span-2`}
                  autoFocus
                />
              )}
            </div>
          </section>

          {/* Kerabat */}
          <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <h2 className="bg-[#1E3A8A] text-white text-base sm:text-lg font-semibold px-6 py-3">
              Kerabat / Kenalan
            </h2>
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isLainnyaInfo ? (
                <SelectWithIcon
                  name="info_ppdb"
                  value={formData.info_ppdb}
                  onChange={(e) =>
                    handleSelectWithOther(e, setIsLainnyaInfo, "info_ppdb")
                  }
                  placeholder="Mengetahui Informasi PPDB dari"
                  options={[
                    { value: "sosmed", label: "Media Sosial" },
                    { value: "teman", label: "Teman" },
                    { value: "lainnya", label: "Lainnya" },
                  ]}
                />
              ) : (
                <input
                  name="info_ppdb"
                  placeholder="Tuliskan sumber informasi lainnya"
                  value={formData.info_ppdb}
                  onChange={handleChange}
                  onBlur={() => {
                    if (formData.info_ppdb.trim() === "")
                      setIsLainnyaInfo(false);
                  }}
                  className={inputClass}
                  autoFocus
                />
              )}

              <SelectWithIcon
                name="saudara_beasiswa"
                value={formData.saudara_beasiswa}
                onChange={handleChange}
                placeholder="Memiliki Saudara atau Kerabat Di SMK TI BAZMA?"
                options={[
                  { value: "ya", label: "Ya" },
                  { value: "tidak", label: "Tidak" },
                ]}
              />
            </div>
          </section>

          {/* Tombol */}
          <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="w-full sm:w-auto bg-gray-300 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-400 transition"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#1E3A8A] text-white px-6 py-2 rounded-full hover:bg-[#162d66] transition"
            >
              Selanjutnya
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
