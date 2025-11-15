'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Home, Heart, FileText, Trophy, Image, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';

export default function RiwayatLamaran() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({});
  const [housePhotos, setHousePhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // ambil user_id dari localStorage
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};

  const user_id = user.id;

  const API_URL = `http://localhost:5000/api/pendaftaran/user/${user_id}/full`;

  useEffect(() => {
    if (!user_id) {
      console.warn('User ID tidak ditemukan.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Gagal ambil data');
        const data = await res.json();

        // === MAPPING DATA ===
        setFormData({
          // --- DATA DIRI ---
          fullName: data.bio?.fullName,
          nisn: data.bio?.nisn,
          nik: data.bio?.nik,
          birthPlace: data.bio?.birthPlace,
          birthDate: data.bio?.birthDate
            ? new Date(data.bio.birthDate).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
            : '-',

          address: data.bio?.addressDetail,
          schoolOrigin: data.bio?.schoolOrigin,

          // --- DATA ORANG TUA ---
          fatherName: data.orangtua?.ayah_nama,
          fatherJob: data.orangtua?.ayah_pekerjaan,
          motherName: data.orangtua?.ibu_nama,
          motherJob: data.orangtua?.ibu_pekerjaan,
          phone: data.orangtua?.ayah_telepon,
          parentAddress: data.orangtua?.ayah_alamat,

          // --- PRESTASI ---
          achievementField: data.pres?.achievement,
          achievementName: data.pres?.hafalan,
          achievementLevel: data.pres?.organization,
          majorInterest: data.pres?.hobby,

          // --- KONDISI RUMAH ---
          houseType: data.rumah?.kualitasRumah,
          houseStatus: data.rumah?.statusKepemilikanRumah,
          waterSource: data.rumah?.sumberAir,
          electricity: data.rumah?.dayaListrik,

          // --- KESEHATAN ---
          bloodType: data.kesehatan?.golonganDarah,
          weight: data.kesehatan?.beratBadan,
          height: data.kesehatan?.tinggiBadan,
          butawarna: data.kesehatan?.butaWarna,
          penyakitMenular: data.kesehatan?.penyakitMenular,
          penyakitNonMenular: data.kesehatan?.penyakitNonMenular,

          // --- ATURAN ---
          rulesAgreement: data.aturan?.pernyataan1,
        });

        const backendURL = 'http://localhost:5000/uploads/';

        // foto rumah
        setHousePhotos(
          data.berkas
            ? ([
                data.berkas.rumah_depan ? backendURL + data.berkas.rumah_depan : null,

                data.berkas.rumah_ruangtamu ? backendURL + data.berkas.rumah_ruangtamu : null,

                data.berkas.rumah_kamar ? backendURL + data.berkas.rumah_kamar : null,
              ].filter(Boolean) as string[])
            : []
        );
      } catch (err) {
        console.error('ERROR FETCH:', err);
        setFormData({});
        setHousePhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user_id]);

  // === KOMPONEN SECTION ===
  const Section = ({ title, icon, children }: { title: string; icon: JSX.Element; children: React.ReactNode }) => (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-7 space-y-4 hover:shadow-lg transition-all duration-200">
      <h2 className="text-lg sm:text-xl font-bold text-[#1E3A8A] flex items-center gap-2 border-b pb-2">
        {icon} {title}
      </h2>
      {children}
    </section>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-600 font-medium animate-pulse">🔄 Memuat data pendaftaran...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 px-3 sm:px-6 py-8 sm:py-10 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-5xl bg-[#1E3A8A] text-white py-4 px-6 rounded-t-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-lg">
        <h1 className="font-bold text-lg sm:text-xl flex items-center gap-2 justify-center sm:justify-start">
          <FileText className="w-6 h-6" />
          Riwayat Pendaftaran
        </h1>
        <button onClick={() => router.push('/dashboard')} className="flex items-center justify-center gap-2 bg-white text-[#1E3A8A] px-4 py-2 rounded-full text-sm sm:text-base font-semibold hover:bg-gray-100 transition">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </button>
      </div>

      {/* Konten utama */}
      <div className="w-full max-w-5xl bg-white rounded-b-2xl shadow-md border-t-0 p-5 sm:p-10 space-y-8 sm:space-y-10">
        {/* DATA DIRI */}
        <Section title="Data Diri" icon={<User className="w-5 h-5" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-700 text-sm sm:text-base">
            <p>
              <strong>Nama Lengkap:</strong> {formData.fullName}
            </p>
            <p>
              <strong>NISN:</strong> {formData.nisn || '-'}
            </p>
            <p>
              <strong>NIK:</strong> {formData.nik || '-'}
            </p>
            <p>
              <strong>Tempat Lahir:</strong> {formData.birthPlace || '-'}
            </p>
            <p>
              <strong>Tanggal Lahir:</strong> {formData.birthDate || '-'}
            </p>
            <p>
              <strong>Alamat:</strong> {formData.address || '-'}
            </p>
            <p>
              <strong>Asal Sekolah:</strong> {formData.schoolOrigin || '-'}
            </p>
          </div>
        </Section>

        {/* ORANG TUA */}
        <Section title="Data Orang Tua" icon={<Home className="w-5 h-5" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-700 text-sm sm:text-base">
            <p>
              <strong>Nama Ayah:</strong> {formData.fatherName || '-'}
            </p>
            <p>
              <strong>Pekerjaan Ayah:</strong> {formData.fatherJob || '-'}
            </p>
            <p>
              <strong>Nama Ibu:</strong> {formData.motherName || '-'}
            </p>
            <p>
              <strong>Pekerjaan Ibu:</strong> {formData.motherJob || '-'}
            </p>
            <p>
              <strong>No. Telepon:</strong> {formData.phone || '-'}
            </p>
            <p>
              <strong>Alamat Orang Tua:</strong> {formData.parentAddress || '-'}
            </p>
          </div>
        </Section>

        {/* PRESTASI */}
        <Section title="Prestasi & Minat" icon={<Trophy className="w-5 h-5" />}>
          <div className="space-y-2 text-gray-700 text-sm sm:text-base">
            <p>
              <strong>Prestasi:</strong> {formData.achievementField || '-'}
            </p>
            <p>
              <strong>Jumlah Hafalan:</strong> {formData.achievementName || '-'}
            </p>
            <p>
              <strong>Organisasi:</strong> {formData.achievementLevel || '-'}
            </p>
            <p>
              <strong>Hobi:</strong> {formData.majorInterest || '-'}
            </p>
          </div>
        </Section>

        {/* KONDISI RUMAH */}
        <Section title="Kondisi Rumah" icon={<Home className="w-5 h-5" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-700 text-sm sm:text-base">
            <p>
              <strong>Jenis Rumah:</strong> {formData.houseType || '-'}
            </p>
            <p>
              <strong>Status Kepemilikan:</strong> {formData.houseStatus || '-'}
            </p>
            <p>
              <strong>Sumber Air:</strong> {formData.waterSource || '-'}
            </p>
            <p>
              <strong>Listrik:</strong> {formData.electricity || '-'}
            </p>
          </div>
        </Section>

        {/* KESEHATAN */}
        <Section title="Data Kesehatan" icon={<Heart className="w-5 h-5" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-700 text-sm sm:text-base">
            <p>
              <strong>Golongan Darah:</strong> {formData.bloodType || '-'}
            </p>
            <p>
              <strong>Berat Badan:</strong> {formData.weight || '-'} kg
            </p>
            <p>
              <strong>Tinggi Badan:</strong> {formData.height || '-'} cm
            </p>
            <p>
              <strong>Buta Warna:</strong> {formData.butawarna || '-'}
            </p>
            <p>
              <strong>Penyakit Menular:</strong> {formData.penyakitMenular || '-'}
            </p>
            <p>
              <strong>Penyakit Tidak Menular:</strong> {formData.penyakitNonMenular || '-'}
            </p>
          </div>
        </Section>

        {/* ATURAN */}
        <Section title="Persetujuan Aturan" icon={<BookOpen className="w-5 h-5" />}>
          <p className={`text-sm sm:text-base font-medium ${formData.rulesAgreement ? 'text-green-700' : 'text-red-600'}`}>
            {formData.rulesAgreement ? '✅ Sudah menyetujui semua peraturan sekolah.' : '❌ Belum menyetujui peraturan sekolah.'}
          </p>
        </Section>

        {/* FOTO RUMAH */}
        <Section title="Foto Rumah (Preview)" icon={<Image className="w-5 h-5" />}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {housePhotos.length > 0 ? (
              housePhotos.map((src, idx) => (
                <div key={idx} className="border rounded-xl overflow-hidden shadow-sm">
                  <img src={src} alt={`Foto ${idx + 1}`} className="w-full h-32 sm:h-40 object-cover" />
                  <p className="text-xs sm:text-sm text-center py-2 bg-gray-50 text-gray-700 font-medium">Foto {idx + 1}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm">Belum ada foto rumah diunggah.</p>
            )}
          </div>
        </Section>

        {/* STATUS AKHIR */}
        <section className="text-center border-t pt-6">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
          <h3 className="font-bold text-lg sm:text-xl text-[#1E3A8A] mb-1">Berkas Telah Dikirim</h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
            Terima kasih telah mendaftar di <strong>SMK TI BAZMA</strong>. Data kamu sedang dalam proses verifikasi oleh panitia.
          </p>
        </section>
      </div>
    </div>
  );
}
