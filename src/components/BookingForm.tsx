import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Truck, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Share2, 
  Search, 
  ArrowRight, 
  Info,
  DollarSign,
  Phone,
  User,
  CreditCard,
  FileCheck
} from 'lucide-react';
import { BINJAI_DISTRICTS } from '../data/binjaiData';
import { ServiceType, ServiceRequest } from '../types/pald';
import { createServiceRequest } from '../utils/storage';
import { getWhatsAppBookingLink } from '../utils/qrAndShare';

interface BookingFormProps {
  onSuccess: (ticketNumber: string) => void;
  onNavigateToTrack: (ticketNumber: string) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  onSuccess,
  onNavigateToTrack,
}) => {
  const [step, setStep] = useState<number>(1);
  const [submittedReq, setSubmittedReq] = useState<ServiceRequest | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [nik, setNik] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [district, setDistrict] = useState('Binjai Kota');
  const [subDistrict, setSubDistrict] = useState(BINJAI_DISTRICTS['Binjai Kota'].subDistricts[0]);
  const [address, setAddress] = useState('');
  const [accessNotes, setAccessNotes] = useState('');
  const [hoseDistanceMeters, setHoseDistanceMeters] = useState<number>(15);

  const [serviceType, setServiceType] = useState<ServiceType>('l2tt_reguler');
  const [estimatedVolumeM3, setEstimatedVolumeM3] = useState<number>(3.0);
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<'pagi' | 'siang' | 'sore'>('pagi');

  // Handle District Change to sync sub-districts
  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    const subList = BINJAI_DISTRICTS[d]?.subDistricts || [];
    setSubDistrict(subList[0] || '');
  };

  // Calculate fee
  const calculateFee = (): number => {
    switch (serviceType) {
      case 'l2t2_berkala':
        return 345000;
      case 'darurat':
        return 400000;
      case 'niaga':
        return 500000;
      case 'instansi':
        return 400000;
      case 'rumah_ibadah':
        return 200000;
      case 'l2tt_reguler':
      default:
        return 350000;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !phone || !address || !district || !subDistrict) {
      alert('Mohon lengkapi semua kolom wajib (Nama, No HP/WA, Alamat, dan Wilayah)');
      return;
    }

    const fee = calculateFee();
    const newReq = createServiceRequest({
      customerName,
      nik: nik || '1275000000000000',
      phone,
      email,
      address,
      district,
      subDistrict,
      serviceType,
      estimatedVolumeM3,
      hoseDistanceMeters,
      preferredDate,
      preferredTimeSlot,
      accessNotes: accessNotes || 'Akses normal kendaraan vacuum.',
      feeAmount: fee,
      paymentStatus: 'pending',
    });

    setSubmittedReq(newReq);
    onSuccess(newReq.ticketNumber);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  if (submittedReq) {
    const waLink = getWhatsAppBookingLink(submittedReq);

    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm max-w-2xl mx-auto my-6 text-center">
        <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900">
          Pemesanan Berhasil Diterima!
        </h3>
        <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
          Terima kasih. Permohonan Anda telah terdaftar dalam sistem antrean UPTD PALD Kota Binjai.
        </p>

        {/* Nomor Tiket Card */}
        <div className="my-6 p-4 bg-teal-50/80 rounded-xl border border-teal-200/80 inline-block text-left w-full max-w-md">
          <div className="text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            Nomor Tiket Layanan Resmi
          </div>
          <div className="text-2xl font-extrabold text-teal-900 font-mono tracking-tight tabular-nums">
            {submittedReq.ticketNumber}
          </div>
          <div className="mt-3 pt-3 border-t border-teal-200/60 text-xs text-slate-700 space-y-1">
            <div className="flex justify-between">
              <span>Pemohon:</span>
              <strong className="text-slate-900">{submittedReq.customerName}</strong>
            </div>
            <div className="flex justify-between">
              <span>Wilayah:</span>
              <span>Kec. {submittedReq.district}, Kel. {submittedReq.subDistrict}</span>
            </div>
            <div className="flex justify-between">
              <span>Jadwal Pilihan:</span>
              <span>{submittedReq.preferredDate} ({submittedReq.preferredTimeSlot.toUpperCase()})</span>
            </div>
            <div className="flex justify-between font-semibold text-teal-900 pt-1">
              <span>Estimasi Retribusi:</span>
              <span>Rp {submittedReq.feeAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Share2 className="w-4 h-4" />
            Konfirmasi ke WhatsApp Admin UPTD
          </a>

          <button
            onClick={() => onNavigateToTrack(submittedReq.ticketNumber)}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-teal-800 bg-teal-100 hover:bg-teal-200 rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            Lacak Status Tiket Ini
          </button>
        </div>

        <button
          onClick={() => {
            setSubmittedReq(null);
            setStep(1);
          }}
          className="mt-6 text-xs text-slate-500 hover:text-slate-800 underline"
        >
          Buat Pesanan Baru Lainnya
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto overflow-hidden">
      
      {/* Form Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-teal-700 to-teal-800 text-white">
        <div className="flex items-center gap-2 text-xs font-medium text-teal-200 uppercase tracking-wider mb-1">
          <Truck className="w-3.5 h-3.5" />
          <span>SIJEMPOL PALD · Sistem Informasi Jemput Lumpur</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">
          Formulir Pemesanan Penyedotan Tangki Septik
        </h2>
        <p className="text-xs sm:text-sm text-teal-100 mt-1">
          Layanan resmi UPTD PALD Dinas PUTR Kota Binjai untuk hunian, instansi, dan tempat usaha.
        </p>
      </div>

      {/* Step Indicator Tabs */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-3 flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 transition-colors ${
              step === 1 ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>1</span>
            Data Pemohon & Wilayah
          </button>

          <span className="text-slate-300">/</span>

          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 transition-colors ${
              step === 2 ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>2</span>
            Jenis Layanan & Tangki
          </button>

          <span className="text-slate-300">/</span>

          <button
            type="button"
            onClick={() => setStep(3)}
            className={`flex items-center gap-2 transition-colors ${
              step === 3 ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>3</span>
            Jadwal & Konfirmasi
          </button>
        </div>

        <div className="hidden sm:block text-slate-500 text-xs">
          Langkah {step} dari 3
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        
        {/* STEP 1: Data Pemohon & Domisili Binjai */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                1. Data Identitas Pemohon & Domisili
              </h3>
              <p className="text-xs text-slate-500">
                Pastikan nomor WhatsApp aktif untuk konfirmasi keberangkatan armada truk tinja.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pemohon <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor HP / WhatsApp Aktif <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 08126045xxxx"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIK (KTP) Pemohon (Opsional untuk arsip retribusi)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="16 digit NIK KTP Kota Binjai"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Pemohon (Opsional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>
            </div>

            {/* Wilayah Kota Binjai */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kecamatan di Kota Binjai <span className="text-rose-600">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                >
                  {Object.keys(BINJAI_DISTRICTS).map((d) => (
                    <option key={d} value={d}>
                      Kecamatan {d}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-teal-700 mt-1">
                  Jadwal rutin wilayah ini: {BINJAI_DISTRICTS[district]?.scheduleDays.join(', ')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelurahan <span className="text-rose-600">*</span>
                </label>
                <select
                  value={subDistrict}
                  onChange={(e) => setSubDistrict(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                >
                  {BINJAI_DISTRICTS[district]?.subDistricts.map((sub) => (
                    <option key={sub} value={sub}>
                      Kelurahan {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Lengkap & Patokan Rumah <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Perintis Kemerdekaan No. 12, Lingkungan IV, dekat Masjid / samping Toko Berkah"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!customerName || !phone || !address) {
                    alert('Mohon lengkapi Nama, No WhatsApp, dan Alamat rumah.');
                    return;
                  }
                  setStep(2);
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                Lanjut ke Jenis Layanan
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Karakteristik Layanan & Tangki */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                2. Pilihan Jenis Layanan & Akses Tangki
              </h3>
              <p className="text-xs text-slate-500">
                Pilih program layanan yang sesuai dengan kebutuhan Anda.
              </p>
            </div>

            {/* Service Type Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  serviceType === 'l2tt_reguler'
                    ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <input
                    type="radio"
                    name="serviceType"
                    checked={serviceType === 'l2tt_reguler'}
                    onChange={() => setServiceType('l2tt_reguler')}
                    className="mt-1 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                    Rp 350.000 / rit
                  </span>
                </div>
                <div className="mt-2 font-bold text-sm text-slate-900">
                  L2TT Reguler (On-Call)
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Penyedotan tangki septik rumah tinggal saat tangki penuh atau dibutuhkan.
                </p>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  serviceType === 'l2t2_berkala'
                    ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <input
                    type="radio"
                    name="serviceType"
                    checked={serviceType === 'l2t2_berkala'}
                    onChange={() => setServiceType('l2t2_berkala')}
                    className="mt-1 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Diskon 10% · Rp 315.000
                  </span>
                </div>
                <div className="mt-2 font-bold text-sm text-slate-900">
                  L2T2 - Terjadwal Berkala
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Program berkala 2 tahun, gratis Kartu Septik Sehat & prioritas armada.
                </p>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  serviceType === 'darurat'
                    ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <input
                    type="radio"
                    name="serviceType"
                    checked={serviceType === 'darurat'}
                    onChange={() => setServiceType('darurat')}
                    className="mt-1 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Prioritas · Rp 400.000
                  </span>
                </div>
                <div className="mt-2 font-bold text-sm text-slate-900">
                  Darurat Mampet Parah
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Penanganan prioritas cepat tim gerak cepat tanggap sanitasi.
                </p>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  serviceType === 'niaga'
                    ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <input
                    type="radio"
                    name="serviceType"
                    checked={serviceType === 'niaga'}
                    onChange={() => setServiceType('niaga')}
                    className="mt-1 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                    Rp 500.000 / rit
                  </span>
                </div>
                <div className="mt-2 font-bold text-sm text-slate-900">
                  Niaga / Komersial
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Ruko, restoran, cafe, penginapan, dan tempat usaha di Kota Binjai.
                </p>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  serviceType === 'instansi'
                    ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <input
                    type="radio"
                    name="serviceType"
                    checked={serviceType === 'instansi'}
                    onChange={() => setServiceType('instansi')}
                    className="mt-1 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    Rp 400.000 / rit
                  </span>
                </div>
                <div className="mt-2 font-bold text-sm text-slate-900">
                  Instansi / Perkantoran
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Kantor pemerintahan, lembaga swasta, BUMN, perbankan, dan sekolah.
                </p>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  serviceType === 'rumah_ibadah'
                    ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <input
                    type="radio"
                    name="serviceType"
                    checked={serviceType === 'rumah_ibadah'}
                    onChange={() => setServiceType('rumah_ibadah')}
                    className="mt-1 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Khusus · Rp 200.000
                  </span>
                </div>
                <div className="mt-2 font-bold text-sm text-slate-900">
                  Rumah Ibadah (Sosial)
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Masjid, musholla, gereja, vihara, kuil, dan fasilitas ibadah umum.
                </p>
              </label>

            </div>

            {/* Detail Teknis Akses Selang */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Perkiraan Jarak Selang dari Jalan ke Septic Tank
                </label>
                <select
                  value={hoseDistanceMeters}
                  onChange={(e) => setHoseDistanceMeters(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white outline-none"
                >
                  <option value={10}>Dekat (Kurang dari 10 meter)</option>
                  <option value={15}>Sedang (10 - 20 meter - Standar)</option>
                  <option value={30}>Jauh (20 - 35 meter - Perlu selang sambung)</option>
                  <option value={45}>Sangat Jauh (35 - 50 meter)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Truk PALD membawa selang standar hingga 40 meter.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Akses Jalan & Titik Tutup Tangki
                </label>
                <input
                  type="text"
                  value={accessNotes}
                  onChange={(e) => setAccessNotes(e.target.value)}
                  placeholder="Contoh: Gang lebar 3 meter, tutup tangki di garasi / samping dapur"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                Lanjut ke Jadwal & Biaya
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Jadwal & Konfirmasi Rincian */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                3. Pilihan Jadwal Pelayanan & Rincian Retribusi
              </h3>
              <p className="text-xs text-slate-500">
                Pilih tanggal dan sesi operasional yang diinginkan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Pelayanan yang Diharapkan <span className="text-rose-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sesi Jam Operasional
                </label>
                <select
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white outline-none"
                >
                  <option value="pagi">Sesi Pagi (08:30 - 11:30 WIB)</option>
                  <option value="siang">Sesi Siang (13:00 - 15:30 WIB)</option>
                </select>
              </div>
            </div>

            {/* Ringkasan Biaya & Layanan */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Ringkasan Pemesanan Retribusi Resmi
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-600">Pemohon:</span>
                  <span className="font-semibold text-slate-900">{customerName || '-'} ({phone || '-'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Lokasi:</span>
                  <span className="text-slate-900">{address}, Kel. {subDistrict}, Kec. {district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Jenis Layanan:</span>
                  <span className="font-semibold text-teal-800">
                    {serviceType === 'l2t2_berkala' ? 'L2T2 Berkala 2 Tahun (Diskon 10% · Rp 315.000)' : 
                     serviceType === 'darurat' ? 'Layanan Darurat Mampet Parah (Rp 400.000)' :
                     serviceType === 'niaga' ? 'Niaga / Komersial (Rp 500.000)' :
                     serviceType === 'instansi' ? 'Instansi / Perkantoran (Rp 400.000)' :
                     serviceType === 'rumah_ibadah' ? 'Rumah Ibadah / Sosial (Rp 200.000)' : 'L2TT Reguler On-Call (Rp 350.000)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Jadwal:</span>
                  <span className="text-slate-900">{preferredDate} · Sesi {preferredTimeSlot.toUpperCase()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>Estimasi Retribusi Pemko:</span>
                  <span className="text-lg text-teal-700 font-mono tabular-nums">
                    Rp {calculateFee().toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-teal-50/70 border border-teal-200/50 rounded-lg text-xs text-teal-800 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-teal-600" />
                <span>
                  Retribusi resmi dibayarkan saat petugas selesai melakukan penyedotan. Petugas akan menyerahkan tanda terima resmi Pemko Binjai dan menerbitkan <strong>Kartu Septik Sehat</strong>.
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg"
              >
                Kembali
              </button>
              
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm shadow-teal-600/30 transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Konfirmasi & Kirim Permohonan
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};
