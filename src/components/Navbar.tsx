import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  FileText, 
  AlertCircle, 
  BookOpen, 
  QrCode, 
  ShieldCheck, 
  Phone, 
  Menu, 
  X,
  UserCheck,
  Building2
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  openAdminModal: () => void;
  openBookingModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  openAdminModal,
  openBookingModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'pesan', label: 'Pesan Layanan' },
    { id: 'lacak', label: 'Lacak Tiket' },
    { id: 'jadwal-tarif', label: 'Tarif & Wilayah' },
    { id: 'qr-layanan', label: 'QR Truk & Info' },
    { id: 'edukasi', label: 'Edukasi Sanitasi' },
    { id: 'pengaduan', label: 'Pengaduan Pelayanan' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Bar Contract: Zone 1 (Brand), Zone 2 (4-6 nav links), Zone 3 (1-2 primary actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Brand title, single line */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setActiveTab('beranda'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm shadow-teal-600/30 group-hover:bg-teal-700 transition-colors">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  SI-PALD BINJAI
                </span>
                <span className="text-[11px] font-medium text-slate-500 leading-tight">
                  UPTD PALD Dinas PUTR Kota Binjai
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (single line, subtle hover underline) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap rounded-md ${
                    isActive
                      ? 'text-teal-700 bg-teal-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === 'admin'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  Dashboard Petugas
                </button>
                <button
                  onClick={() => {
                    setIsAdminLoggedIn(false);
                    if (activeTab === 'admin') setActiveTab('beranda');
                  }}
                  className="px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors whitespace-nowrap"
                  title="Keluar Admin"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={openAdminModal}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                Login Petugas
              </button>
            )}

            <button
              onClick={() => {
                setActiveTab('pesan');
                openBookingModal();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] rounded-lg shadow-sm shadow-teal-600/20 transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              Pesan Sedot Tinja
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('pesan');
                openBookingModal();
              }}
              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg whitespace-nowrap"
            >
              Pesan
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus-visible:outline-none"
              aria-label="Menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center justify-between ${
                activeTab === link.id
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{link.label}</span>
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAdminLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg"
                >
                  Buka Dashboard Petugas
                </button>
                <button
                  onClick={() => {
                    setIsAdminLoggedIn(false);
                    if (activeTab === 'admin') setActiveTab('beranda');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  Keluar dari Akun Petugas
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  openAdminModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg"
              >
                Login Petugas UPTD
              </button>
            )}

            <a
              href="https://wa.me/628137344470"
              target="_blank"
              rel="noreferrer"
              className="w-full text-center px-4 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              Hotline WhatsApp UPTD (0813-7344-470)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
