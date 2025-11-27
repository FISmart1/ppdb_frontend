'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle, Image } from 'lucide-react';
import Swal from 'sweetalert2';
import 'animate.css';
import pako from 'pako';

const PageFormUpload: React.FC = () => {
  const router = useRouter();
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [housePhotos, setHousePhotos] = useState<{ [key: string]: File | null }>({});
  const [housePreviews, setHousePreviews] = useState<{ [key: string]: string | null }>({});
  const [isLoading, setIsLoading] = useState(false);

  const requiredFiles = [
    { name: 'rapor', label: 'Dokumen Nilai Rapot Semester 3–5' },
    { name: 'sktm', label: 'Surat Keterangan Tidak Mampu (SKTM)' },
    { name: 'ss_ig', label: 'Screenshot Follow IG @smktibazma' },
    { name: 'kk', label: 'Kartu Keluarga (KK)' },
    { name: 'foto', label: 'Pas Foto (Berwarna) 3x4 (terbaru dalam 3 bulan terakhir)' },
    { name: 'kip', label: 'Sertakan Bukti KIP' },
    { name: 'bpjs', label: 'Scan / Foto Kartu BPJS atau KIS' },
    { name: 'rekomendasi_surat', label: 'Upload Surat Rekomendasi' },
    { name: 'tagihan_listrik', label: 'Upload Bukti Pembayaran Listrik' },
    { name: 'reels', label: 'Upload Bukti Posting Video Perkenalan Instagram' },
  ];

  const housePhotoTypes = [
    { name: 'rumah_depan', label: 'Tampak Depan', example: '/tampakdepan.jpeg' },
    { name: 'rumah_ruangtamu', label: 'Dapur / Kamar mandi', example: '/dapur.jpeg' },
    { name: 'rumah_kamar', label: 'Kamar Tidur', example: '/kamar.jpeg' },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user?.id;
    if (!user_id) return;
    if (user.validasi_pendaftaran === 'sudah') {
      router.replace('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`https://backend_spmb.smktibazma.sch.id/api/pendaftaran/form-berkas/${user_id}`);
        if (!res.ok) return; // Data belum ada → tetap POST

        const data = await res.json();

        // Untuk file dokumen → kita hanya tampilkan nama filenya
        const loadedFiles: any = {};
        requiredFiles.forEach((f) => {
          if (data[f.name]) {
            loadedFiles[f.name] = { name: data[f.name] }; // bukan File, hanya dummy object
          }
        });

        // Untuk foto rumah
        const loadedHouse: any = {};
        const loadedPreviews: any = {};
        housePhotoTypes.forEach((h) => {
          if (data[h.name]) {
            loadedHouse[h.name] = data[h.name]; // string
            loadedPreviews[h.name] = `https://backend_spmb.smktibazma.sch.id/uploads/${data[h.name]}`;
          }
        });

        setFiles(loadedFiles);
        setHousePhotos(loadedHouse);
        setHousePreviews(loadedPreviews);
      } catch (err) {
        console.log('Gagal mengambil data berkas');
      }
    };

    fetchData();
  }, []);
  const rumahDepanRef = useRef<HTMLInputElement>(null);
  const ruangTamuRef = useRef<HTMLInputElement>(null);
  const kamarRef = useRef<HTMLInputElement>(null);

  const compressPDF = async (file: File, maxSizeMB = 1): Promise<File> => {
    const buffer = new Uint8Array(await file.arrayBuffer());
    const MAX = maxSizeMB * 1024 * 1024;

    // Jika sudah <1MB, langsung kembalikan
    if (buffer.byteLength <= MAX) return file;

    // Potong buffer secara kasar (lossy tapi tetap PDF valid)
    let cut = buffer.slice(0, MAX);

    return new File([cut], file.name.replace(/\.[^/.]+$/, '') + '.pdf', {
      type: 'application/pdf',
    });
  };

  const compressImage = async (file: File, maxSizeMB = 1): Promise<File> => {
    return new Promise((resolve) => {
      // FIX: Hindari error SSR
      const img = document.createElement('img');

      const url = URL.createObjectURL(file);
      img.src = url;

      img.onload = async () => {
        URL.revokeObjectURL(url);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);

        const MAX_MB = maxSizeMB * 1024 * 1024;

        let quality = 0.9;
        let width = img.width;
        let height = img.height;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        let blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));

        // turunin kualitas sampai file <1MB
        while (blob && blob.size > MAX_MB && quality > 0.1) {
          quality -= 0.1;
          blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
        }

        if (!blob) return resolve(file);

        resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', { type: 'image/jpeg' }));
      };

      img.onerror = () => resolve(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;

    if (!selectedFiles || !selectedFiles[0]) return;

    let file = selectedFiles[0];
    // Validasi ukuran dalam MB
    function validateSize(file: File, maxMB: number) {
      const fileSizeMB = file.size / 1024 / 1024; // convert to MB
      return fileSizeMB <= maxMB;
    }

    // HARD LIMIT sebelum kompres (misal max 4MB)
    if (!validateSize(file, 4)) {
      Swal.fire({
        icon: 'error',
        title: 'Ukuran File Terlalu Besar!',
        text: 'Ukuran maksimal file adalah 4MB sebelum dikompres.',
        confirmButtonColor: '#1E3A8A',
      });
      return;
    }

    // AUTO KOMPRES GAMBAR
    if (file.type.startsWith('image/')) {
      let compressed = await compressImage(file, 1); // target <1MB

      // CEK kembali ukuran setelah kompres
      if (compressed.size > 1 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'File Masih Terlalu Besar!',
          text: 'Setelah kompres, ukuran masih lebih dari 1MB. Mohon unggah foto dengan resolusi lebih kecil.',
          confirmButtonColor: '#1E3A8A',
        });
        return;
      }

      file = compressed;
    }

    // PDF kompres (opsional)
    if (file.type === 'application/pdf') {
      // ... fungsi compressPDF kamu
    }

    setFiles((prev) => ({ ...prev, [name]: file }));
  };

  const handleHousePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;

    if (!selectedFiles || !selectedFiles[0]) return;

    let file = selectedFiles[0];
    // Validasi ukuran dalam MB
    function validateSize(file: File, maxMB: number) {
      const fileSizeMB = file.size / 1024 / 1024; // convert to MB
      return fileSizeMB <= maxMB;
    }

    if (!validateSize(file, 4)) {
      Swal.fire({
        icon: 'error',
        title: 'Ukuran Foto Terlalu Besar!',
        text: 'Ukuran maksimal foto rumah adalah 4MB sebelum kompres.',
        confirmButtonColor: '#1E3A8A',
      });
      return;
    }

    if (file.type.startsWith('image/')) {
      let compressed = await compressImage(file, 1);

      if (compressed.size > 1 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'Foto Masih Terlalu Besar!',
          text: 'Setelah kompres, ukuran masih >1MB. Coba unggah foto yang lebih kecil atau turunkan resolusi.',
          confirmButtonColor: '#1E3A8A',
        });
        return;
      }

      file = compressed;
    }

    setHousePhotos((prev) => ({ ...prev, [name]: file }));

    // Tampilkan preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setHousePreviews((prev) => ({
        ...prev,
        [name]: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleBack = () => router.push('/page-pendaftaran/page-kesehatan');

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user?.id;

    if (!user_id) {
      Swal.fire({
        icon: 'error',
        title: 'User tidak ditemukan',
        text: 'Silakan login ulang.',
      });
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));

    setIsLoading(true); // 🔥 MULAI LOADING
    // ⛔ Wajibkan semua foto rumah terisi
    for (const h of housePhotoTypes) {
      const file = housePhotos[h.name];

      if (!file || !(file instanceof File)) {
        Swal.fire({
          icon: 'warning',
          title: 'Foto rumah belum lengkap',
          text: `Foto ${h.label} wajib diupload.`,
        });
        setIsLoading(false);
        return;
      }
    }

    let isUpdate = false;
    try {
      const check = await fetch(`https://backend_spmb.smktibazma.sch.id/api/pendaftaran/form-berkas/${user_id}`);
      if (check.ok) isUpdate = true;
    } catch (e) {}

    const form = new FormData();
    // 🔥 ambil file langsung dari input, bukan dari state
    if (rumahDepanRef.current?.files?.[0]) {
      form.append('rumah_depan', rumahDepanRef.current.files[0]);
    }

    if (ruangTamuRef.current?.files?.[0]) {
      form.append('rumah_ruangtamu', ruangTamuRef.current.files[0]);
    }

    if (kamarRef.current?.files?.[0]) {
      form.append('rumah_kamar', kamarRef.current.files[0]);
    }

    form.append('user_id', user_id);

    let hasFile = false;

    Object.keys(files).forEach((key) => {
      if (files[key] instanceof File) {
        hasFile = true;
        form.append(key, files[key] as File);
      }
    });

    Object.keys(housePhotos).forEach((key) => {
      const value = housePhotos[key];

      if (value instanceof File) {
        form.append(key, value);
      } else if (value && value.name) {
        // kirim nama lama agar backend tidak menghapus
        form.append(key, value.name);
      } else {
        // jika kosong, kirim string kosong
        form.append(key, '');
      }
    });

    if (!hasFile) {
      setIsLoading(false); // ❗ STOP LOADING
      Swal.fire({
        icon: 'warning',
        title: 'Tidak ada perubahan!',
        text: 'Upload minimal 1 file.',
      });
      return;
    }

    const url = isUpdate ? `https://backend_spmb.smktibazma.sch.id/api/pendaftaran/form-berkas/${user_id}` : `https://backend_spmb.smktibazma.sch.id/api/pendaftaran/form-berkas`;

    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        body: form,
      });

      const data = await res.json();

      setIsLoading(false); // 🔥 MATIKAN LOADING

      if (!res.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: data.message,
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: isUpdate ? 'Berkas diperbarui!' : 'Berkas tersimpan!',
        confirmButtonColor: '#1E3A8A',
      }).then(() => {
        router.push('/page-pendaftaran/page-aturan');
      });
    } catch (err) {
      setIsLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Tidak dapat menghubungi server.',
      });
    }
  };

  const renderButton = (label: string, name: string) => {
    const fileSelected = files[name];
    return (
      <div className={`border rounded-full px-4 py-3 flex items-center justify-between transition cursor-pointer text-sm sm:text-base ${fileSelected ? 'bg-green-50 border-green-400' : 'bg-white border-gray-300 hover:shadow-md'}`}>
        <label htmlFor={name} className={`flex items-center gap-2 cursor-pointer transition ${fileSelected ? 'text-green-700 font-semibold' : 'text-gray-700 hover:text-[#1E3A8A]'}`}>
          {fileSelected ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0" /> : <Upload className="w-5 h-5 text-[#1E3A8A] shrink-0" />}
          <span className="text-left leading-tight break-words max-w-[200px] sm:max-w-none">{fileSelected ? 'Sudah diupload' : label}</span>
        </label>
        <input id={name} name={name} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={handleFileChange} />
        {fileSelected && <span className="text-xs sm:text-sm text-green-700 truncate max-w-[120px] sm:max-w-[200px] font-medium ml-2 animate__animated animate__fadeIn">{fileSelected.name}</span>}
      </div>
    );
  };

  return (
    <>
      {/* HEADER */}
      <header className="relative h-64 md:h-72 overflow-hidden">
        <img src="/bck.png" alt="Background Indonesia" className="absolute inset-0 w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/70 via-[#1E3A8A]/10 to-white"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-[#EAF0FF] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">Formulir Pendaftaran Calon Murid</h1>
          <p className="mt-3 text-[#949494] text-base sm:text-lg md:text-xl font-medium opacity-95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]">Upload Dokumen & Foto Rumah</p>
        </div>
      </header>

      {/* FORM CONTAINER */}
      <div className="w-full max-w-6xl mx-auto bg-gray-50 rounded-2xl p-4 sm:p-6 md:p-10 shadow-md animate__animated animate__fadeIn animate__slow">
        {/* Stepper */}
        <div className="text-center mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A8A] mb-4">Formulir Pendaftaran Calon Murid</h1>

          <div className="flex justify-center items-center flex-wrap gap-4">
            {[
              { label: 'Data Rumah ', step: 4 },
              { label: 'Data Kesehatan', step: 5 },
              { label: 'Upload Berkas', step: 6 },
            ].map((item, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-semibold ${item.step === 6 ? 'bg-[#1E3A8A] text-white' : 'bg-gray-300 text-gray-600'}`}>{item.step}</div>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-center text-gray-500">{item.label}</p>
                </div>
                {idx < 2 && <div className="hidden sm:flex flex-1 h-[2px] bg-gray-300 max-w-[60px]" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* DOWNLOAD TEMPLATE SECTION */}
        <div className="mt-6 ml-4">
          <p className="text-gray-500 text-lg mt-2">📄 Belum punya berkas berikut? Unduh templatenya di bawah ini:</p>
          <ul className="text-gray-500 text-base mt-3 ml-6 list-decimal space-y-2">
            <li>
              Surat Keterangan Tidak Mampu (SKTM){' '}
              <a href="/files/SKTM.pdf" download className="text-[#1E3A8A] font-medium hover:underline">
                Unduh di sini
              </a>
            </li>
            <li>
              Surat Rekomendasi{' '}
              <a href="/files/Surat_Rekom.pdf" download className="text-[#1E3A8A] font-medium hover:underline">
                Unduh di sini
              </a>
            </li>
          </ul>

          <p className="mt-4 text-sm text-gray-600 italic">
            📎 Jenis file yang diperbolehkan untuk diunggah: <span className="font-semibold text-[#1E3A8A]">JPEG, JPG, PNG, dan PDF</span>. *maks 2 mb
          </p>
        </div>

        {/* Upload Dokumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 mt-8">
          {requiredFiles.map((f) => (
            <div key={f.name} className={f.name === 'tagihan_listrik' ? 'sm:col-span-2' : ''}>
              <div className="w-full">{renderButton(f.label, f.name)}</div>
            </div>
          ))}
        </div>

        {/* Upload Foto Rumah */}
        <div className="mb-6 mt-6">
          <h2 className="font-semibold text-gray-700 mb-6 flex items-center gap-2 text-base sm:text-lg">
            <Image className="w-5 h-5 text-[#1E3A8A]" />
            Upload Foto Rumah (Lengkapi Semua Bagian)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {housePhotoTypes.map((photo) => (
              <div key={photo.name} className="flex flex-col gap-4">
                {/* Contoh Foto */}
                <div className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition overflow-hidden">
                  <div className="bg-gray-50 text-center py-2 font-semibold text-sm text-[#1E3A8A] border-b">Contoh: {photo.label}</div>
                  <img src={photo.example} alt={`Contoh ${photo.label}`} className="w-full h-56 sm:h-64 object-cover rounded-lg" />
                </div>

                {/* Upload Foto */}
                <div className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition overflow-hidden flex flex-col items-center p-3">
                  {housePreviews[photo.name] ? (
                    <img src={housePreviews[photo.name]!} alt={`Preview ${photo.label}`} className="w-full h-56 sm:h-64 object-cover rounded-lg border border-green-200" />
                  ) : (
                    <div className="w-full h-56 sm:h-64 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-lg text-sm">Belum ada foto</div>
                  )}
                  <p className="text-sm font-semibold text-gray-700 mt-3 mb-2 text-center">{photo.label}</p>
                  <label
                    htmlFor={photo.name}
                    className={`cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 border px-3 py-1.5 rounded-full w-full sm:w-auto text-center ${
                      housePhotos[photo.name] ? 'bg-green-100 border-green-400 text-green-700' : 'bg-gray-100 border-gray-300 hover:bg-blue-50 hover:text-[#1E3A8A]'
                    }`}
                  >
                    {housePhotos[photo.name] ? <CheckCircle className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                    {housePhotos[photo.name] ? 'Sudah Diupload' : 'Upload Foto'}
                  </label>
                  <input id={photo.name} name={photo.name} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleHousePhotoChange} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">Pastikan seluruh dokumen dan foto rumah diunggah dengan jelas.</p>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row justify-between mt-8 gap-3">
          <button onClick={handleBack} className="w-full sm:w-auto bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-full hover:bg-gray-400 transition">
            Kembali
          </button>
          <button onClick={handleSubmit} className="w-full sm:w-auto bg-[#1E3A8A] text-white font-medium px-6 py-2 rounded-full hover:bg-[#162d66] transition">
            Selanjutnya
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[9999] flex flex-col items-center justify-center animate__animated animate__fadeIn">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
            <div className="absolute inset-3 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
          </div>

          <p className="text-white font-semibold mt-6 text-lg tracking-wide animate__animated animate__fadeIn animate__slow">Mengupload berkas...</p>
        </div>
      )}
    </>
  );
};

export default PageFormUpload;
