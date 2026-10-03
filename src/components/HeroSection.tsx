import React from 'react';
import { 
  Truck, 
  Search, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  QrCode, 
  Clock, 
  ArrowRight,
  PhoneCall,
  Sparkles,
  MapPin,
  CalendarCheck
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
  openBooking: () => void;
  onOpenCardDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  openBooking,
  onOpenCardDemo,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background imagery with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_pald_truck_1790959709531.jpg"
          alt="Armada Truk Tangki Tinja UPTD PALD Kota Binjai"
          className="w-full h-full object-cover object-center opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        
        {/* Civic Trust Header Kicker (Clean unboxed text metadata) */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-300 mb-4">
          <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>Pemerintah Kota Binjai</span>
          <span aria-hidden="true">·</span>
          <span>Dinas PUTR</span>
          <span aria-hidden="true">·</span>
          <span>UPTD Pengelolaan Air Limbah Domestik</span>
        </div>

        {/* Display Headline with text-wrap balance & no orphan words */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15] text-balance">
          Layanan Sedot Tinja Resmi Kota Binjai:{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">
            Mudah, Bersih, dan Transparan
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          Inovasi <strong className="text-white font-semibold">SI-PALD BINJAI</strong> mempermudah warga 5 kecamatan untuk memesan layanan penyedotan tangki septik, memantau armada secara transparan, dan memperoleh <span className="text-teal-300 font-medium">Kartu Septik Sehat digital</span> resmi Pemko Binjai.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            onClick={openBooking}
            className="px-6 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 active:scale-[0.98] rounded-xl shadow-lg shadow-teal-900/30 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Truck className="w-4 h-4" />
            Pesan Penyedotan Sekarang
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => onNavigate('lacak')}
            className="px-5 py-3 text-sm font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Search className="w-4 h-4 text-teal-400" />
            Lacak Status Tiket Layanan
          </button>

          <button
            onClick={onOpenCardDemo}
            className="px-4 py-3 text-sm font-medium text-teal-300 hover:text-teal-200 hover:bg-teal-950/40 border border-teal-800/50 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Award className="w-4 h-4 text-teal-300" />
            Lihat Contoh Kartu Septik Sehat
          </button>
        </div>

        {/* Trust Badges - 4 Inovasi Utama (Clean Unboxed Grid) */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-teal-400 mb-1">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span className="text-sm font-bold text-white">Retribusi Resmi Perda</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mulai Rp 350.000/rit untuk rumah tinggal. Tarif pasti tanpa pungutan liar.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-teal-400 mb-1">
              <CalendarCheck className="w-5 h-5 shrink-0" />
              <span className="text-sm font-bold text-white">L2T2 & L2TT Terjadwal</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pilihan sedot reguler on-call maupun program berkala 2-3 tahunan berdiskon 10%.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-teal-400 mb-1">
              <Clock className="w-5 h-5 shrink-0" />
              <span className="text-sm font-bold text-white">Pelacakan Real-Time</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cek posisi armada, identitas supir, plat truk, dan estimasi waktu tiba.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-teal-400 mb-1">
              <Award className="w-5 h-5 shrink-0" />
              <span className="text-sm font-bold text-white">e-Kartu Septik Sehat</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sertifikat digital rumah peduli sanitasi dengan pengingat otomatis berkala.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
