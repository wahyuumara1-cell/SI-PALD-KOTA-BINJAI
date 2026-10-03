import React, { useState } from 'react';
import { 
  AlertCircle, 
  Send, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Share2, 
  FileText,
  ShieldAlert
} from 'lucide-react';
import { BINJAI_DISTRICTS } from '../data/binjaiData';
import { ComplaintCategory, ComplaintItem } from '../types/pald';
import { createComplaint, getComplaints } from '../utils/storage';
import { getWhatsAppComplaintLink } from '../utils/qrAndShare';

export const ComplaintSection: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'lacak'>('form');
  const [complaintsList, setComplaintsList] = useState<ComplaintItem[]>(getComplaints);

  // Form states
  const [reporterName, setReporterName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Binjai Kota');
  const [subDistrict, setSubDistrict] = useState(BINJAI_DISTRICTS['Binjai Kota'].subDistricts[0]);
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('keterlambatan_kedatangan');
  const [description, setDescription] = useState('');
  const [submittedComplaint, setSubmittedComplaint] = useState<ComplaintItem | null>(null);

  // Tracker state
  const [trackingNumber, setTrackingNumber] = useState('');
  const [foundComplaint, setFoundComplaint] = useState<ComplaintItem | null>(() => complaintsList[0] || null);
  const [searched, setSearched] = useState(false);

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    const subList = BINJAI_DISTRICTS[d]?.subDistricts || [];
    setSubDistrict(subList[0] || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reporterName || !phone || !address || !description) {
      alert('Mohon lengkapi semua kolom wajib.');
      return;
    }

    const newCmp = createComplaint({
      reporterName,
      phone,
      district,
      subDistrict,
      address,
      category,
      description,
    });

    setComplaintsList(getComplaints());
    setSubmittedComplaint(newCmp);
    setFoundComplaint(newCmp);
  };

  const handleSearchComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const clean = trackingNumber.trim().toLowerCase();
    const match = complaintsList.find(
      c => c.ticketNumber.toLowerCase() === clean || c.phone.includes(clean)
    );
    setFoundComplaint(match || null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          Layanan Aspirasi & Pengaduan Pelayanan Publik
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Pengaduan Mutu Pelayanan UPTD PALD
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Laporkan kendala pelayanan petugas lapangan, keterlambatan kedatangan armada, transparansi tarif retribusi resmi Perda, atau mutu kebersihan pasca penyedotan di Kota Binjai.
        </p>

        {/* Tab switch */}
        <div className="pt-2 flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveSubTab('form')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'form'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Formulir Pengaduan Pelayanan
          </button>
          <button
            onClick={() => setActiveSubTab('lacak')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'lacak'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Lacak Status Aduan Pelayanan
          </button>
        </div>
      </div>

      {/* SubTab 1: Form Pengaduan */}
      {activeSubTab === 'form' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {submittedComplaint ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Pengaduan Pelayanan Berhasil Terkirim!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Nomor tiket aduan Anda adalah <strong className="font-mono text-slate-900">{submittedComplaint.ticketNumber}</strong>. Tim Pengawas Integritas & Pelayanan UPTD PALD akan segera menindaklanjuti laporan Anda.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getWhatsAppComplaintLink(submittedComplaint)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  Kirim Aduan ke WhatsApp Petugas
                </a>
                <button
                  onClick={() => {
                    setSubmittedComplaint(null);
                    setReporterName('');
                    setDescription('');
                    setAddress('');
                  }}
                  className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Kirim Pengaduan Lain
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pelapor <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Nama Lengkap Pemohon / Pelapor"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Pelapor <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Pengaduan Pelayanan <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white outline-none"
                  >
                    <option value="keterlambatan_kedatangan">1. Keterlambatan Armada / Waktu Respon</option>
                    <option value="sikap_perilaku_petugas">2. Sikap, Etika & Komunikasi Petugas</option>
                    <option value="ketidaksesuaian_tarif">3. Ketidaksesuaian Tarif / Indikasi Pungli</option>
                    <option value="kualitas_hasil_pekerjaan">4. Kualitas & Kebersihan Hasil Kerja</option>
                    <option value="kendala_informasi_tracking">5. Kendala Informasi & Pelacakan Tiket</option>
                    <option value="kritik_saran_pelayanan">6. Kritik & Usulan Mutu Pelayanan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kecamatan Kota Binjai <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white outline-none"
                  >
                    {Object.keys(BINJAI_DISTRICTS).map((d) => (
                      <option key={d} value={d}>Kec. {d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kelurahan <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={subDistrict}
                    onChange={(e) => setSubDistrict(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white outline-none"
                  >
                    {BINJAI_DISTRICTS[district]?.subDistricts.map((s) => (
                      <option key={s} value={s}>Kel. {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Lokasi Pelayanan <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Samanhudi No. 12, Lingkungan V"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Uraian Lengkap Pengaduan Pelayanan <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan detail kendala pelayanan yang dialami (misal: nomor tiket permohonan penyedotan Anda, keterlambatan kedatangan armada, sikap petugas, ketidaksesuaian bukti retribusi, atau sisa kotoran yang belum dibersihkan)..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirimkan Laporan Pengaduan
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* SubTab 2: Lacak Status Pengaduan */}
      {activeSubTab === 'lacak' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <form onSubmit={handleSearchComplaint} className="flex gap-2 max-w-lg mx-auto">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Nomor Tiket Aduan (contoh: ADUAN-2026-0038)"
                className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl outline-none font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl whitespace-nowrap"
              >
                Cek Aduan
              </button>
            </form>
          </div>

          {foundComplaint && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs text-slate-500 block">Nomor Aduan:</span>
                  <span className="font-mono font-bold text-base text-slate-900">{foundComplaint.ticketNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Status Tindak Lanjut:</span>
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full uppercase">
                    {foundComplaint.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div>
                  <span className="text-slate-400 block">Pelapor:</span>
                  <span className="font-semibold text-slate-900">{foundComplaint.reporterName} ({foundComplaint.phone})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Lokasi:</span>
                  <span>{foundComplaint.address}, Kel. {foundComplaint.subDistrict}, Kec. {foundComplaint.district}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl text-xs text-slate-800">
                <span className="font-bold block text-slate-900 mb-1">Isi Pengaduan:</span>
                <p className="leading-relaxed">{foundComplaint.description}</p>
              </div>

              {foundComplaint.officialResponse && (
                <div className="bg-teal-50/80 border border-teal-200/80 p-3.5 rounded-xl text-xs text-teal-900">
                  <div className="font-bold flex items-center gap-1.5 text-teal-900 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                    Tanggapan Resmi Tim Pengawas Sanitasi UPTD PALD:
                  </div>
                  <p className="leading-relaxed">{foundComplaint.officialResponse}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
