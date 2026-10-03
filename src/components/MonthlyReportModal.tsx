import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Truck,
  ShieldCheck
} from 'lucide-react';
import { ServiceRequest } from '../types/pald';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: ServiceRequest[];
}

export const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
  isOpen,
  onClose,
  requests,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  if (!isOpen) return null;

  // Filter requests based on month selection if needed
  const filteredRequests = selectedMonth === 'all' 
    ? requests 
    : requests.filter(r => r.createdAt.includes(`-10-`)); // Sample October 2026

  // KPI aggregates
  const totalVolume = filteredRequests.reduce((sum, r) => sum + (r.estimatedVolumeM3 || 3.0), 0);
  const totalRevenue = filteredRequests
    .filter(r => r.status === 'completed' || r.paymentStatus !== 'pending')
    .reduce((sum, r) => sum + r.feeAmount, 0);
  const totalCompleted = filteredRequests.filter(r => r.status === 'completed').length;
  const totalScheduled = filteredRequests.filter(r => r.status === 'scheduled' || r.status === 'on_the_way' || r.status === 'in_progress').length;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['No', 'Nomor Tiket', 'Nama Pemohon', 'Kecamatan', 'Kelurahan', 'Alamat', 'Jenis Layanan', 'Volume (m3)', 'Retribusi (Rp)', 'Armada/Driver', 'Tanggal', 'Status'];
    const rows = filteredRequests.map((r, idx) => [
      idx + 1,
      r.ticketNumber,
      `"${r.customerName}"`,
      r.district,
      r.subDistrict,
      `"${r.address.replace(/"/g, '""')}"`,
      r.serviceType,
      r.estimatedVolumeM3 || 3.0,
      r.feeAmount,
      `"TRUK-01 (BK 8155 R) - Wira Syahputra Lubis"`,
      r.createdAt.split('T')[0],
      r.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan_resmi_pald_binjai_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Modal Toolbar (Hidden during print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div>
            <span className="text-[11px] font-semibold text-teal-300 uppercase tracking-wider block">
              Format Laporan Resmi Kedinasan
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Laporan Realisasi Pelayanan PALD untuk Kepala UPTD
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              CSV
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Simpan PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white text-slate-900" id="printable-report">
          
          {/* KOP SURAT PEMERINTAH KOTA BINJAI */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
                <Building2 className="w-8 h-8 text-slate-800" />
              </div>
              <div className="text-center flex-1">
                <div className="text-xs sm:text-sm font-bold tracking-wider text-slate-700 uppercase">
                  Pemerintah Kota Binjai · Dinas Pekerjaan Umum dan Penataan Ruang
                </div>
                <h1 className="text-base sm:text-xl font-extrabold text-slate-950 uppercase tracking-tight mt-0.5">
                  UPTD Pengelolaan Air Limbah Domestik (PALD)
                </h1>
                <p className="text-[11px] text-slate-600 mt-1">
                  Jl. Jenderal Gatot Subroto No. 45, Kel. Bandar Senembah, Kota Binjai, Sumatera Utara 20719
                </p>
                <p className="text-[10px] text-slate-500">
                  Layanan Telepon/Hotline: 0813-7344-470 · Email: pald@binjaikota.go.id · Portal: pald.binjaikota.go.id
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-8 h-8 text-teal-800" />
              </div>
            </div>
            <div className="w-full h-0.5 bg-slate-900 mt-3" />
            <div className="w-full h-px bg-slate-900 mt-0.5" />
          </div>

          {/* JUDUL LAPORAN & NOMOR SURAT */}
          <div className="text-center mb-6 space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase underline decoration-2 underline-offset-4">
              LAPORAN BULANAN REALISASI PELAYANAN PENGELOLAAN AIR LIMBAH DOMESTIK
            </h2>
            <div className="text-xs font-mono text-slate-700">
              Nomor: 050/UPTD-PALD/B-LAP/X/2026
            </div>
            <div className="text-xs font-semibold text-slate-600">
              Periode Pelaksanaan: Bulan Oktober 2026 (Tahun Anggaran 2026)
            </div>
          </div>

          {/* RINGKASAN EKSEKUTIF / KPI REKAPITULASI */}
          <div className="mb-6 space-y-2">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              I. Ringkasan Kinerja & Capaian Pelayanan
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Total Permohonan:</span>
                <strong className="text-base text-slate-900 font-mono">{filteredRequests.length} Rit</strong>
                <span className="text-[10px] text-teal-700 block mt-0.5">5 Kecamatan se-Kota Binjai</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Volume Lumpur Diolah:</span>
                <strong className="text-base text-slate-900 font-mono">± {totalVolume.toFixed(1)} m³</strong>
                <span className="text-[10px] text-emerald-700 block mt-0.5">Diterima di IPLT Binjai</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Realisasi Retribusi (PAD):</span>
                <strong className="text-base text-teal-900 font-mono">Rp {totalRevenue.toLocaleString('id-ID')}</strong>
                <span className="text-[10px] text-slate-500 block mt-0.5">Sesuai Perda Tarif Resmi</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Armada Operasional:</span>
                <strong className="text-base text-slate-900 font-mono">TRUK-01</strong>
                <span className="text-[10px] text-slate-700 block mt-0.5">BK 8155 R (Wira Syahputra L.)</span>
              </div>
            </div>
          </div>

          {/* TABEL DATA DETAIL RIWAYAT PENYEDOTAN */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                II. Rincian Data Riwayat Pelayanan Penyedotan Tangki Septik
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Jumlah Data: {filteredRequests.length} Transaksi
              </span>
            </div>

            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-2 text-center w-8">No</th>
                    <th className="py-2.5 px-3">No. Tiket</th>
                    <th className="py-2.5 px-3">Nama Pemohon</th>
                    <th className="py-2.5 px-3">Wilayah / Alamat</th>
                    <th className="py-2.5 px-2">Layanan</th>
                    <th className="py-2.5 px-2 text-center">Vol (m³)</th>
                    <th className="py-2.5 px-3 text-right">Retribusi</th>
                    <th className="py-2.5 px-3 text-center">Tanggal</th>
                    <th className="py-2.5 px-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRequests.map((req, idx) => (
                    <tr key={req.id} className="hover:bg-slate-50">
                      <td className="py-2 px-2 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {req.ticketNumber}
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-semibold text-slate-900">{req.customerName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{req.phone}</div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-medium text-slate-800">{req.district} · {req.subDistrict}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{req.address}</div>
                      </td>
                      <td className="py-2 px-2 whitespace-nowrap">
                        <span className="font-mono uppercase text-[10px]">
                          {req.serviceType === 'l2t2_berkala' ? 'L2T2 Berkala' : 'L2TT Reguler'}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center font-mono">
                        {req.estimatedVolumeM3 || 3.0}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">
                        Rp {req.feeAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-slate-600 whitespace-nowrap">
                        {req.createdAt.split('T')[0]}
                      </td>
                      <td className="py-2 px-2 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          req.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'on_the_way' || req.status === 'in_progress' ? 'bg-teal-100 text-teal-800' :
                          req.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-bold border-t border-slate-300 text-slate-900 text-xs">
                  <tr>
                    <td colSpan={5} className="py-2.5 px-3 text-right">TOTAL REALISASI:</td>
                    <td className="py-2.5 px-2 text-center font-mono">{totalVolume.toFixed(1)} m³</td>
                    <td className="py-2.5 px-3 text-right font-mono text-teal-900">Rp {totalRevenue.toLocaleString('id-ID')}</td>
                    <td colSpan={2} className="py-2.5 px-3 text-center text-[10px] text-slate-600 font-normal">
                      {totalCompleted} Layanan Selesai
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* CATATAN TEKNIS & EVALUASI OPERASIONAL */}
          <div className="mb-8 p-3.5 bg-slate-50 border border-slate-300 rounded-lg text-xs space-y-1">
            <span className="font-bold text-slate-900 block">III. Catatan Evaluasi Teknis Operasional:</span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 leading-relaxed text-[11px]">
              <li>Seluruh lumpur tinja terangkut telah dibuang dan diproses secara higienis di Instalasi Pengolahan Lumpur Tinja (IPLT) Kota Binjai.</li>
              <li>Armada vacuum suction tunggal TRUK-01 (BK 8155 R) beroperasi prima dengan dukungan 4 kru pembantu lapangan.</li>
              <li>Penerbitan e-Kartu Septik Sehat digital berjalan 100% untuk permohonan yang telah selesai dilaksanakan.</li>
            </ul>
          </div>

          {/* KOLOM PENGESAHAN TANDA TANGAN FORMAL 3 PIHAK */}
          <div className="pt-4 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs text-slate-800">
            <div className="space-y-1">
              <div className="text-[11px] text-slate-600">Dibuat oleh,</div>
              <div className="text-[11px] font-medium text-slate-700">Petugas Administrator SI-PALD:</div>
              <div className="h-20 flex items-end justify-center">
                <div className="w-36 border-b border-slate-800" />
              </div>
              <div className="font-bold text-slate-950 uppercase tracking-wide">MHD. AZMI RUSDI</div>
              <div className="text-[10px] text-slate-500 font-mono">Staf Pelayanan UPTD PALD</div>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-slate-600">Diperiksa oleh,</div>
              <div className="text-[11px] font-medium text-slate-700">Ka. Subbag Tata Usaha:</div>
              <div className="h-20 flex items-end justify-center">
                <div className="w-36 border-b border-slate-800" />
              </div>
              <div className="font-bold text-slate-950 uppercase tracking-wide">SRI YUNITA RIZAL, SE</div>
              <div className="text-[10px] text-slate-500 font-mono">NIP. Pelaksana Administrasi</div>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-slate-600">Mengetahui & Menyetujui,</div>
              <div className="text-[11px] font-medium text-slate-700">Kepala UPTD PALD Kota Binjai:</div>
              <div className="h-20 flex items-end justify-center">
                <div className="w-36 border-b border-slate-800" />
              </div>
              <div className="font-bold text-slate-950 uppercase tracking-wide">FRANS ARMENDA GINTING, ST, M.Si</div>
              <div className="text-[10px] text-slate-500 font-mono">Kepala UPTD Dinas PUTR</div>
            </div>
          </div>

          <div className="mt-8 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-400">
            Dokumen resmi ini dicetak secara digital melalui Sistem Informasi Pengelolaan Air Limbah Domestik (SI-PALD) Pemerintah Kota Binjai pada {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
          </div>

        </div>

      </div>
    </div>
  );
};
