import { ServiceRequest, ComplaintItem, ArmadaTruck, ServiceStatus } from '../types/pald';
import { INITIAL_REQUESTS, INITIAL_COMPLAINTS, INITIAL_ARMADA } from '../data/binjaiData';

const REQUESTS_KEY = 'si_pald_binjai_requests_v4';
const COMPLAINTS_KEY = 'si_pald_binjai_complaints_v5_service';
const ARMADA_KEY = 'si_pald_binjai_armada_v4';

export function getRequests(): ServiceRequest[] {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    if (!raw) {
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function saveRequests(items: ServiceRequest[]): void {
  try {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save requests:', err);
  }
}

export function getComplaints(): ComplaintItem[] {
  try {
    const raw = localStorage.getItem(COMPLAINTS_KEY);
    if (!raw) {
      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMPLAINTS;
  }
}

export function saveComplaints(items: ComplaintItem[]): void {
  try {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save complaints:', err);
  }
}

export function getArmada(): ArmadaTruck[] {
  try {
    const raw = localStorage.getItem(ARMADA_KEY);
    if (!raw) {
      localStorage.setItem(ARMADA_KEY, JSON.stringify(INITIAL_ARMADA));
      return INITIAL_ARMADA;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ARMADA;
  }
}

export function saveArmada(items: ArmadaTruck[]): void {
  try {
    localStorage.setItem(ARMADA_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save armada:', err);
  }
}

export function createServiceRequest(newReq: Omit<ServiceRequest, 'id' | 'ticketNumber' | 'timeline' | 'createdAt' | 'updatedAt' | 'status'>): ServiceRequest {
  const current = getRequests();
  const nextNum = 128 + current.length;
  const ticketNumber = `PALD-BINJAI-2026-${String(nextNum).padStart(5, '0')}`;
  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

  const item: ServiceRequest = {
    ...newReq,
    id: `req-${Date.now()}`,
    ticketNumber,
    status: 'received',
    timeline: [
      {
        status: 'received',
        label: 'Permohonan Diterima Sistem',
        timestamp: timeStr,
        note: 'Pendaftaran mandiri berhasil dibuat. Menunggu verifikasi petugas UPTD.',
        officer: 'Sistem SI-PALD',
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [item, ...current];
  saveRequests(updated);
  return item;
}

export function updateRequestStatus(
  id: string,
  newStatus: ServiceStatus,
  note: string,
  officerName: string,
  assignedTruckId?: string
): ServiceRequest | null {
  const list = getRequests();
  const index = list.findIndex(r => r.id === id);
  if (index === -1) return null;

  const req = list[index];
  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

  let statusLabel = '';
  switch (newStatus) {
    case 'verified':
      statusLabel = 'Verifikasi Administrasi & Lokasi';
      break;
    case 'scheduled':
      statusLabel = 'Penjadwalan Armada & Tim';
      break;
    case 'on_the_way':
      statusLabel = 'Petugas Menuju Lokasi';
      break;
    case 'in_progress':
      statusLabel = 'Penyedotan Tangki Sedang Berjalan';
      break;
    case 'completed':
      statusLabel = 'Layanan Selesai & Kartu Terbit';
      break;
    case 'cancelled':
      statusLabel = 'Permohonan Dibatalkan';
      break;
    default:
      statusLabel = 'Pembaruan Status';
  }

  let assignedTruck = req.assignedTruck;
  if (assignedTruckId) {
    const armadaList = getArmada();
    const truck = armadaList.find(t => t.id === assignedTruckId);
    if (truck) assignedTruck = truck;
  }

  let septicCard = req.septicCard;
  if (newStatus === 'completed' && !septicCard) {
    const randomCardId = `KSS-BINJAI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nextYear = now.getFullYear() + 2;
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    septicCard = {
      cardNumber: randomCardId,
      customerName: req.customerName,
      address: req.address,
      district: req.district,
      subDistrict: req.subDistrict,
      lastServiceDate: `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`,
      nextRecommendedDate: `${now.getDate()} ${months[now.getMonth()]} ${nextYear}`,
      tankVolumeM3: req.estimatedVolumeM3 || 3.0,
      condition: 'Standar SNI',
      officerName: officerName || 'Wira Syahputra Lubis & Tim UPTD',
      truckPlate: assignedTruck?.plateNumber || 'BK 8155 R',
    };
  }

  const updatedReq: ServiceRequest = {
    ...req,
    status: newStatus,
    assignedTruck,
    septicCard,
    timeline: [
      ...req.timeline,
      {
        status: newStatus,
        label: statusLabel,
        timestamp: timeStr,
        note: note || `Status diperbarui menjadi ${statusLabel}`,
        officer: officerName || 'Petugas UPTD',
      },
    ],
    updatedAt: new Date().toISOString(),
  };

  list[index] = updatedReq;
  saveRequests(list);
  return updatedReq;
}

export function createComplaint(newCmp: Omit<ComplaintItem, 'id' | 'ticketNumber' | 'status' | 'createdAt'>): ComplaintItem {
  const current = getComplaints();
  const nextNum = 43 + current.length;
  const ticketNumber = `ADUAN-2026-${String(nextNum).padStart(4, '0')}`;

  const item: ComplaintItem = {
    ...newCmp,
    id: `cmp-${Date.now()}`,
    ticketNumber,
    status: 'menunggu_verifikasi',
    createdAt: new Date().toISOString(),
  };

  const updated = [item, ...current];
  saveComplaints(updated);
  return item;
}

export function updateComplaintStatus(id: string, newStatus: ComplaintItem['status'], officialResponse: string): ComplaintItem | null {
  const current = getComplaints();
  const idx = current.findIndex(c => c.id === id);
  if (idx === -1) return null;

  const updatedItem: ComplaintItem = {
    ...current[idx],
    status: newStatus,
    officialResponse: officialResponse || current[idx].officialResponse,
    resolvedAt: newStatus === 'selesai' ? new Date().toISOString() : undefined,
  };

  current[idx] = updatedItem;
  saveComplaints(current);
  return updatedItem;
}

export function resetToDefaultData(): void {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(INITIAL_REQUESTS));
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(INITIAL_COMPLAINTS));
  localStorage.setItem(ARMADA_KEY, JSON.stringify(INITIAL_ARMADA));
}
