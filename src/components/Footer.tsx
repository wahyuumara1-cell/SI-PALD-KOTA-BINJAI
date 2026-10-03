import React from 'react';
import { Truck, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  openAdminModal: () => void;
  isAdminLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  openAdminModal,
  isAdminLoggedIn,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight">SI-PALD BINJAI</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Sistem Informasi Pelayanan Pengelolaan Air Limbah Domestik Kota Binjai. Unit Pelaksana Teknis Daerah (UPTD) Dinas Pekerjaan Umum dan Penataan Ruang.
            </p>
            <div className="text-[11px] text-teal-400 font-semibold">
              "Pesan Mudah. Dijadwalkan. Dijemput. Selesai."
            </div>
          </div>

          {/* Col 2: Nav Menu */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Layanan Warga
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={() => onNavigate('pesan')} className="hover:text-white transition-colors">
                  Pesan Sedot Tangki Septik
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('lacak')} className="hover:text-white transition-colors">
                  Lacak Tiket & Posisi Truk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('jadwal-tarif')} className="hover:text-white transition-colors">
                  Tarif Retribusi & Jadwal Wilayah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('qr-layanan')} className="hover:text-white transition-colors">
                  Inovasi QR Code Truk Tinja
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('edukasi')} className="hover:text-white transition-colors">
                  Edukasi Sanitasi Domestik
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pengaduan')} className="hover:text-white transition-colors">
                  Layanan Pengaduan & Aduan Limbah
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Operational & Coverage */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Wilayah Kerja (5 Kecamatan)
            </div>
            <ul className="space-y-1 text-[11px]">
              <li>Kecamatan Binjai Kota (7 Kelurahan)</li>
              <li>Kecamatan Binjai Barat (6 Kelurahan)</li>
              <li>Kecamatan Binjai Timur (6 Kelurahan)</li>
              <li>Kecamatan Binjai Utara (9 Kelurahan)</li>
              <li>Kecamatan Binjai Selatan (7 Kelurahan)</li>
            </ul>
            <div className="pt-2 text-[11px] text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Senin - Jumat: 08.00 - 16.00 WIB</span>
            </div>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Kantor UPTD PALD Kota Binjai
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>Kantor Dinas PUTR Binjai, Jl. MT Haryono, Kota Binjai, Sumatera Utara</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <a href="https://wa.me/628137344470" target="_blank" rel="noreferrer" className="hover:text-white">
                  WhatsApp: 0813-7344-470
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>uptdpald@binjaikota.go.id</span>
              </div>
            </div>

            <div className="pt-2">
              {!isAdminLoggedIn ? (
                <button
                  onClick={openAdminModal}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 text-[11px] transition-colors"
                >
                  Login Internal Petugas UPTD
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-3 py-1.5 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-[11px] font-semibold"
                >
                  Buka Dashboard Petugas
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Quiet copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Pemerintah Kota Binjai · Dinas Pekerjaan Umum dan Penataan Ruang · UPTD PALD.
          </div>
          <div className="flex items-center gap-3">
            <span>Inovasi Sanitasi Berkelanjutan</span>
            <span aria-hidden="true">·</span>
            <span>Kota Binjai Bebas BABS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
