import React from 'react';
import { 
  Award, 
  X, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  QrCode, 
  Truck,
  Sparkles
} from 'lucide-react';
import { SepticCardData } from '../types/pald';

interface SepticCardModalProps {
  cardData: SepticCardData;
  onClose: () => void;
}

export const SepticCardModal: React.FC<SepticCardModalProps> = ({
  cardData,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `*KARTU DIGITAL SEPTIK SEHAT - KOTA BINJAI*\n` +
      `Sertifikat Rumah Peduli Sanitasi Lingkungan:\n\n` +
      `📌 *No. Kartu:* ${cardData.cardNumber}\n` +
      `👤 *Nama Pemilik:* ${cardData.customerName}\n` +
      `📍 *Alamat:* ${cardData.address}, Kel. ${cardData.subDistrict}, Kec. ${cardData.district}\n` +
      `✅ *Tanggal Sedot Terakhir:* ${cardData.lastServiceDate}\n` +
      `🔔 *Jadwal Sedot Berikutnya:* ${cardData.nextRecommendedDate}\n` +
      `🚛 *Armada UPTD:* ${cardData.truckPlate} (${cardData.officerName})\n\n` +
      `_Dikeluarkan resmi oleh UPTD Pengelolaan Air Limbah Domestik (PALD) Dinas PUTR Kota Binjai._`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
            <Award className="w-4 h-4" />
            <span>Inovasi UPTD PALD Kota Binjai · Kartu Septik Sehat</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Container */}
        <div id="printable-card" className="p-6 sm:p-8 bg-gradient-to-b from-white via-teal-50/20 to-white">
          
          {/* Card Frame with Civic Security Border */}
          <div className="border-2 border-teal-800/80 rounded-2xl p-6 sm:p-7 relative bg-white shadow-sm overflow-hidden">
            
            {/* Watermark Emblem */}
            <div className="absolute -right-8 -bottom-8 w-44 h-44 text-teal-900/5 pointer-events-none select-none">
              <Award className="w-full h-full" />
            </div>

            {/* Header: Pemerintah Kota Binjai */}
            <div className="text-center border-b-2 border-slate-900/80 pb-4 mb-5">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-700">
                PEMERINTAH KOTA BINJAI
              </div>
              <div className="text-xs font-bold text-slate-900">
                DINAS PEKERJAAN UMUM DAN PENATAAN RUANG
              </div>
              <div className="text-[11px] font-semibold text-teal-800">
                UPTD PENGELOLAAN AIR LIMBAH DOMESTIK (PALD)
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">
                Kantor Dinas PUTR Binjai, Jl. MT Haryono · Hotline WhatsApp: 0813-7344-470
              </div>
            </div>

            {/* Title Certificate */}
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 bg-teal-800 text-white text-[11px] font-extrabold tracking-wider uppercase rounded-full mb-1">
                KARTU SEPTIK SEHAT DIGITAL
              </span>
              <div className="text-xs font-semibold text-slate-600">
                Bukti Layanan & Sertifikasi Rumah Peduli Sanitasi
              </div>
            </div>

            {/* Customer & Service Info Grid */}
            <div className="space-y-3 text-xs text-slate-800">
              
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Nomor Pelanggan / ID:</span>
                <span className="font-mono font-bold text-teal-900 text-sm">{cardData.cardNumber}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Nama Pemilik Rumah:</span>
                <span className="font-bold text-slate-900 text-sm">{cardData.customerName}</span>
              </div>

              <div className="flex justify-between items-start py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium shrink-0">Alamat Rumah:</span>
                <span className="text-right text-slate-900 font-medium max-w-[65%]">
                  {cardData.address}, Kel. {cardData.subDistrict}, Kec. {cardData.district}, Kota Binjai
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-2 bg-teal-50/70 p-3 rounded-xl border border-teal-200/60 my-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-800 block">
                    Penyedotan Terakhir
                  </span>
                  <span className="font-bold text-slate-900 text-xs">
                    {cardData.lastServiceDate}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    Jadwal Sedot Berikutnya (2 Thn)
                  </span>
                  <span className="font-bold text-emerald-900 text-xs">
                    {cardData.nextRecommendedDate}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100 text-[11px]">
                <span className="text-slate-500">Volume Tangki Disedot:</span>
                <span className="font-bold text-slate-900">± {cardData.tankVolumeM3} m³</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100 text-[11px]">
                <span className="text-slate-500">Kondisi Tangki:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {cardData.condition}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 text-[11px]">
                <span className="text-slate-500">Armada & Petugas Pelaksana:</span>
                <span className="text-slate-900 font-medium">
                  {cardData.truckPlate} ({cardData.officerName})
                </span>
              </div>

            </div>

            {/* Footer Signatures & QR stamp */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-end justify-between">
              
              {/* QR Code Verification Stamp */}
              <div className="flex items-center gap-2">
                <div className="p-1.5 border border-slate-300 rounded-lg bg-white shadow-xs">
                  {/* Visual QR representation */}
                  <div className="w-12 h-12 bg-slate-900 text-white p-1 rounded flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="text-[9px] text-slate-500 leading-tight">
                  <strong className="text-slate-700 block">QR Verifikasi</strong>
                  Scan untuk cek<br />keaslian kartu
                </div>
              </div>

              {/* Official Seal and Sign */}
              <div className="text-right text-[10px] text-slate-700">
                <div>Kota Binjai, {cardData.lastServiceDate}</div>
                <div className="font-bold text-slate-900 mt-0.5">Kepala UPTD PALD Kota Binjai</div>
                <div className="font-semibold text-slate-500 text-[9px]">Dinas Pekerjaan Umum & Penataan Ruang</div>
                <div className="w-24 border-b border-slate-800 my-3 ml-auto" />
                <div className="font-bold text-slate-900 text-[11px]">FRANS ARMENDA GINTING, ST, M.Si</div>
                <div className="text-[9px] text-slate-500">NIP. 19780612 200502 1 003</div>
                <div className="text-[8px] text-slate-400 mt-0.5">Ka. TU: Sri Yunita Rizal, SE · Adm: Mhd. Azmi Rusdi</div>
              </div>

            </div>

          </div>

          <div className="mt-4 text-center text-xs text-slate-500 italic no-print">
            "Jangan Tunggu WC Mampet! Sedot Tangki Septik Secara Berkala 2–3 Tahun Sekali untuk Menjaga Kualitas Air Tanah Keluarga Anda."
          </div>

        </div>

        {/* Modal Bottom Actions (Hidden on Print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              Cetak / Simpan PDF
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              Bagikan ke WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
