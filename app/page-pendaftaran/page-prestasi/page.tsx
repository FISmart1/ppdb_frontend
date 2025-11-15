'use client';

import React, { useState, useEffect  } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import 'animate.css';

interface SemesterScore {
  s3: string;
  s4: string;
  s5: string;
}

interface PrestasiForm {
  math: SemesterScore;
  indo: SemesterScore;
  english: SemesterScore;
  ipa: SemesterScore;
  pai: SemesterScore;
  foreignLanguage: string;
  hafalan: string;
  achievement: string;
  organization: string;
  dream: string;
  hobby: string;
  special: string;
}

const PageFormPrestasi: React.FC = () => {
  const router = useRouter();
const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState<PrestasiForm>({
    math: { s3: '', s4: '', s5: '' },
    indo: { s3: '', s4: '', s5: '' },
    english: { s3: '', s4: '', s5: '' },
    ipa: { s3: '', s4: '', s5: '' },
    pai: { s3: '', s4: '', s5: '' },
    foreignLanguage: '',
    hafalan: '',
    achievement: '',
    organization: '',
    dream: '',
    hobby: '',
    special: '',
  });

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: keyof PrestasiForm, semester?: keyof SemesterScore) => {
    const { name, value } = e.target;

    if (field && semester && typeof formData[field] === 'object') {
      const numericValue = value.replace(/\D/g, '');
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...(prev[field] as SemesterScore),
          [semester]: numericValue,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user?.id) return;

  const fetchData = async () => {
    const res = await fetch(`http://localhost:5000/api/pendaftaran/form-prestasi/${user.id}`);
    const data = await res.json();

    if (data && data.id) {
      setIsEdit(true);
      setFormData(normalizePrestasi(data));
    }
  };

  fetchData();
}, []);


  const validateForm = () => {
    const emptyFields: string[] = [];
    const subjects: Record<string, string> = {
      math: 'Matematika',
      indo: 'Bahasa Indonesia',
      english: 'Bahasa Inggris',
      ipa: 'IPA',
      pai: 'PAI',
    };

    for (const key of Object.keys(subjects) as (keyof PrestasiForm)[]) {
      const subject = formData[key] as SemesterScore;
      if (!subject.s3 || !subject.s4 || !subject.s5) {
        emptyFields.push(`Nilai ${subjects[key]} (Semester 3, 4, 5)`);
      }
    }

    const fieldLabels: Record<string, string> = {
      dream: 'Cita-cita',
      hobby: 'Hobi / Kegemaran',
      special: 'Hal Khusus',
    };

    for (const key of Object.keys(fieldLabels) as (keyof PrestasiForm)[]) {
      if ((formData[key] as string).trim() === '') {
        emptyFields.push(fieldLabels[key]);
      }
    }

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
        <p class="mb-2">Lengkapi dulu kolom berikut:</p>
        <ul style="text-align:left; display:inline-block;">
          ${emptyFields.map((f) => `<li>• ${f}</li>`).join('')}
        </ul>
      `,
      confirmButtonColor: '#1E3A8A',
    });
    return;
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const payload = {
    user_id: user.id,
    ...formData
  };

  // Jangan ikut kirim id atau created_at saat update
  delete (payload as any).id;
  delete (payload as any).created_at;

  const url = isEdit
    ? `http://localhost:5000/api/pendaftaran/form-prestasi/${user.id}` // UPDATE
    : `http://localhost:5000/api/pendaftaran/form-prestasi`;           // INSERT

  const method = isEdit ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (res.ok) {
    Swal.fire({
      icon: "success",
      title: isEdit ? "Data prestasi berhasil diperbarui!" : "Data prestasi tersimpan!",
      confirmButtonColor: "#1E3A8A",
    }).then(() => router.push("/page-pendaftaran/page-orangtua"));
  } else {
    Swal.fire("Gagal!", data.message, "error");
  }
};

