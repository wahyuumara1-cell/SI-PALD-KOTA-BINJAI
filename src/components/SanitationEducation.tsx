import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Droplet, 
  ShieldCheck, 
  HeartHandshake,
  ExternalLink,
  Info
} from 'lucide-react';

interface SanitationEducationProps {
  onOpenBooking: () => void;
}

export const SanitationEducation: React.FC<SanitationEducationProps> = ({
  onOpenBooking,
}) => {
  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
          Edukasi & Sosialisasi Sanitasi Aman
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          "Jangan Tunggu WC Mampet!"
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Kenali pentingnya penyedotan tangki septik secara berkala untuk melindungi kesehatan keluarga dan sumber air tanah di Kota Binjai.
        </p>
      </div>

      {/* Main Educational Feature with Diagram Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        
        {/* Left: Diagram Graphic */}
        <div className="lg:col-span-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <img
            src="/src/assets/images/septic_tank_diagram_1790959728536.jpg"
            alt="Diagram Konstruksi Tangki Septik Standar SNI"
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="p-3 bg-slate-100 text-[11px] text-slate-600 text-center font-medium">
            Skematik Tangki Septik Biofilter Standar SNI 2398:2017
          </div>
        </div>

        {/* Right: Key Explanations */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Fakta Kesehatan Lingkungan
          </div>
          <h3 className="text-xl font-bold text-slate-900 leading-snug">
            Mengapa Tangki Septik Wajib Disedot Setiap 2–3 Tahun Sekali?
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Banyak warga beranggapan jika WC belum mampet, maka tangki septik masih aman. <strong className="text-rose-600 font-semibold">Padahal itu keliru besar!</strong> Bakteri alami hanya mampu menguraikan sebagian tinja. Sisanya mengendap menjadi lumpur tinja hitam pekat di dasar tangki.
          </p>

          <div className="space-y-2.5 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs text-slate-700">
                <strong className="text-slate-900 block">Pencemaran Air Sumur Gali & Sumur Bor</strong>
                Jika lumpur penuh, tinja yang belum matang akan meresap ke lapisan tanah dan mencemari air minum sumur warga dengan bakteri <em>Escherichia Coli (E. Coli)</em> pemicu diare, tifus, dan stunting pada anak.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                <Droplet className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs text-slate-700">
                <strong className="text-slate-900 block">Biaya Perbaikan Jauh Lebih Mahal</strong>
                Menunggu sampai pipa mampet total dapat menyebabkan septic tank pecah atau pori-pori resapan tanah tertutup permanen, yang memerlukan pembongkaran lantai rumah berbiaya jutaan rupiah.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs text-slate-700">
                <strong className="text-slate-900 block">Diolah Ramah Lingkungan di IPLT Kota Binjai</strong>
                Lumpur yang disedot oleh armada UPTD tidak dibuang sembarangan ke sungai, melainkan diproses di Instalasi Pengolahan Lumpur Tinja (IPLT) Pemko Binjai hingga aman bagi alam.
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              Daftar Program Sedot Berkala (L2T2)
            </button>
          </div>
        </div>

      </div>

      {/* Comparison: Septic Tank SNI vs Cubluk Liar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Tangki Septik Sehat Standar SNI
          </div>
          <ul className="text-xs text-emerald-900 space-y-2 list-disc list-inside">
            <li>Dinding dan dasar kedap air (beton/fiberglass) sehingga tinja tidak meresap liar.</li>
            <li>Memiliki 2 kompartemen (ruang pengendapan & ruang biofilter).</li>
            <li>Memiliki pipa ventilasi udara (T-pipe) agar gas metana keluar dengan aman.</li>
            <li>Memiliki lubang kontrol (manhole) yang mudah dibuka saat penyedotan berkala.</li>
            <li>Dilengkapi bidang resapan atau terhubung ke sistem pengolahan lanjutan.</li>
          </ul>
        </div>

        <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Cubluk / Lubang Tanah Liar (Bahaya)
          </div>
          <ul className="text-xs text-rose-900 space-y-2 list-disc list-inside">
            <li>Dasar tangki dibiarkan berupa tanah terbuka tanpa lapisan kedap.</li>
            <li>Tinja langsung kontak dengan air tanah yang diminum warga sekitar.</li>
            <li>Sumber utama kontaminasi bakteri patogen dan cacing parasit.</li>
            <li>Rentan runtuh dan amblas saat musim hujan di Kota Binjai.</li>
            <li>Melanggar standar sanitasi nasional dan peraturan daerah.</li>
          </ul>
        </div>

      </div>

      {/* Tips Praktis Merawat Tangki Septik */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-teal-400" />
          Tips Merawat WC & Tangki Septik Rumah Tangga
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="font-bold text-teal-300 block mb-1">
              1. Hindari Bahan Kimia Berlebih
            </span>
            Jangan sering menyiram karbol pemutih, deterjen keras, atau air soda api ke kloset, karena membunuh bakteri pengurai alami.
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="font-bold text-teal-300 block mb-1">
              2. Jangan Jadikan Kloset Tempat Sampah
            </span>
            Dilarang membuang tisu basah, pembalut, plastik, kondom, puntung rokok, atau minyak jelantah ke dalam lubang kloset.
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="font-bold text-teal-300 block mb-1">
              3. Catat Siklus Penyedotan
            </span>
            Gunakan e-Kartu Septik Sehat dari SI-PALD BINJAI sebagai panduan jadwal sedot berikutnya setiap 2-3 tahun sekali.
          </div>
        </div>
      </div>

    </div>
  );
};
