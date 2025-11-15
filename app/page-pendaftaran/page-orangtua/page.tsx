"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "animate.css";
import { ChevronDown } from "lucide-react";

interface OrangTuaForm {
  // 🔹 Ayah
  ayahNama: string;
  ayahAlamat: string;
  ayahTelepon: string;
  ayahPekerjaan: string;
  ayahTanggungan: string;
  ayahpenghasilan: string;

  // 🔹 Ibu
  ibuNama: string;
  ibuAlamat: string;
  ibuTelepon: string;
  ibuPekerjaan: string;
  ibuTanggungan: string;
  ibupenghasilan: string;

  // 🔹 Wali
  waliNama: string;
  waliHubungan: string;
  waliTanggungan: string;
  waliPekerjaan: string;
  waliAlamat: string;
  waliSumber: string;
  walipenghasilan: string;


  // 🔹 Info tambahan
  infoPPDB: string;
  saudaraBeasiswa: string;
}

export default function PageFormOrangTua() {
  const router = useRouter();
  const [isLainnya, setIsLainnya] = useState(false);
  const [isLainnyaInfo, setIsLainnyaInfo] = useState(false);

  const [formData, setFormData] = useState<OrangTuaForm>({
    ayahNama: "",
    ayahAlamat: "",
    ayahTelepon: "",
    ayahPekerjaan: "",
    ayahTanggungan: "",
    ayahpenghasilan: "",

    ibuNama: "",
    ibuAlamat: "",
    ibuTelepon: "",
    ibuPekerjaan: "",
    ibuTanggungan: "",
    ibupenghasilan: "",

    waliNama: "",
    waliHubungan: "",
    waliTanggungan: "",
    waliPekerjaan: "",
    waliAlamat: "",
    waliSumber: "",
    walipenghasilan: "",

    infoPPDB: "",
    saudaraBeasiswa: "",
  });

  const inputClass =
    "border border-gray-300 rounded-full px-4 py-3 text-sm sm:text-base w-full placeholder:text-gray-500 focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none min-h-[50px] sm:min-h-[56px]";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = [
      "ayahTelepon",
      "ayahpenghasilan",
      "ibuTelepon",
      "ibupenghasilan",
      "walipenghasilan",
      "kerabatTelepon",
    ];
    const finalValue = numericFields.includes(name)
      ? value.replace(/\D/g, "")
      : value;

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    // 🔹 Tambahan logika otomatis balik ke dropdown
    if (name === "waliSumber" && finalValue.trim() === "") setIsLainnya(false);
    if (name === "infoPPDB" && finalValue.trim() === "")
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
      ayahNama: "Nama Ayah",
      ayahAlamat: "Alamat Ayah",
      ayahTelepon: "Nomor Telepon Ayah",
      ayahPekerjaan: "Pekerjaan Ayah",
      ayahTanggungan: "Jumlah Tanggungan Ayah",
      ayahpenghasilan: "Penghasilan Ayah",

      ibuNama: "Nama Ibu",
      ibuAlamat: "Alamat Ibu",
      ibuTelepon: "Nomor Telepon Ibu",
      ibuPekerjaan: "Pekerjaan Ibu",
      ibuTanggungan: "Jumlah Tanggungan Ibu",
      ibupenghasilan: "Penghasilan Ibu",

      waliNama: "Nama Wali",
      waliHubungan: "Hubungan dengan Calon Murid",
      waliTanggungan: "Jumlah Tanggungan Wali",
      waliPekerjaan: "Pekerjaan Wali",
      waliAlamat: "Alamat Wali",
      waliSumber: "Sumber Penghasilan Wali",
      walipenghasilan: "Penghasilan Wali",



      infoPPDB: "Mengetahui Informasi PPDB dari",
      saudaraBeasiswa: "Memiliki Saudara Penerima Beasiswa",
    };

    const wajibDiisi: (keyof OrangTuaForm)[] = [

      "infoPPDB",
      "saudaraBeasiswa",
    ];

    wajibDiisi.forEach((key) => {
      if (!formData[key] || formData[key].trim() === "")
        emptyFields.push(labels[key]);
    });

    return emptyFields;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // VALIDASI REQUIRED FIELD
  const emptyFields = Object.entries(formData)
    .filter(([key, value]) => value === "")
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

  const bodyToSend = {
    user_id: user.id,

    ayahNama: formData.ayahNama,
    ayahAlamat: formData.ayahAlamat,
    ayahTelepon: formData.ayahTelepon,
    ayahPekerjaan: formData.ayahPekerjaan,
    ayahTanggungan: formData.ayahTanggungan,
    ayahpenghasilan: formData.ayahpenghasilan,

    ibuNama: formData.ibuNama,
    ibuAlamat: formData.ibuAlamat,
    ibuTelepon: formData.ibuTelepon,
    ibuPekerjaan: formData.ibuPekerjaan,
    ibuTanggungan: formData.ibuTanggungan,
    ibupenghasilan: formData.ibupenghasilan,

    waliNama: formData.waliNama,
    waliHubungan: formData.waliHubungan,
    waliTanggungan: formData.waliTanggungan,
    waliPekerjaan: formData.waliPekerjaan,
    waliAlamat: formData.waliAlamat,
    waliSumber: formData.waliSumber,
    walipenghasilan: formData.walipenghasilan,

    infoPPDB: formData.infoPPDB,
    saudaraBeasiswa: formData.saudaraBeasiswa,
  };

  try {
    const res = await fetch("http://localhost:5000/api/pendaftaran/form-orangtua", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyToSend),
    });

    const data = await res.json();

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan!",
        text: data.message,
        confirmButtonColor: "#1E3A8A",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Data orang tua/wali sudah disimpan.",
      confirmButtonColor: "#1E3A8A",
    }).then(() => {
      router.push("/page-pendaftaran/page-rumahtinggal"); // redirect ke tahap selanjutnya
    });

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Server error!",
      text: "Terjadi kesalahan koneksi.",
      confirmButtonColor: "#1E3A8A",
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
                name="ayahNama"
                placeholder="Nama Ayah"
                value={formData.ayahNama}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ayahAlamat"
                placeholder="Alamat Ayah"
                value={formData.ayahAlamat}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ayahTelepon"
                placeholder="Nomor Telepon"
                value={formData.ayahTelepon}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ayahPekerjaan"
                placeholder="Pekerjaan Ayah"
                value={formData.ayahPekerjaan}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ayahTanggungan"
                placeholder="Jumlah Tanggungan"
                value={formData.ayahTanggungan}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ayahpenghasilan"
                placeholder="Penghasilan Ayah"
                value={formData.ayahpenghasilan}
                onChange={handleChange}
                className={inputClass}
              />

              {/* IBU */}
              <h3 className="col-span-1 md:col-span-2 font-semibold text-[#1E3A8A] mt-4">
                Ibu
              </h3>

              <input
                name="ibuNama"
                placeholder="Nama Ibu"
                value={formData.ibuNama}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ibuAlamat"
                placeholder="Alamat Ibu"
                value={formData.ibuAlamat}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ibuTelepon"
                placeholder="Nomor Telepon"
                value={formData.ibuTelepon}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ibuPekerjaan"
                placeholder="Pekerjaan Ibu"
                value={formData.ibuPekerjaan}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ibuTanggungan"
                placeholder="Jumlah Tanggungan"
                value={formData.ibuTanggungan}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="ibupenghasilan"
                placeholder="Penghasilan Ibu"
                value={formData.ibupenghasilan}
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
                "waliNama",
                "waliHubungan",
                "waliTanggungan",
                "waliPekerjaan",
                "waliAlamat",
                "walipenghasilan",
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
                    name="waliSumber"
                    value={formData.waliSumber}
                    onChange={(e) =>
                      handleSelectWithOther(e, setIsLainnya, "waliSumber")
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
                  name="waliSumber"
                  placeholder="Tuliskan sumber penghasilan lainnya"
                  value={formData.waliSumber}
                  onChange={handleChange}
                  onBlur={() => {
                    if (formData.waliSumber.trim() === "") setIsLainnya(false);
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
                  name="infoPPDB"
                  value={formData.infoPPDB}
                  onChange={(e) =>
                    handleSelectWithOther(e, setIsLainnyaInfo, "infoPPDB")
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
                  name="infoPPDB"
                  placeholder="Tuliskan sumber informasi lainnya"
                  value={formData.infoPPDB}
                  onChange={handleChange}
                  onBlur={() => {
                    if (formData.infoPPDB.trim() === "")
                      setIsLainnyaInfo(false);
                  }}
                  className={inputClass}
                  autoFocus
                />
              )}

              <SelectWithIcon
                name="saudaraBeasiswa"
                value={formData.saudaraBeasiswa}
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