const normalizePrestasi = (data: any) => {
  return {
    math: {
      s3: data.math_s3 || "",
      s4: data.math_s4 || "",
      s5: data.math_s5 || "",
    },
    indo: {
      s3: data.indo_s3 || "",
      s4: data.indo_s4 || "",
      s5: data.indo_s5 || "",
    },
    english: {
      s3: data.english_s3 || "",
      s4: data.english_s4 || "",
      s5: data.english_s5 || "",
    },
    ipa: {
      s3: data.ipa_s3 || "",
      s4: data.ipa_s4 || "",
      s5: data.ipa_s5 || "",
    },
    pai: {
      s3: data.pai_s3 || "",
      s4: data.pai_s4 || "",
      s5: data.pai_s5 || "",
    },

    foreignLanguage: data.foreignLanguage || "",
    hafalan: data.hafalan || "",
    achievement: data.achievement || "",
    organization: data.organization || "",
    dream: data.dream || "",
    hobby: data.hobby || "",
    special: data.special || "",
  };
};



  const handleBack = () => router.push('/page-pendaftaran');

  const inputClass = 'w-full border border-gray-300 rounded-full px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none transition duration-200';

  const textAreaClass = 'w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none transition duration-200 resize-none leading-relaxed';

  return (
    <>
      {/* 🔵 HEADER */}
      <header className="relative h-64 md:h-72 overflow-hidden">
        <img src="/bck.png" alt="Background Indonesia" className="absolute inset-0 w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/70 via-[#1E3A8A]/10 to-white"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-[#EAF0FF] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">Formulir Pendaftaran Calon Murid</h1>
          <p className="mt-3 text-[#949494] text-base sm:text-lg md:text-xl font-medium opacity-95">Data Prestasi</p>
        </div>
      </header>

      {/* 🧾 FORM SECTION */}
      <div className="w-full max-w-6xl mx-auto bg-gray-50 rounded-2xl p-4 sm:p-6 md:p-10 shadow-md animate__animated animate__fadeIn animate__slow">
        <div className="mb-8 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A8A] mb-4">Formulir Pendaftaran Calon Murid</h1>
          <div className="flex justify-center items-center flex-wrap gap-4">
            {['1', '2', '3'].map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-semibold ${step === '2' ? 'bg-[#1E3A8A] text-white' : 'bg-gray-300 text-gray-600'}`}>{step}</div>
                  <p className={`mt-1 text-xs sm:text-sm ${step === '2' ? 'text-[#1E3A8A]' : 'text-gray-500'}`}>{step === '1' ? 'Data Pribadi' : step === '2' ? 'Data Prestasi' : 'Data Orang Tua / Wali'}</p>
                </div>
                {i < 2 && <div className="hidden sm:flex flex-1 h-[2px] bg-gray-300 max-w-[60px]" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Akademik */}
          <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <h2 className="bg-[#1E3A8A] text-white text-base sm:text-lg font-semibold px-6 py-3">Akademik</h2>

            <div className="p-4 sm:p-6">
              <table className="w-full table-fixed border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="text-gray-700 border-b bg-gray-100">
                    <th className="w-[40%] py-2 text-left px-2">Mata Pelajaran</th>
                    <th className="w-[20%] py-2 text-center px-2">Semester 3</th>
                    <th className="w-[20%] py-2 text-center px-2">Semester 4</th>
                    <th className="w-[20%] py-2 text-center px-2">Semester 5</th>
                  </tr>
                </thead>

                <tbody className="text-gray-800">
                  {[
                    { label: 'Matematika', key: 'math' },
                    { label: 'Bahasa Indonesia', key: 'indo' },
                    { label: 'Bahasa Inggris', key: 'english' },
                    { label: 'IPA (Ilmu Pengetahuan Alam)', key: 'ipa' },
                    { label: 'PAI (Pendidikan Agama Islam)', key: 'pai' },
                  ].map((item) => (
                    <tr key={item.key} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-2">{item.label}</td>
                      {['s3', 's4', 's5'].map((s) => (
                        <td key={s} className="py-2 text-center">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="border rounded-lg px-2 py-1 w-16 sm:w-20 text-center focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none"
                            value={(formData[item.key as keyof PrestasiForm] as SemesterScore)[s as keyof SemesterScore]}
                            onChange={(e) => handleChange(e, item.key as keyof PrestasiForm, s as keyof SemesterScore)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tambahan input di bawah tabel */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="foreignLanguage" placeholder="Bahasa asing yang dikuasai (Jika Ada)" value={formData.foreignLanguage} onChange={handleChange} className={textAreaClass} />
                <textarea name="hafalan" placeholder="Jumlah Hafalan (misal: 5 juz dan tuliskan no juznya)" value={formData.hafalan} onChange={handleChange} className={textAreaClass} rows={2} />
              </div>
            </div>
          </section>

          {/* Riwayat Prestasi */}
          <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <h2 className="bg-[#1E3A8A] text-white text-base sm:text-lg font-semibold px-6 py-3">Riwayat Prestasi</h2>
            <div className="p-4 sm:p-6 grid grid-cols-1 gap-4">
              <textarea name="achievement" placeholder="Riwayat Prestasi  (Kompetisi, juara, Tingkatan) jika ada" value={formData.achievement} onChange={handleChange} className={textAreaClass} rows={2} />
              <textarea name="organization" placeholder="Riwayat Organisasi (Divisi, Jabatan)" value={formData.organization} onChange={handleChange} className={textAreaClass} rows={2} />
            </div>
          </section>

          {/* Cita-cita & Hobi */}
          <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <h2 className="bg-[#1E3A8A] text-white text-base sm:text-lg font-semibold px-6 py-3">Cita-cita & Hobi</h2>
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="dream" placeholder="Cita-cita *" value={formData.dream} onChange={handleChange} className={inputClass} />
              <input type="text" name="hobby" placeholder="Hobi / Kegemaran *" value={formData.hobby} onChange={handleChange} className={inputClass} />
              <textarea name="special" placeholder="Hal Khusus (Keunikan, Passion, Kebiasaan) *" value={formData.special} onChange={handleChange} className={`${textAreaClass} md:col-span-2`} rows={2} />
            </div>
          </section>

          <p className="text-center text-xs sm:text-sm text-gray-500">Kolom bertanda * wajib diisi. Lainnya bersifat opsional.</p>

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
    </>
  );
};

export default PageFormPrestasi;
