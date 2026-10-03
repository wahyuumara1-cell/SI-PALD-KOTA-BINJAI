import React, { useState } from 'react';
import { 
  DollarSign, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  HelpCircle,
  Calculator,
  ArrowRight
} from 'lucide-react';
import { BINJAI_DISTRICTS, TARIFF_RULES } from '../data/binjaiData';

interface ScheduleTariffSectionProps {
  onOpenBooking: () => void;
}

export const ScheduleTariffSection: React.FC<ScheduleTariffSectionProps> = ({
  onOpenBooking,
}) => {
  const [selectedCalcCategory, setSelectedCalcCategory] = useState<number>(0);
  const [calcRits, setCalcRits] = useState<number>(1);
  const [isSubscribedL2T2, setIsSubscribedL2T2] = useState<boolean>(false);

  const baseRate = TARIFF_RULES[selectedCalcCategory]?.ratePerRit || 350000;
  const calculatedTotal = isSubscribedL2T2 && selectedCalcCategory === 0
    ? Math.round(baseRate * 0.9 * calcRits)
    : baseRate * calcRits;

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
          <DollarSign className="w-3.5 h-3.5" />
          Transparan & Pasti Sesuai Perda Kota Binjai
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Tarif Retribusi & Wilayah Pelayanan
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Seluruh retribusi penyedotan disetorkan resmi ke Kas Daerah Kota Binjai untuk pemeliharaan Instalasi Pengolahan Lumpur Tinja (IPLT).
        </p>
      </div>

      {/* Grid: Tarif Cards & Interactive Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Tarif List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            Daftar Tarif Retribusi Resmi (Per Rit ± 3-4 m³)
          </h3>

          <div className="space-y-3">
            {TARIFF_RULES.map((rule, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 hover:border-teal-300 rounded-xl p-4 sm:p-5 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{rule.category}</span>
                    <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      {rule.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                    {rule.description}
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <div className="text-base sm:text-lg font-bold text-teal-800 font-mono tabular-nums">
                    Rp {rule.ratePerRit.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[10px] text-slate-400 block">per penyedotan (rit)</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span>
              <strong>Bebas Pungutan Liar:</strong> Pembayaran disertai bukti karcis retribusi sah berlogo Pemko Binjai dan kuitansi elektronik resmi.
            </span>
          </div>
        </div>

        {/* Right: Interactive Retribution Calculator */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-4 h-4" />
            Simulasi Biaya Retribusi
          </div>
          <h3 className="text-lg font-bold text-white mb-4">
            Kalkulator Retribusi Mandiri
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Kategori Bangunan
              </label>
              <select
                value={selectedCalcCategory}
                onChange={(e) => setSelectedCalcCategory(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-teal-400"
              >
                {TARIFF_RULES.map((rule, idx) => (
                  <option key={idx} value={idx}>
                    {rule.category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Perkiraan Rit / Kapasitas Tangki (1 rit ≈ 3.5 m³)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((rit) => (
                  <button
                    key={rit}
                    type="button"
                    onClick={() => setCalcRits(rit)}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      calcRits === rit
                        ? 'bg-teal-500 text-slate-950 font-extrabold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {rit} Rit ({rit * 3.5} m³)
                  </button>
                ))}
              </div>
            </div>

            {selectedCalcCategory === 0 && (
              <label className="flex items-center gap-2 p-2.5 bg-slate-800/80 rounded-lg cursor-pointer border border-slate-700">
                <input
                  type="checkbox"
                  checked={isSubscribedL2T2}
                  onChange={(e) => setIsSubscribedL2T2(e.target.checked)}
                  className="rounded text-teal-500 focus:ring-teal-400"
                />
                <span className="text-slate-300">
                  Daftar program berkala 2 tahunan (Diskon 10%)
                </span>
              </label>
            )}

            {/* Total Display */}
            <div className="pt-4 border-t border-slate-700/80">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">
                Total Estimasi Retribusi Resmi:
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono tabular-nums mt-1">
                Rp {calculatedTotal.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Sudah termasuk pengangkutan dan pengolahan limbah di IPLT Kota Binjai.
              </p>
            </div>

            <button
              onClick={onOpenBooking}
              className="w-full mt-2 py-2.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              Pesan dengan Tarif Ini Sekarang
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Jadwal Operasional & Wilayah Pelayanan 5 Kecamatan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Jadwal Rutin Wilayah
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Jadwal Operasional Armada 5 Kecamatan Kota Binjai
            </h3>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Senin - Jumat: 08.00 - 16.00 WIB</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(BINJAI_DISTRICTS).map(([districtName, info]) => (
            <div
              key={districtName}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-400 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {districtName}
                </span>
                <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded">
                  {info.assignedTruckCode}
                </span>
              </div>

              <div className="text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Hari Rutin:
                </span>
                <span className="font-semibold text-teal-800">
                  {info.scheduleDays.join(' & ')}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Kelurahan:
                </span>
                <div className="text-[11px] text-slate-600 leading-snug">
                  {info.subDistricts.slice(0, 4).join(', ')}
                  {info.subDistricts.length > 4 && `, +${info.subDistricts.length - 4} lainnya`}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Syarat Teknis Penyedotan */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold text-[10px]">1</div>
            <div>
              <strong className="text-slate-900 block">Titik Tutup Tangki (Manhole)</strong>
              Pastikan lubang kontrol tangki septik dapat dibuka atau diketahui lokasinya saat petugas tiba.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold text-[10px]">2</div>
            <div>
              <strong className="text-slate-900 block">Akses Jarak Selang</strong>
              Jarak aman jalan truk ke tangki septik hingga 30-40 meter. Untuk gang sempit mohon beri catatan pada form.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold text-[10px]">3</div>
            <div>
              <strong className="text-slate-900 block">Ketersediaan Air Pengencer</strong>
              Jika endapan lumpur sudah membatu, sediakan 1-2 ember air untuk proses flushing/pengenceran awal.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
