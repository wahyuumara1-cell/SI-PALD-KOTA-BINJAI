import React, { useState } from 'react';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Award, 
  AlertCircle, 
  User, 
  Calendar,
  Share2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ServiceRequest, ServiceStatus } from '../types/pald';
import { getRequests } from '../utils/storage';
import { getWhatsAppCitizenNoticeLink } from '../utils/qrAndShare';

interface TicketTrackerProps {
  initialTicket?: string;
  onOpenSepticCard: (req: ServiceRequest) => void;
  onNavigateToBooking: () => void;
}

const STATUS_STEPS: { status: ServiceStatus; label: string; desc: string }[] = [
  { status: 'received', label: 'Permohonan Diterima', desc: 'Tiket dicatat dalam sistem antrean UPTD' },
  { status: 'verified', label: 'Verifikasi Administrasi', desc: 'Pengecekan data alamat dan akses selang' },
  { status: 'scheduled', label: 'Penjadwalan Armada', desc: 'Ditetapkan tim dan nomor armada truk' },
  { status: 'on_the_way', label: 'Petugas Menuju Lokasi', desc: 'Armada bergerak ke alamat pemohon' },
  { status: 'in_progress', label: 'Penyedotan Tangki', desc: 'Proses pembersihan dan pengisapan lumpur' },
  { status: 'completed', label: 'Layanan Selesai', desc: 'Limbah dibawa ke IPLT & Kartu Septik terbit' },
];

