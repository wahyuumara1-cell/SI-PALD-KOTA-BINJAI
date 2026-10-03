import React, { useState } from 'react';
import { 
  QrCode, 
  Truck, 
  Printer, 
  Building2, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';

interface QRCodeTruckSectionProps {
  onOpenBooking: () => void;
  onOpenTrack: () => void;
  onOpenComplaint: () => void;
}

export const QRCodeTruckSection: React.FC<QRCodeTruckSectionProps> = ({
  onOpenBooking,
  onOpenTrack,
  onOpenComplaint,
}) => {
  const [templateType, setTemplateType] = useState<'truk' | 'kelurahan' | 'brosur'>('truk');

  const handlePrintSticker = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      
      {/* Intro Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Inovasi Pelayanan Publik UPTD PALD
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          "Lihat Truk PALD? Scan QR-nya!"
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Warga tidak perlu repot mencari kantor atau calo. Cukup arahkan kamera smartphone ke stiker barcode QR di truk tangki tinja UPTD atau kantor kelurahan untuk memesan layanan seketika.
        </p>

        {/* Template Selector Tabs */}
        <div className="pt-2 flex items-center justify-center gap-2">
          <button
            onClick={() => setTemplateType('truk')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              templateType === 'truk'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Stiker Truk Operasional UPTD
          </button>
          <button
            onClick={() => setTemplateType('kelurahan')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              templateType === 'kelurahan'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Poster Kantor Camat / Kelurahan
          </button>
          <button
            onClick={() => setTemplateType('brosur')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              templateType === 'brosur'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Brosur Edukasi Warga
          </button>
        </div>
      </div>

      {/* Main Interactive Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Left Side: Live Printable Sticker Layout */}
        <div className="lg:col-span-6 bg-white rounded-2xl border-2 border-slate-300 p-6 sm:p-8 shadow-md" id="printable-card">
          
          <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white text-center relative overflow-hidden shadow-inner">
            
            {/* Header Badge */}
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-teal-300 mb-1">
              PEMERINTAH KOTA BINJAI · DINAS PUTR
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-white">
              UPTD PENGELOLAAN AIR LIMBAH DOMESTIK
            </div>

            <div className="w-16 h-0.5 bg-teal-400 mx-auto my-3" />

            <div className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1">
              {templateType === 'truk' ? 'BUTUH SEDOT TINJA?' : 
               templateType === 'kelurahan' ? 'LAYANAN SEDOT TINJA KOTA BINJAI' : 'GERAKAN KOTA BINJAI SEHAT'}
            </div>
            <p className="text-xs sm:text-sm text-teal-100 font-medium">
              "Tinggal Scan Barcode, Petugas Segera Datang"
            </p>

            {/* High Contrast QR Code Display */}
            <div className="my-6 mx-auto w-48 sm:w-56 bg-white p-4 rounded-2xl shadow-xl border-4 border-teal-400/40">
              <div className="w-full aspect-square bg-slate-900 text-white p-2 rounded-xl flex flex-col items-center justify-center relative">
                <QrCode className="w-full h-full text-white" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-teal-600 text-white rounded-lg flex items-center justify-center shadow-md border-2 border-white">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="mt-2 text-slate-800 font-bold text-xs uppercase tracking-wider text-center">
                SI-PALD BINJAI
              </div>
            </div>

            {/* Quick Points */}
            <div className="grid grid-cols-2 gap-2 text-left text-[11px] text-teal-100 bg-teal-900/40 p-3 rounded-xl border border-teal-600/30">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                <span>Pesan Cepat 1 Menit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                <span>Tarif Resmi Pemko</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                <span>Pelacakan Armada Truk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                <span>Kartu Septik Sehat</span>
              </div>
            </div>

            {/* Footer Contact Hotline */}
            <div className="mt-4 pt-3 border-t border-teal-700/60 text-[11px] text-teal-200">
              WhatsApp Layanan: <strong className="text-white font-mono text-xs">0813-7344-470</strong>
            </div>

          </div>

          <div className="mt-4 flex items-center justify-between no-print">
            <span className="text-xs text-slate-500">
              Format siap cetak stiker tahan air (outdoor decal).
            </span>
            <button
              onClick={handlePrintSticker}
              className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              Cetak Template Ini
            </button>
          </div>

        </div>

        {/* Right Side: What Happens When Citizen Scans */}
        <div className="lg:col-span-6 space-y-5">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Apa yang Didapat Warga Saat Memindai QR?
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Ketika warga memindai barcode QR di pintu truk atau kantor lurah, layar instan terbuka dengan 5 menu cepat:
            </p>

            <div className="space-y-3">
              
              <div 
                onClick={onOpenBooking}
                className="p-3.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-teal-900">
                      1. Pesan Sedot Tinja Langsung
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Isi nama, alamat rumah, dan pilih tanggal penyedotan.
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
              </div>

              <div 
                onClick={onOpenTrack}
                className="p-3.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-teal-900">
                      2. Cek Jadwal & Lacak Armada
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Ketahui posisi tim petugas terdekat di kelurahan Anda.
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
              </div>

              <div 
                onClick={onOpenComplaint}
                className="p-3.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-teal-900">
                      3. Layanan Pengaduan & Aduan Limbah
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Laporkan WC mampet atau saluran air limbah yang meluap.
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
              </div>

            </div>
          </div>

          {/* Lokasi Pemasangan QR Rekomendasi */}
          <div className="p-5 bg-teal-50/80 rounded-2xl border border-teal-200/80">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-xs mb-2">
              <Building2 className="w-4 h-4 text-teal-700" />
              Titik Penempatan QR Code SI-PALD di Kota Binjai:
            </div>
            <ul className="text-xs text-teal-800 space-y-1.5 list-disc list-inside">
              <li>Pintu samping & belakang seluruh armada truk tinja UPTD</li>
              <li>Papan loket pelayanan 5 Kantor Camat & 37 Kantor Kelurahan</li>
              <li>Ruang tunggu 8 Puskesmas & Puskesmas Pembantu se-Kota Binjai</li>
              <li>Stiker sosialisasi di posyandu dan balai warga perumahan</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
