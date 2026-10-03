export type ServiceType = 
  | 'l2tt_reguler'      // Layanan Lumpur Tinja Tidak Terjadwal (Reguler On-Call) - Rp 350.000
  | 'l2t2_berkala'      // Layanan Terjadwal Berkala (Langganan 2 Tahun) - Rp 315.000
  | 'darurat'           // Layanan Darurat Mampet Parah (Prioritas Cepat) - Rp 400.000
  | 'niaga'             // Niaga / Komersial / Ruko / Kafe - Rp 500.000
  | 'instansi'          // Instansi Pemerintah / Swasta / Perkantoran / Sekolah - Rp 400.000
  | 'rumah_ibadah';     // Rumah Ibadah (Masjid, Gereja, Musholla) - Rp 200.000

export type ServiceStatus = 
  | 'received'          // Permohonan Diterima
  | 'verified'          // Verifikasi Administrasi & Lokasi
  | 'scheduled'         // Dijadwalkan
  | 'on_the_way'        // Petugas Menuju Lokasi
  | 'in_progress'       // Sedang Penyedotan di Lokasi
  | 'completed'         // Layanan Selesai & Kartu Terbit
  | 'cancelled';        // Dibatalkan

export interface StatusHistoryItem {
  status: ServiceStatus;
  label: string;
  timestamp: string;
  note: string;
  officer?: string;
}

export interface SepticCardData {
  cardNumber: string;
  customerName: string;
  address: string;
  district: string;
  subDistrict: string;
  lastServiceDate: string;
  nextRecommendedDate: string;
  tankVolumeM3: number;
  condition: 'Sangat Baik' | 'Standar SNI' | 'Perlu Perbaikan';
  officerName: string;
  truckPlate: string;
}

export interface ArmadaTruck {
  id: string;
  code: string;
  plateNumber: string;
  capacityM3: number;
  driverName: string;
  driverPhone: string;
  helperName: string;
  status: 'tersedia' | 'bertugas' | 'perawatan';
  currentDistrict?: string;
}

export interface ServiceRequest {
  id: string;
  ticketNumber: string; // e.g. PALD-BINJAI-2026-00125
  customerName: string;
  nik: string;
  phone: string;
  email?: string;
  address: string;
  district: string;       // Kecamatan
  subDistrict: string;    // Kelurahan
  serviceType: ServiceType;
  estimatedVolumeM3: number;
  hoseDistanceMeters: number; // Jarak selang
  preferredDate: string;
  preferredTimeSlot: 'pagi' | 'siang' | 'sore'; // Pagi (08:30-11:30), Siang (13:00-15:30)
  accessNotes: string;
  photoUrl?: string;
  status: ServiceStatus;
  timeline: StatusHistoryItem[];
  assignedTruck?: ArmadaTruck;
  feeAmount: number;
  paymentStatus: 'pending' | 'verified_cash' | 'qris_transferred';
  septicCard?: SepticCardData;
  createdAt: string;
  updatedAt: string;
}

export type ComplaintCategory = 
  | 'keterlambatan_kedatangan'
  | 'sikap_perilaku_petugas'
  | 'ketidaksesuaian_tarif'
  | 'kualitas_hasil_pekerjaan'
  | 'kendala_informasi_tracking'
  | 'kritik_saran_pelayanan';

export type ComplaintStatus = 
  | 'menunggu_verifikasi'
  | 'dalam_tinjauan'
  | 'petugas_diluncurkan'
  | 'selesai';

export interface ComplaintItem {
  id: string;
  ticketNumber: string; // ADUAN-2026-0042
  reporterName: string;
  phone: string;
  district: string;
  subDistrict: string;
  address: string;
  category: ComplaintCategory;
  description: string;
  photoUrl?: string;
  status: ComplaintStatus;
  officialResponse?: string;
  createdAt: string;
  resolvedAt?: string;
}