export const TicketTracker: React.FC<TicketTrackerProps> = ({
  initialTicket = '',
  onOpenSepticCard,
  onNavigateToBooking,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialTicket || 'PALD-BINJAI-2026-00125');
  const [selectedReq, setSelectedReq] = useState<ServiceRequest | null>(() => {
    const list = getRequests();
    if (initialTicket) {
      const found = list.find(r => r.ticketNumber.toLowerCase() === initialTicket.toLowerCase().trim());
      if (found) return found;
    }
    return list.find(r => r.ticketNumber === 'PALD-BINJAI-2026-00125') || list[0] || null;
  });
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);
    const list = getRequests();
    const clean = searchQuery.trim().toLowerCase();
    
    const match = list.find(
      r => r.ticketNumber.toLowerCase() === clean || 
           r.phone.replace(/[^0-9]/g, '').includes(clean) ||
           r.customerName.toLowerCase().includes(clean)
    );

    setSelectedReq(match || null);
  };

  const getStepIndex = (status: ServiceStatus): number => {
    switch (status) {
      case 'received': return 0;
      case 'verified': return 1;
      case 'scheduled': return 2;
      case 'on_the_way': return 3;
      case 'in_progress': return 4;
      case 'completed': return 5;
      default: return 0;
    }
  };

  const currentStepIdx = selectedReq ? getStepIndex(selectedReq.status) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Search Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl mx-auto text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
            <Search className="w-3.5 h-3.5" />
            Lacak Posisi Truk & Status Pemesanan
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Cek Status Layanan UPTD PALD
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Masukkan Nomor Tiket Layanan (contoh: <code className="font-mono text-teal-700">PALD-BINJAI-2026-00125</code>) atau Nomor WhatsApp yang didaftarkan.
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nomor Tiket atau No WhatsApp..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors whitespace-nowrap"
          >
            Lacak
          </button>
        </form>

        {/* Quick Demo Pre-set Badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <span>Contoh data demo:</span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('PALD-BINJAI-2026-00125');
              const list = getRequests();
              setSelectedReq(list.find(r => r.ticketNumber === 'PALD-BINJAI-2026-00125') || null);
            }}
            className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 rounded-md font-mono transition-colors"
          >
            #00125 (Sedang Menuju Lokasi)
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('PALD-BINJAI-2026-00124');
              const list = getRequests();
              setSelectedReq(list.find(r => r.ticketNumber === 'PALD-BINJAI-2026-00124') || null);
            }}
            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-md font-mono transition-colors"
          >
            #00124 (Selesai & Kartu Terbit)
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('PALD-BINJAI-2026-00126');
              const list = getRequests();
              setSelectedReq(list.find(r => r.ticketNumber === 'PALD-BINJAI-2026-00126') || null);
            }}
            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-md font-mono transition-colors"
          >
            #00126 (Dijadwalkan)
          </button>
        </div>
      </div>

      {/* Result Display */}
      {selectedReq ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-6">
          
          {/* Top Banner Info */}
          <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                <span>Tiket Layanan Resmi UPTD PALD</span>
                <span aria-hidden="true">·</span>
                <span>Kota Binjai</span>
              </div>
              <h3 className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                {selectedReq.ticketNumber}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Pemohon: <span className="text-white font-medium">{selectedReq.customerName}</span> · Kecamatan {selectedReq.district}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {selectedReq.status === 'completed' && selectedReq.septicCard && (
                <button
                  onClick={() => onOpenSepticCard(selectedReq)}
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  Buka Kartu Septik Sehat
                </button>
              )}

              <a
                href={getWhatsAppCitizenNoticeLink(selectedReq)}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-teal-400" />
                Info WhatsApp
              </a>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="px-6 py-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Alur Perkembangan Layanan
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={step.status}
                    className={`p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'border-teal-500 bg-teal-50/80 shadow-sm ring-1 ring-teal-500'
                        : isPassed
                        ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isCurrent
                          ? 'bg-teal-600 text-white'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        Tahap {idx + 1}
                      </span>
                      {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className={`text-xs font-bold ${
                      isCurrent ? 'text-teal-900' : isPassed ? 'text-slate-900' : 'text-slate-500'
                    }`}>
                      {step.label}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {step.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dispatch & Assigned Truck Info Box */}
          {selectedReq.assignedTruck && (
            <div className="mx-6 p-4 sm:p-5 bg-gradient-to-r from-teal-50 to-slate-50 rounded-xl border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-teal-800 uppercase tracking-wide">
                    Armada Pelaksana UPTD PALD
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    {selectedReq.assignedTruck.code} · Plat: <span className="font-mono text-teal-900">{selectedReq.assignedTruck.plateNumber}</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Driver: <strong>{selectedReq.assignedTruck.driverName}</strong> · Kru: {selectedReq.assignedTruck.helperName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedReq.assignedTruck.driverPhone}`}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  Hubungi Driver
                </a>
                <a
                  href={`https://wa.me/62${selectedReq.assignedTruck.driverPhone.replace(/^0/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  WhatsApp Driver
                </a>
              </div>
            </div>
          )}

          {/* Detailed Request Metadata & Timeline History */}
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Detail Pemohon */}
            <div className="border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Informasi Pemesanan & Alamat
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Pemohon:</span>
                  <span className="font-semibold text-slate-900">{selectedReq.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor WhatsApp:</span>
                  <span className="font-mono text-slate-900">{selectedReq.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kecamatan / Kelurahan:</span>
                  <span>{selectedReq.district} / {selectedReq.subDistrict}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Alamat Lengkap:</span>
                  <span className="text-right max-w-[65%] text-slate-900">{selectedReq.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Akses Truk & Titik Tangki:</span>
                  <span className="text-right max-w-[65%] text-slate-700">{selectedReq.accessNotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jarak Selang:</span>
                  <span>± {selectedReq.hoseDistanceMeters} meter</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-slate-900">
                  <span>Retribusi Perda:</span>
                  <span className="text-teal-700 font-mono">
                    Rp {selectedReq.feeAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Riwayat Catatan Tim Lapangan */}
            <div className="border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Catatan Petugas & Riwayat Waktu
              </div>

              <div className="space-y-3">
                {selectedReq.timeline.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-1 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-slate-900 font-semibold">
                        <span>{item.label}</span>
                        <span className="text-[11px] font-normal text-slate-400 font-mono">{item.timestamp}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">
                        {item.note}
                      </p>
                      {item.officer && (
                        <span className="text-[10px] text-teal-700 font-medium">
                          Oleh: {item.officer}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : hasSearched ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-900">
            Nomor Tiket Tidak Ditemukan
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Silakan periksa kembali nomor tiket Anda atau hubungi layanan WhatsApp UPTD PALD Kota Binjai.
          </p>
          <button
            onClick={onNavigateToBooking}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
          >
            Buat Permohonan Baru
          </button>
        </div>
      ) : null}

    </div>
  );
};
