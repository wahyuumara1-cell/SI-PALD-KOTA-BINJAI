/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BookingForm } from './components/BookingForm';
import { TicketTracker } from './components/TicketTracker';
import { SepticCardModal } from './components/SepticCardModal';
import { QRCodeTruckSection } from './components/QRCodeTruckSection';
import { ScheduleTariffSection } from './components/ScheduleTariffSection';
import { ComplaintSection } from './components/ComplaintSection';
import { SanitationEducation } from './components/SanitationEducation';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Footer } from './components/Footer';
import { ServiceRequest, SepticCardData } from './types/pald';
import { getRequests } from './utils/storage';
import { 
  Truck, 
  Search, 
  Award, 
  QrCode, 
  DollarSign, 
  BookOpen, 
  ShieldAlert, 
  ArrowRight,
  Sparkles,
  Phone
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [septicCardData, setSepticCardData] = useState<SepticCardData | null>(null);
  const [trackedTicket, setTrackedTicket] = useState<string>('PALD-BINJAI-2026-00125');

  // Handle open sample card
  const handleOpenDemoCard = () => {
    const list = getRequests();
    const itemWithCard = list.find(r => r.septicCard);
    if (itemWithCard?.septicCard) {
      setSepticCardData(itemWithCard.septicCard);
    } else {
      setSepticCardData({
        cardNumber: 'KSS-BINJAI-2026-00089',
        customerName: 'Ibu Ratna Dewi Siregar',
        address: 'Komplek Griya Mandiri Blok C No. 12',
        district: 'Binjai Barat',
        subDistrict: 'Bandar Senembah',
        lastServiceDate: '01 Oktober 2026',
        nextRecommendedDate: '01 Oktober 2028',
        tankVolumeM3: 3.0,
        condition: 'Standar SNI',
        officerName: 'Wira Syahputra Lubis & Tim UPTD PALD',
        truckPlate: 'BK 8155 R',
      });
    }
  };

  const handleOpenSepticCardFromReq = (req: ServiceRequest) => {
    if (req.septicCard) {
      setSepticCardData(req.septicCard);
    } else {
      // Create quick on-the-fly preview
      setSepticCardData({
        cardNumber: `KSS-${req.ticketNumber.replace('PALD-', '')}`,
        customerName: req.customerName,
        address: req.address,
        district: req.district,
        subDistrict: req.subDistrict,
        lastServiceDate: '02 Oktober 2026',
        nextRecommendedDate: '02 Oktober 2028',
        tankVolumeM3: req.estimatedVolumeM3 || 3.5,
        condition: 'Standar SNI',
        officerName: req.assignedTruck?.driverName || 'Wira Syahputra Lubis (Tim UPTD)',
        truckPlate: req.assignedTruck?.plateNumber || 'BK 8155 R',
      });
    }
  };

  const handleBookingSuccess = (ticketNumber: string) => {
    setTrackedTicket(ticketNumber);
  };

  const handleNavigateToTrack = (ticketNumber: string) => {
    setTrackedTicket(ticketNumber);
    setActiveTab('lacak');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
        openAdminModal={() => setLoginModalOpen(true)}
        openBookingModal={() => {
          setActiveTab('pesan');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* TAB 1: BERANDA */}
        {activeTab === 'beranda' && (
          <div className="space-y-16 pb-16">
            
            {/* Hero Section */}
            <HeroSection
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              openBooking={() => {
                setActiveTab('pesan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenCardDemo={handleOpenDemoCard}
            />

            {/* Quick Service Selection Bento Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Inovasi SI-PALD SMART SERVICE
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Pusat Layanan Sanitasi Terpadu Kota Binjai
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Kemudahan akses layanan pengelolaan lumpur tinja dalam genggaman warga.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1: Jemput Lumpur Terjadwal */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      Inovasi 01
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      "JEMPUT LIMBAH" Terjadwal & On-Call
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Pemesanan penyedotan lumpur tinja tanpa antre di kantor. Pilih layanan reguler maupun langganan berkala 2 tahunan dengan diskon retribusi 10%.
                    </p>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => {
                        setActiveTab('pesan');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 group"
                    >
                      Pesan Layanan Sekarang
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Card 2: PALD Tracking */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                      <Search className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      Inovasi 02
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      PALD Tracking & Transparansi Armada
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Lacak proses tiket secara transparan: Permohonan Diterima → Verifikasi → Penjadwalan → Petugas Menuju Lokasi (Plat Truk & Supir) → Penyedotan Selesai.
                    </p>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => {
                        setActiveTab('lacak');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 group"
                    >
                      Cek Status Tiket Anda
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Card 3: Kartu Septik Sehat */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      Inovasi 03
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      e-Kartu Septik Sehat Digital
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Sertifikat digital rumah peduli sanitasi resmi Pemerintah Kota Binjai dengan riwayat tanggal penyedotan dan pengingat otomatis siklus 2 tahun berikutnya.
                    </p>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={handleOpenDemoCard}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 group"
                    >
                      Lihat Contoh Kartu Digital
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* Inovasi QR Code Teaser Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <QRCodeTruckSection
                onOpenBooking={() => {
                  setActiveTab('pesan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenTrack={() => {
                  setActiveTab('lacak');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenComplaint={() => {
                  setActiveTab('pengaduan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </section>

            {/* Edukasi Singkat Teaser */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SanitationEducation
                onOpenBooking={() => {
                  setActiveTab('pesan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </section>

          </div>
        )}

        {/* TAB 2: PESAN LAYANAN */}
        {activeTab === 'pesan' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <BookingForm
              onSuccess={handleBookingSuccess}
              onNavigateToTrack={handleNavigateToTrack}
            />
          </div>
        )}

        {/* TAB 3: LACAK STATUS TIKET */}
        {activeTab === 'lacak' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <TicketTracker
              initialTicket={trackedTicket}
              onOpenSepticCard={handleOpenSepticCardFromReq}
              onNavigateToBooking={() => {
                setActiveTab('pesan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* TAB 4: JADWAL & TARIF */}
        {activeTab === 'jadwal-tarif' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <ScheduleTariffSection
              onOpenBooking={() => {
                setActiveTab('pesan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* TAB 5: QR TRUK & INFO */}
        {activeTab === 'qr-layanan' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <QRCodeTruckSection
              onOpenBooking={() => {
                setActiveTab('pesan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenTrack={() => {
                setActiveTab('lacak');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenComplaint={() => {
                setActiveTab('pengaduan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* TAB 6: EDUKASI SANITASI */}
        {activeTab === 'edukasi' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <SanitationEducation
              onOpenBooking={() => {
                setActiveTab('pesan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* TAB 7: PENGADUAN */}
        {activeTab === 'pengaduan' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <ComplaintSection />
          </div>
        )}

        {/* TAB 8: ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {isAdminLoggedIn ? (
              <AdminDashboard
                onOpenSepticCard={handleOpenSepticCardFromReq}
                onLogout={() => {
                  setIsAdminLoggedIn(false);
                  setActiveTab('beranda');
                }}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Akses Terbatas Petugas UPTD
                </h3>
                <p className="text-xs text-slate-500">
                  Silakan masuk menggunakan akun petugas UPTD PALD Kota Binjai untuk mengelola permohonan dan armada.
                </p>
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl"
                >
                  Buka Modal Login
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Global Modals */}
      {septicCardData && (
        <SepticCardModal
          cardData={septicCardData}
          onClose={() => setSepticCardData(null)}
        />
      )}

      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setActiveTab('admin');
        }}
      />

      {/* Global Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openAdminModal={() => setLoginModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

    </div>
  );
}
