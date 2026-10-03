import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Phone, 
  Share2, 
  Edit3, 
  UserCheck, 
  Award, 
  ChevronDown, 
  X,
  FileSpreadsheet,
  Check,
  Send,
  MessageSquare,
  AlertTriangle,
  FileText,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { ServiceRequest, ServiceStatus, ComplaintItem, ArmadaTruck } from '../types/pald';
import { 
  getRequests, 
  updateRequestStatus, 
  getComplaints, 
  updateComplaintStatus, 
  getArmada, 
  saveArmada 
} from '../utils/storage';
import { getWhatsAppCitizenNoticeLink, getWhatsAppComplaintFollowUpNoticeLink } from '../utils/qrAndShare';
import { MonthlyReportModal } from './MonthlyReportModal';
import { AdminChartsSection } from './AdminChartsSection';

interface AdminDashboardProps {
  onOpenSepticCard: (req: ServiceRequest) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenSepticCard,
  onLogout,
}) => {
  const [requests, setRequests] = useState<ServiceRequest[]>(getRequests);
  const [complaints, setComplaints] = useState<ComplaintItem[]>(getComplaints);
  const [armadaList, setArmadaList] = useState<ArmadaTruck[]>(getArmada);

  const [activeTab, setActiveTab] = useState<'requests' | 'charts' | 'complaints' | 'armada' | 'report'>('requests');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMonthlyReportModalOpen, setIsMonthlyReportModalOpen] = useState<boolean>(false);
  const [autoSendWhatsApp, setAutoSendWhatsApp] = useState<boolean>(true);
  const [ticketNoticePrompt, setTicketNoticePrompt] = useState<{
    ticketNumber: string;
    customerName: string;
    phone: string;
    waUrl: string;
    statusLabel: string;
  } | null>(null);

  // Status edit modal
  const [selectedReqForEdit, setSelectedReqForEdit] = useState<ServiceRequest | null>(null);
  const [editStatus, setEditStatus] = useState<ServiceStatus>('verified');
  const [editOfficer, setEditOfficer] = useState('Mhd. Azmi Rusdi (Admin Pelayanan)');
  const [editNote, setEditNote] = useState('');
  const [editTruckId, setEditTruckId] = useState<string>('arm-1');

  // Complaint edit modal
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [complaintStatus, setComplaintStatus] = useState<ComplaintItem['status']>('dalam_tinjauan');
  const [complaintResponse, setComplaintResponse] = useState('');
  const [complaintOfficer, setComplaintOfficer] = useState('Mhd. Azmi Rusdi (Admin Pelayanan)');
  const [complaintFilterStatus, setComplaintFilterStatus] = useState<string>('all');
  const [complaintSearchQuery, setComplaintSearchQuery] = useState<string>('');
  const [followUpSuccessMsg, setFollowUpSuccessMsg] = useState<string | null>(null);

  // KPI Calculations
  const totalRequests = requests.length;
  const receivedCount = requests.filter(r => r.status === 'received').length;
  const scheduledCount = requests.filter(r => r.status === 'scheduled').length;
  const inProgressCount = requests.filter(r => r.status === 'on_the_way' || r.status === 'in_progress').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;
  const totalRevenue = requests.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.feeAmount, 0);

  // Complaints calculations
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'menunggu_verifikasi' || c.status === 'dalam_tinjauan').length;
  const dispatchedComplaints = complaints.filter(c => c.status === 'petugas_diluncurkan').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'selesai').length;

  // Filtered requests
  const filteredRequests = requests.filter(r => {
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchSearch = searchQuery === '' || 
      r.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subDistrict.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Filtered complaints
  const filteredComplaints = complaints.filter(c => {
    const matchStatus = complaintFilterStatus === 'all' || c.status === complaintFilterStatus;
    const matchSearch = complaintSearchQuery === '' ||
      c.ticketNumber.toLowerCase().includes(complaintSearchQuery.toLowerCase()) ||
      c.reporterName.toLowerCase().includes(complaintSearchQuery.toLowerCase()) ||
      c.phone.includes(complaintSearchQuery) ||
      c.district.toLowerCase().includes(complaintSearchQuery.toLowerCase()) ||
      c.subDistrict.toLowerCase().includes(complaintSearchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(complaintSearchQuery.toLowerCase()) ||
      (c.officialResponse && c.officialResponse.toLowerCase().includes(complaintSearchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const handleSaveStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForEdit) return;

    const updated = updateRequestStatus(
      selectedReqForEdit.id,
      editStatus,
      editNote,
      editOfficer,
      editTruckId
    );

    if (updated) {
      setRequests(getRequests());
      const waUrl = getWhatsAppCitizenNoticeLink(updated, editNote);

      if (autoSendWhatsApp) {
        window.open(waUrl, '_blank');
      }

      const statusLabels: Record<string, string> = {
        received: 'Permohonan Diterima',
        verified: 'Terverifikasi Berkas',
        scheduled: 'Dijadwalkan',
        on_the_way: 'Petugas Menuju Lokasi',
        in_progress: 'Penyedotan Berlangsung',
        completed: 'Layanan Selesai & Kartu Terbit',
        cancelled: 'Dibatalkan',
      };

      setTicketNoticePrompt({
        ticketNumber: updated.ticketNumber,
        customerName: updated.customerName,
        phone: updated.phone,
        waUrl,
        statusLabel: statusLabels[editStatus] || editStatus,
      });

      setSelectedReqForEdit(null);
      setEditNote('');
    }
  };

  const handleSaveComplaintResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    const fullResponse = complaintOfficer.trim()
      ? `[Ditindaklanjuti oleh: ${complaintOfficer.trim()}] ${complaintResponse}`
      : complaintResponse;

    const updated = updateComplaintStatus(
      selectedComplaint.id,
      complaintStatus,
      fullResponse
    );

    if (updated) {
      setComplaints(getComplaints());
      const ticketNum = selectedComplaint.ticketNumber;
      setSelectedComplaint(null);
      setComplaintResponse('');
      setFollowUpSuccessMsg(`✅ Pengaduan ${ticketNum} berhasil ditindaklanjuti! Status telah diperbarui.`);
      setTimeout(() => setFollowUpSuccessMsg(null), 6000);
    }
  };

  const handleQuickChangeComplaintStatus = (
    complaint: ComplaintItem, 
    newStatus: ComplaintItem['status'],
    customNote?: string
  ) => {
    let note = customNote;
    if (!note) {
      if (newStatus === 'dalam_tinjauan') {
        note = `[Ditindaklanjuti oleh: ${complaintOfficer}] Tim teknis UPTD PALD sedang melakukan peninjauan teknis ke lokasi aduan.`;
      } else if (newStatus === 'petugas_diluncurkan') {
        note = `[Ditindaklanjuti oleh: ${complaintOfficer}] Telah ditugaskan armada TRUK-01 (BK 8155 R) bersama driver Wira Syahputra Lubis dan tim untuk penanganan lapangan.`;
      } else if (newStatus === 'selesai') {
        note = `[Ditindaklanjuti oleh: ${complaintOfficer}] Pengaduan telah selesai ditindaklanjuti dan saluran/tangki septik telah dinormalisasi.`;
      } else {
        note = `[Ditindaklanjuti oleh: ${complaintOfficer}] Status aduan dicatat dalam antrean verifikasi UPTD.`;
      }
    }

    const updated = updateComplaintStatus(complaint.id, newStatus, note);
    if (updated) {
      setComplaints(getComplaints());
      const label = newStatus.replace(/_/g, ' ').toUpperCase();
      setFollowUpSuccessMsg(`✅ Status aduan ${complaint.ticketNumber} berhasil diubah ke "${label}"!`);
      setTimeout(() => setFollowUpSuccessMsg(null), 5000);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Nomor Tiket', 'Nama Pemohon', 'No HP', 'Kecamatan', 'Kelurahan', 'Jenis Layanan', 'Status', 'Retribusi', 'Tanggal'];
    const rows = requests.map(r => [
      r.ticketNumber,
      `"${r.customerName}"`,
      r.phone,
      r.district,
      r.subDistrict,
      r.serviceType,
      r.status,
      r.feeAmount,
      r.createdAt.split('T')[0]
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_pelayanan_pald_binjai_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Admin Top Header with breadcrumb and user profile */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Portal Administrator Terpadu UPTD PALD</span>
            <span aria-hidden="true">·</span>
            <span>Kota Binjai</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Dashboard Pelayanan & Manajemen Armada
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Monitoring penyedotan lumpur tinja domestik, verifikasi berkala L2T2, dan disposisi aduan warga.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-teal-200">
            <span className="bg-slate-800/90 px-2.5 py-1 rounded-md border border-slate-700">
              Admin: <strong className="text-white">Mhd. Azmi Rusdi</strong>
            </span>
            <span className="bg-slate-800/90 px-2.5 py-1 rounded-md border border-slate-700">
              Ka. TU: <strong className="text-white">Sri Yunita Rizal, SE</strong>
            </span>
            <span className="bg-slate-800/90 px-2.5 py-1 rounded-md border border-slate-700">
              Ka. UPTD: <strong className="text-white">Frans Armenda Ginting, ST, M.Si</strong>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => setIsMonthlyReportModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl flex items-center gap-1.5 transition-colors shadow-md ring-1 ring-teal-400/40"
          >
            <FileText className="w-4 h-4 text-teal-100" />
            Laporan Bulanan PDF (Formal)
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            CSV
          </button>

          <button
            onClick={() => setIsMonthlyReportModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            Cetak Rekap
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2 text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-950/40 rounded-xl border border-rose-900/50 transition-colors"
          >
            Keluar
          </button>
        </div>
      </div>

      {/* KPI Metrics Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Permohonan</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">{totalRequests}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Semua wilayah</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Permohonan Baru</div>
          <div className="text-2xl font-extrabold text-amber-700 font-mono tabular-nums mt-1">{receivedCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Perlu verifikasi</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Terjadwal & OTW</div>
          <div className="text-2xl font-extrabold text-blue-700 font-mono tabular-nums mt-1">{scheduledCount + inProgressCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">TRUK-01 beroperasi</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Layanan Selesai</div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums mt-1">{completedCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Kartu terbit</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Kas Retribusi</div>
          <div className="text-lg font-extrabold text-teal-800 font-mono tabular-nums mt-1">
            Rp {(totalRevenue / 1000).toLocaleString('id-ID')}k
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Perda Pemko</div>
        </div>

        <div className="bg-white border border-rose-200 p-4 rounded-xl shadow-xs cursor-pointer hover:bg-rose-50/50 transition-colors"
          onClick={() => setActiveTab('complaints')}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Pengaduan Warga</span>
            {pendingComplaints > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </div>
          <div className="text-2xl font-extrabold text-rose-700 font-mono tabular-nums mt-1">{totalComplaints}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-0.5">
            {pendingComplaints > 0 ? `${pendingComplaints} perlu tindak lanjut` : 'Semua telah ditindaklanjuti'}
          </div>
        </div>
      </div>

      {/* Follow-up Success Notification Banner */}
      {followUpSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{followUpSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setFollowUpSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* WhatsApp Automated Notice Banner Prompt */}
      {ticketNoticePrompt && (
        <div className="p-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-100 flex items-center gap-1.5">
                <span>Notifikasi Otomatis WhatsApp Terintegrasi</span>
                <span className="bg-emerald-500/40 text-[10px] px-2 py-0.5 rounded-full font-mono">
                  {ticketNoticePrompt.ticketNumber}
                </span>
              </div>
              <div className="text-xs text-white mt-0.5">
                Status berhasil diperbarui ke <strong>{ticketNoticePrompt.statusLabel}</strong>. Notifikasi resmi telah disiapkan untuk <strong>{ticketNoticePrompt.customerName}</strong> ({ticketNoticePrompt.phone}).
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={ticketNoticePrompt.waUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-white text-emerald-900 rounded-lg text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Kirim / Buka WhatsApp
            </a>
            <button
              onClick={() => setTicketNoticePrompt(null)}
              className="p-1.5 text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Tab Controls */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'requests'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Permohonan Penyedotan ({requests.length})
        </button>

        <button
          onClick={() => setActiveTab('charts')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'charts'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Statistik & Grafik Visual</span>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'complaints'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Pengaduan Mutu Pelayanan</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'complaints' 
              ? 'bg-white text-rose-800' 
              : pendingComplaints > 0 
              ? 'bg-rose-500 text-white' 
              : 'bg-slate-200 text-slate-700'
          }`}>
            {complaints.length}
          </span>
          {pendingComplaints > 0 && activeTab !== 'complaints' && (
            <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200">
              {pendingComplaints} baru
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('armada')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'armada'
              ? 'bg-teal-700 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Armada Truk & Petugas ({armadaList.length})
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'report'
              ? 'bg-teal-700 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Rekapitulasi Bulanan
        </button>
      </div>

      {/* TAB 1: Requests Management */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari No Tiket, Nama Warga, Kecamatan..."
                className="w-full text-xs outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="received">Permohonan Masuk</option>
                <option value="verified">Terverifikasi</option>
                <option value="scheduled">Dijadwalkan</option>
                <option value="on_the_way">Menuju Lokasi</option>
                <option value="in_progress">Sedang Disedot</option>
                <option value="completed">Selesai</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">No. Tiket</th>
                  <th className="py-3 px-4">Pemohon</th>
                  <th className="py-3 px-4">Wilayah</th>
                  <th className="py-3 px-4">Layanan</th>
                  <th className="py-3 px-4">Jadwal</th>
                  <th className="py-3 px-4">Armada</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => {
                  const waNotice = getWhatsAppCitizenNoticeLink(req);

                  let statusBadgeClass = 'bg-slate-100 text-slate-700';
                  if (req.status === 'received') statusBadgeClass = 'bg-amber-100 text-amber-800';
                  if (req.status === 'verified') statusBadgeClass = 'bg-blue-100 text-blue-800';
                  if (req.status === 'scheduled') statusBadgeClass = 'bg-indigo-100 text-indigo-800';
                  if (req.status === 'on_the_way' || req.status === 'in_progress') statusBadgeClass = 'bg-teal-100 text-teal-800';
                  if (req.status === 'completed') statusBadgeClass = 'bg-emerald-100 text-emerald-800';

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {req.ticketNumber}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{req.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{req.phone}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div>Kec. {req.district}</div>
                        <div className="text-[11px] text-slate-400">Kel. {req.subDistrict}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-800 uppercase">
                          {req.serviceType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div>{req.preferredDate}</div>
                        <div className="text-[11px] text-slate-400 uppercase">{req.preferredTimeSlot}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {req.assignedTruck ? (
                          <span className="font-mono text-teal-800 font-semibold">
                            {req.assignedTruck.code} ({req.assignedTruck.plateNumber})
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Belum di-assign</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${statusBadgeClass}`}>
                          {req.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedReqForEdit(req);
                              setEditStatus(req.status);
                              setEditTruckId(req.assignedTruck?.id || 'arm-1');
                            }}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                            title="Ubah Status & Tugaskan Armada"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <a
                            href={waNotice}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 hover:text-emerald-700 transition-colors"
                            title="Kirim Update ke WhatsApp Warga"
                          >
                            <Share2 className="w-4 h-4" />
                          </a>

                          {req.septicCard && (
                            <button
                              onClick={() => onOpenSepticCard(req)}
                              className="p-1.5 hover:bg-teal-50 rounded-lg text-teal-600 hover:text-teal-700 transition-colors"
                              title="Lihat Kartu Septik Sehat"
                            >
                              <Award className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB: Statistics & Visual Charts */}
      {activeTab === 'charts' && (
        <AdminChartsSection requests={requests} complaints={complaints} />
      )}

      {/* TAB 2: Complaints Management */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          
          {/* Header & Filter Controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Portal Tindak Lanjut Pengaduan Mutu Pelayanan Publik
                </h3>
                <p className="text-xs text-slate-500">
                  Tindak lanjut investigasi cepat aduan kualitas pelayanan, ketepatan waktu armada, etika petugas, dan transparansi tarif retribusi UPTD PALD Kota Binjai.
                </p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={complaintSearchQuery}
                  onChange={(e) => setComplaintSearchQuery(e.target.value)}
                  placeholder="Cari no. tiket, nama, lokasi..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Filter Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-100 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">Status:</span>
              <button
                onClick={() => setComplaintFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  complaintFilterStatus === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Semua ({totalComplaints})
              </button>
              <button
                onClick={() => setComplaintFilterStatus('menunggu_verifikasi')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                  complaintFilterStatus === 'menunggu_verifikasi'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                Menunggu Verifikasi ({complaints.filter(c => c.status === 'menunggu_verifikasi').length})
              </button>
              <button
                onClick={() => setComplaintFilterStatus('dalam_tinjauan')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                  complaintFilterStatus === 'dalam_tinjauan'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                Dalam Tinjauan ({complaints.filter(c => c.status === 'dalam_tinjauan').length})
              </button>
              <button
                onClick={() => setComplaintFilterStatus('petugas_diluncurkan')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                  complaintFilterStatus === 'petugas_diluncurkan'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200'
                }`}
              >
                Petugas Diluncurkan ({dispatchedComplaints})
              </button>
              <button
                onClick={() => setComplaintFilterStatus('selesai')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                  complaintFilterStatus === 'selesai'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                Selesai ({resolvedComplaints})
              </button>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">No. Tiket</th>
                  <th className="py-3 px-4">Pelapor</th>
                  <th className="py-3 px-4">Wilayah & Alamat</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Isi Aduan & Tindak Lanjut</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Tidak ada pengaduan yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c) => {
                    const statusBadgeClass = 
                      c.status === 'selesai' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      c.status === 'petugas_diluncurkan' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                      c.status === 'dalam_tinjauan' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                      'bg-amber-100 text-amber-800 border border-amber-300';

                    const cleanPhone = c.phone.replace(/[^0-9]/g, '');
                    const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.substring(1) : cleanPhone;

                    return (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap align-top">
                          <div className="text-rose-900">{c.ticketNumber}</div>
                          <div className="text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                            {c.createdAt.split('T')[0]}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap align-top">
                          <div className="font-semibold text-slate-900">{c.reporterName}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">{c.phone}</div>
                        </td>
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-medium text-slate-800">{c.district} · {c.subDistrict}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{c.address}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap align-top">
                          <span className="px-2 py-0.5 rounded-md font-medium text-[11px] bg-slate-100 text-slate-800 border border-slate-200 capitalize">
                            {c.category.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-sm align-top">
                          <div className="text-slate-700 leading-snug line-clamp-2">
                            {c.description}
                          </div>
                          {c.officialResponse && (
                            <div className="mt-1.5 p-1.5 bg-teal-50 border border-teal-200 rounded text-[11px] text-teal-900 leading-tight">
                              <span className="font-bold text-teal-800">Respon UPTD:</span> {c.officialResponse}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap align-top">
                          <div className="space-y-1.5">
                            {/* Inline quick status selector dropdown */}
                            <select
                              value={c.status}
                              onChange={(e) => handleQuickChangeComplaintStatus(c, e.target.value as any)}
                              className={`text-[11px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer block transition-colors ${statusBadgeClass}`}
                              title="Klik untuk ubah status secara instan"
                            >
                              <option value="menunggu_verifikasi">⏳ 1. Menunggu Verifikasi</option>
                              <option value="dalam_tinjauan">🔍 2. Dalam Tinjauan Teknis</option>
                              <option value="petugas_diluncurkan">🚛 3. Petugas Diluncurkan</option>
                              <option value="selesai">✅ 4. Selesai Teratasi</option>
                            </select>

                            {/* 1-Click Quick Action Pill */}
                            {c.status === 'menunggu_verifikasi' && (
                              <button
                                type="button"
                                onClick={() => handleQuickChangeComplaintStatus(c, 'dalam_tinjauan')}
                                className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md flex items-center gap-1 transition-colors"
                                title="Klik untuk langsung ubah status ke Dalam Tinjauan"
                              >
                                <span>🔍 Tinjau Aduan</span>
                              </button>
                            )}

                            {c.status === 'dalam_tinjauan' && (
                              <button
                                type="button"
                                onClick={() => handleQuickChangeComplaintStatus(c, 'petugas_diluncurkan')}
                                className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-md flex items-center gap-1 transition-colors"
                                title="Klik untuk langsung tugaskan TRUK-01 ke lokasi"
                              >
                                <span>🚛 Kirim TRUK-01</span>
                              </button>
                            )}

                            {c.status === 'petugas_diluncurkan' && (
                              <button
                                type="button"
                                onClick={() => handleQuickChangeComplaintStatus(c, 'selesai')}
                                className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-md flex items-center gap-1 transition-colors"
                                title="Klik untuk langsung tandai Selesai"
                              >
                                <span>✅ Tandai Selesai</span>
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap align-top">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedComplaint(c);
                                setComplaintStatus(c.status);
                                setComplaintResponse(c.officialResponse?.replace(/^\[Ditindaklanjuti oleh:.*?\]\s*/, '') || '');
                              }}
                              className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                              title="Buka Formulir Tindak Lanjut Lengkap"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Tindak Lanjuti
                            </button>

                            <a
                              href={`https://wa.me/${waPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-emerald-700 hover:bg-emerald-50 border border-emerald-300 rounded-lg transition-colors"
                              title="WhatsApp Pelapor"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Armada Truk */}
      {activeTab === 'armada' && (
        <div className="max-w-2xl mx-auto">
          {armadaList.map((truck) => (
            <div key={truck.id} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">Armada Operasional Tunggal</span>
                    <h4 className="text-lg font-bold text-slate-900">{truck.code} · Plat: <span className="font-mono text-teal-800">{truck.plateNumber}</span></h4>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                  truck.status === 'tersedia' ? 'bg-emerald-100 text-emerald-800' :
                  truck.status === 'bertugas' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {truck.status}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Kapasitas Tangki:</span>
                  <strong className="text-slate-900 font-mono text-sm">{truck.capacityM3} m³</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Driver Resmi:</span>
                  <strong className="text-slate-900">{truck.driverName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Nomor HP / WhatsApp Driver:</span>
                  <a href={`https://wa.me/62${truck.driverPhone.replace(/^0/, '')}`} target="_blank" rel="noreferrer" className="font-mono font-bold text-teal-700 hover:underline">
                    {truck.driverPhone}
                  </a>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-medium block mb-1.5">Kru Pembantu Lapangan (4 Petugas):</span>
                  <div className="grid grid-cols-2 gap-1.5 text-slate-800 font-medium text-xs">
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      <span>Fahrizal Ardiansyah</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      <span>Iwan Lubis</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      <span>Suparman</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      <span>Andi Ginting</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Wilayah Tugas Utama:</span>
                  <span className="text-teal-900 font-semibold text-right max-w-[65%]">{truck.currentDistrict}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <a
                  href={`tel:${truck.driverPhone}`}
                  className="flex-1 py-2 text-center text-xs font-semibold border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Telepon Driver
                </a>
                <a
                  href={`https://wa.me/62${truck.driverPhone.replace(/^0/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 text-center text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  WhatsApp Driver
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Monthly Report Overview */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {/* Action Hero for Official PDF Report */}
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-teal-800/40">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Dokumen Resmi Kedinasan Pemko Binjai</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Laporan Bulanan Realisasi Pelayanan PALD untuk Kepala UPTD
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Dokumen formal lengkap berkop surat Dinas PUTR Pemerintah Kota Binjai, memuat rekapitulasi rit per kecamatan, total kubikasi lumpur tinja ke IPLT, penerimaan retribusi daerah (PAD), serta pengesahan 3 pihak.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsMonthlyReportModalOpen(true)}
                className="px-5 py-2.5 text-xs font-bold bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl flex items-center gap-2 transition-all shadow-md hover:scale-[1.02]"
              >
                <Printer className="w-4 h-4" />
                Buka & Cetak PDF Laporan
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="text-center max-w-xl mx-auto space-y-1 border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Rekapitulasi Pelayanan Pengelolaan Air Limbah Domestik
              </h3>
              <p className="text-xs text-slate-500">
                UPTD PALD Dinas Pekerjaan Umum dan Penataan Ruang Kota Binjai · Periode Berjalan 2026
              </p>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Cakupan Wilayah Terbanyak</span>
              <strong className="text-base text-slate-900 block">Kecamatan Binjai Kota & Utara</strong>
              <span className="text-[11px] text-teal-700">Mencapai 48% total permohonan</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Rata-Rata Respon Tim</span>
              <strong className="text-base text-slate-900 block">1.8 Jam</strong>
              <span className="text-[11px] text-emerald-700">Sesuai SOP Pelayanan Publik</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Total Limbah Diolah ke IPLT</span>
              <strong className="text-base text-slate-900 block">± 42.5 m³</strong>
              <span className="text-[11px] text-teal-700">Diolah higienis menjadi pupuk</span>
            </div>
          </div>

          {/* Pengesahan Laporan Resmi */}
          <div className="pt-8 border-t border-slate-200 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs text-slate-700">
            <div className="space-y-1">
              <div className="text-[11px] text-slate-500">Petugas Administrator:</div>
              <div className="h-16 flex items-end justify-center">
                <div className="w-36 border-b border-slate-400" />
              </div>
              <div className="font-bold text-slate-900">MHD. AZMI RUSDI</div>
              <div className="text-[10px] text-slate-500">Admin Pelayanan SI-PALD</div>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-slate-500">Mengetahui, Ka. Subbag TU:</div>
              <div className="h-16 flex items-end justify-center">
                <div className="w-36 border-b border-slate-400" />
              </div>
              <div className="font-bold text-slate-900">SRI YUNITA RIZAL, SE</div>
              <div className="text-[10px] text-slate-500">Ka. Subbag Tata Usaha UPTD</div>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-slate-500">Menyetujui, Ka. UPTD PALD:</div>
              <div className="h-16 flex items-end justify-center">
                <div className="w-36 border-b border-slate-400" />
              </div>
              <div className="font-bold text-slate-900">FRANS ARMENDA GINTING, ST, M.Si</div>
              <div className="text-[10px] text-slate-500">Kepala UPTD PALD Kota Binjai</div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Status Update Modal */}
      {selectedReqForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase">Ubah Status Pelayanan</span>
                <h4 className="text-base font-bold text-slate-900 font-mono">
                  {selectedReqForEdit.ticketNumber}
                </h4>
              </div>
              <button
                onClick={() => setSelectedReqForEdit(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatusUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Status Baru
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => {
                    const newSt = e.target.value as ServiceStatus;
                    setEditStatus(newSt);
                    if (newSt === 'on_the_way' && !editNote) {
                      setEditNote('Armada TRUK-01 BK 8155 R (Driver: Wira Syahputra Lubis) telah bergerak menuju lokasi pemohon. Estimasi tiba ±15-30 menit.');
                    } else if (newSt === 'in_progress' && !editNote) {
                      setEditNote('Petugas sedang melakukan proses penyedotan dan pengurasan tangki septik.');
                    } else if (newSt === 'completed' && !editNote) {
                      setEditNote('Penyedotan selesai. Retribusi resmi telah diverifikasi dan e-Kartu Septik Sehat telah aktif.');
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none font-semibold text-slate-800"
                >
                  <option value="received">1. Permohonan Diterima</option>
                  <option value="verified">2. Verifikasi Administrasi & Lokasi</option>
                  <option value="scheduled">3. Dijadwalkan</option>
                  <option value="on_the_way">4. Petugas Menuju Lokasi (OTW)</option>
                  <option value="in_progress">5. Penyedotan Tangki Sedang Berjalan</option>
                  <option value="completed">6. Layanan Selesai & Terbitkan Kartu Septik</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>

              {/* Quick Template Status Buttons */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditStatus('on_the_way');
                    setEditNote('Armada TRUK-01 BK 8155 R (Driver: Wira Syahputra Lubis) telah bergerak menuju lokasi pemohon. Estimasi tiba ±15-30 menit.');
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                    editStatus === 'on_the_way'
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : 'bg-slate-100 hover:bg-purple-50 text-slate-700 border-slate-200'
                  }`}
                >
                  🚛 OTW Lokasi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditStatus('scheduled');
                    setEditNote('Permohonan telah dijadwalkan masuk dalam ritase operasional TRUK-01.');
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                    editStatus === 'scheduled'
                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                      : 'bg-slate-100 hover:bg-blue-50 text-slate-700 border-slate-200'
                  }`}
                >
                  📅 Jadwalkan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditStatus('completed');
                    setEditNote('Penyedotan selesai. Retribusi lunas dan lumpur dibawa ke IPLT Kota Binjai.');
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                    editStatus === 'completed'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 border-slate-200'
                  }`}
                >
                  ✅ Selesai Disedot
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tugaskan Armada Truk Vacuum
                </label>
                <select
                  value={editTruckId}
                  onChange={(e) => setEditTruckId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none"
                >
                  {armadaList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.code} ({t.plateNumber}) - Driver: {t.driverName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Progres Lapangan
                </label>
                <input
                  type="text"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Contoh: Tim sudah meluncur dari kantor UPTD."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Petugas Operator
                </label>
                <input
                  type="text"
                  value={editOfficer}
                  onChange={(e) => setEditOfficer(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              {/* Automated WhatsApp Notice Integration Checkbox */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-emerald-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSendWhatsApp}
                    onChange={(e) => setAutoSendWhatsApp(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>Kirim notifikasi otomatis via WhatsApp ke nomor HP pemohon</span>
                </label>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Sistem otomatis membuka notifikasi resmi WhatsApp ke <span className="font-mono font-bold text-emerald-950">{selectedReqForEdit.phone}</span> ({selectedReqForEdit.customerName}) memuat detail status terbaru dan identitas armada saat Anda menyimpan perubahan.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedReqForEdit(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Simpan & Kirim Notifikasi WA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Response / Follow-up Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                  Formulir Tindak Lanjut Pengaduan
                </span>
                <h4 className="text-base font-bold text-slate-900 font-mono">
                  {selectedComplaint.ticketNumber}
                </h4>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Complainant Details Summary Box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Pelapor:</span>
                  <strong className="text-slate-900">{selectedComplaint.reporterName}</strong> ({selectedComplaint.phone})
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Kategori:</span>
                  <span className="font-semibold text-rose-700 capitalize">{selectedComplaint.category.replace(/_/g, ' ')}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Alamat Lokasi:</span>
                <span className="text-slate-800">{selectedComplaint.address}, Kel. {selectedComplaint.subDistrict}, Kec. {selectedComplaint.district}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold text-rose-900">Isi Aduan Warga:</span>
                <p className="text-slate-800 italic mt-0.5 leading-relaxed bg-white p-2 rounded border border-slate-200">
                  "{selectedComplaint.description}"
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveComplaintResponse} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Pilih Status Tindak Lanjut Baru (Klik untuk Otomatisasi):
                </label>
                
                {/* 4 Interactive Visual Status Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setComplaintStatus('menunggu_verifikasi');
                      setComplaintResponse('Data aduan dicatat dan masuk dalam antrean verifikasi administrasi & jadwal peninjauan teknis UPTD PALD.');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      complaintStatus === 'menunggu_verifikasi'
                        ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-500/30 text-amber-950 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-amber-700 uppercase font-semibold">
                      <span>Tahap 1</span>
                      {complaintStatus === 'menunggu_verifikasi' && <Check className="w-3 h-3 text-amber-700" />}
                    </div>
                    <div className="text-xs mt-0.5">Verifikasi</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setComplaintStatus('dalam_tinjauan');
                      setComplaintResponse('Tim teknis UPTD PALD sedang melakukan verifikasi dan peninjauan langsung ke lokasi pengaduan bersama kepala lingkungan setempat.');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      complaintStatus === 'dalam_tinjauan'
                        ? 'border-blue-500 bg-blue-50/90 ring-2 ring-blue-500/30 text-blue-950 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-blue-700 uppercase font-semibold">
                      <span>Tahap 2</span>
                      {complaintStatus === 'dalam_tinjauan' && <Check className="w-3 h-3 text-blue-700" />}
                    </div>
                    <div className="text-xs mt-0.5">Tinjauan Tim</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setComplaintStatus('petugas_diluncurkan');
                      setComplaintResponse('Telah ditugaskan armada TRUK-01 (BK 8155 R) bersama driver Wira Syahputra Lubis dan kru untuk penanganan darurat di lokasi.');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      complaintStatus === 'petugas_diluncurkan'
                        ? 'border-purple-500 bg-purple-50/90 ring-2 ring-purple-500/30 text-purple-950 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-purple-700 uppercase font-semibold">
                      <span>Tahap 3</span>
                      {complaintStatus === 'petugas_diluncurkan' && <Check className="w-3 h-3 text-purple-700" />}
                    </div>
                    <div className="text-xs mt-0.5">Kirim TRUK-01</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setComplaintStatus('selesai');
                      setComplaintResponse('Penanganan telah selesai dilaksanakan oleh tim UPTD PALD Kota Binjai. Saluran limbah dan tangki septik telah dinormalisasi serta area telah bersih kembali.');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      complaintStatus === 'selesai'
                        ? 'border-emerald-500 bg-emerald-50/90 ring-2 ring-emerald-500/30 text-emerald-950 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-emerald-700 uppercase font-semibold">
                      <span>Tahap 4</span>
                      {complaintStatus === 'selesai' && <Check className="w-3 h-3 text-emerald-700" />}
                    </div>
                    <div className="text-xs mt-0.5">Selesai</div>
                  </button>
                </div>

                <select
                  value={complaintStatus}
                  onChange={(e) => setComplaintStatus(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-1 focus:ring-rose-500 font-medium text-xs text-slate-700"
                >
                  <option value="menunggu_verifikasi">1. Menunggu Verifikasi Dokumen & Lokasi</option>
                  <option value="dalam_tinjauan">2. Dalam Tinjauan Tim Teknis UPTD</option>
                  <option value="petugas_diluncurkan">3. Petugas & Armada TRUK-01 Diluncurkan ke Lokasi</option>
                  <option value="selesai">4. Selesai Ditindaklanjuti & Teratasi</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Petugas Penindak Lanjut (Disposisi)
                </label>
                <input
                  type="text"
                  required
                  value={complaintOfficer}
                  onChange={(e) => setComplaintOfficer(e.target.value)}
                  placeholder="Contoh: Mhd. Azmi Rusdi (Admin Pelayanan)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* Quick Template Response Buttons */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-semibold text-slate-700">
                    Tanggapan Resmi & Rencana / Hasil Tindakan Lapangan
                  </label>
                  <span className="text-[10px] text-slate-400">Template Cepat:</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => setComplaintResponse('Admin pelayanan UPTD PALD telah menghubungi pelapor via telepon/WA untuk mengklarifikasi kendala pelayanan dan mencatat kronologi laporan.')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-medium transition-colors"
                  >
                    📞 Klarifikasi Pelapor
                  </button>
                  <button
                    type="button"
                    onClick={() => setComplaintResponse('Telah diberikan instruksi langsung kepada armada TRUK-01 (Driver: Wira Syahputra Lubis) untuk penyesuaian jadwal dan perbaikan mutu layanan di lapangan.')}
                    className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded text-[10px] font-medium transition-colors"
                  >
                    🚛 Koordinasi Armada
                  </button>
                  <button
                    type="button"
                    onClick={() => setComplaintResponse('Pengaduan pelayanan telah tuntas diselesaikan. Standar operasional prosedur (SOP) dan konfirmasi kepuasan warga telah terpenuhi.')}
                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[10px] font-medium transition-colors"
                  >
                    ✅ Layanan Tuntas
                  </button>
                </div>

                <textarea
                  rows={3}
                  required
                  value={complaintResponse}
                  onChange={(e) => setComplaintResponse(e.target.value)}
                  placeholder="Tuliskan tindakan lapangan yang telah atau akan diambil untuk mengatasi pengaduan..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* WhatsApp Notification preview */}
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between gap-3">
                <div className="text-[11px] text-teal-900">
                  <strong className="block font-semibold">Beritahu Warga via WhatsApp?</strong>
                  Kirim ringkasan status tindak lanjut ini langsung ke nomor WhatsApp pelapor.
                </div>
                <a
                  href={getWhatsAppComplaintFollowUpNoticeLink(
                    selectedComplaint,
                    complaintStatus.replace(/_/g, ' '),
                    complaintResponse,
                    complaintOfficer
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1 shrink-0 transition-colors shadow-xs"
                >
                  <Phone className="w-3 h-3" />
                  Kirim WA Warga
                </a>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
                >
                  Simpan Tindak Lanjut
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formal Monthly Report Modal for Head of UPTD */}
      <MonthlyReportModal
        isOpen={isMonthlyReportModalOpen}
        onClose={() => setIsMonthlyReportModalOpen(false)}
        requests={requests}
      />

    </div>
  );
};
