import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  MapPin, 
  Truck, 
  Award, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { ServiceRequest, ComplaintItem } from '../types/pald';

interface AdminChartsSectionProps {
  requests: ServiceRequest[];
  complaints: ComplaintItem[];
}

export const AdminChartsSection: React.FC<AdminChartsSectionProps> = ({
  requests,
  complaints,
}) => {
  const [periodFilter, setPeriodFilter] = useState<'all' | 'october'>('all');

  // Districts calculation
  const districtCounts: Record<string, { count: number; volume: number; revenue: number }> = {
    'Binjai Kota': { count: 0, volume: 0, revenue: 0 },
    'Binjai Utara': { count: 0, volume: 0, revenue: 0 },
    'Binjai Barat': { count: 0, volume: 0, revenue: 0 },
    'Binjai Timur': { count: 0, volume: 0, revenue: 0 },
    'Binjai Selatan': { count: 0, volume: 0, revenue: 0 },
  };

  requests.forEach(r => {
    if (districtCounts[r.district]) {
      districtCounts[r.district].count += 1;
      districtCounts[r.district].volume += (r.estimatedVolumeM3 || 3.0);
      if (r.status === 'completed' || r.paymentStatus !== 'pending') {
        districtCounts[r.district].revenue += r.feeAmount;
      }
    }
  });

  const maxDistrictCount = Math.max(...Object.values(districtCounts).map(d => d.count), 1);

  // Status breakdown
  const statusCounts = {
    received: requests.filter(r => r.status === 'received').length,
    verified: requests.filter(r => r.status === 'verified').length,
    scheduled: requests.filter(r => r.status === 'scheduled').length,
    on_the_way: requests.filter(r => r.status === 'on_the_way').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  // Service types breakdown
  const serviceTypeCounts = {
    l2t2_berkala: requests.filter(r => r.serviceType === 'l2t2_berkala').length,
    l2tt_reguler: requests.filter(r => r.serviceType === 'l2tt_reguler').length,
    rumah_ibadah: requests.filter(r => r.serviceType === 'rumah_ibadah').length,
    komersial_kantor: requests.filter(r => r.serviceType === 'komersial_kantor').length,
  };

  const totalReq = requests.length || 1;
  const totalCompleted = statusCounts.completed;
  const completionRate = Math.round((totalCompleted / totalReq) * 100);

  // Complaints metrics
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'selesai').length;
  const complaintResolutionRate = totalComplaints ? Math.round((resolvedComplaints / totalComplaints) * 100) : 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
      
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-0.5">
            <BarChart3 className="w-4 h-4" />
            <span>Statistik & Analisis Visual Layanan PALD Kota Binjai</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Grafik Kinerja Pelayanan, Sebaran Wilayah & Retribusi Daerah
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setPeriodFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              periodFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Data (2026)
          </button>
          <button
            onClick={() => setPeriodFilter('october')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              periodFilter === 'october'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bulan Oktober 2026
          </button>
        </div>
      </div>

      {/* Grid 1: Bar Chart Sebaran Wilayah + Status Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Sebaran Permohonan per Kecamatan (Vertical/Horizontal Visual Bars) */}
        <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                1. Grafik Sebaran Permohonan per Kecamatan
              </span>
              <span className="text-[11px] text-slate-500">
                5 Kecamatan administratif di Kota Binjai
              </span>
            </div>
            <div className="p-1.5 bg-teal-100 text-teal-800 rounded-lg">
              <MapPin className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(districtCounts).map(([distName, data]) => {
              const pct = Math.round((data.count / maxDistrictCount) * 100);
              const share = Math.round((data.count / totalReq) * 100);

              return (
                <div key={distName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{distName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">±{data.volume.toFixed(1)} m³</span>
                      <strong className="text-slate-900 font-mono">{data.count} Rit</strong>
                      <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 font-semibold">
                        {share}%
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-slate-200/80 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-teal-600 to-teal-500 h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
            <span>Kecamatan dominan: <strong>Binjai Kota & Utara</strong></span>
            <span>Total Ritase: <strong className="text-slate-900 font-mono">{requests.length} Rit</strong></span>
          </div>
        </div>

        {/* CHART 2: Pipeline Distribusi Tahapan Status Layanan */}
        <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                2. Grafik Distribusi Status Progres Layanan
              </span>
              <span className="text-[11px] text-slate-500">
                Tahapan alur operasional permohonan warga
              </span>
            </div>
            <div className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            
            {/* Status 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-amber-800 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Permohonan Baru (Menunggu Verifikasi)
                </span>
                <span className="font-mono font-bold text-amber-900">{statusCounts.received} Tiket</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${(statusCounts.received / totalReq) * 100}%` }}
                />
              </div>
            </div>

            {/* Status 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-blue-800 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Terjadwal & Armada TRUK-01 Siap
                </span>
                <span className="font-mono font-bold text-blue-900">{statusCounts.scheduled} Tiket</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${(statusCounts.scheduled / totalReq) * 100}%` }}
                />
              </div>
            </div>

            {/* Status 3 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-purple-800 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Petugas Menuju Lokasi (OTW)
                </span>
                <span className="font-mono font-bold text-purple-900">{statusCounts.on_the_way} Tiket</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${(statusCounts.on_the_way / totalReq) * 100}%` }}
                />
              </div>
            </div>

            {/* Status 4 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-teal-800 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  Penyedotan Tangki Berlangsung
                </span>
                <span className="font-mono font-bold text-teal-900">{statusCounts.in_progress} Tiket</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-teal-500 h-full rounded-full transition-all"
                  style={{ width: `${(statusCounts.in_progress / totalReq) * 100}%` }}
                />
              </div>
            </div>

            {/* Status 5 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Selesai & e-Kartu Septik Terbit
                </span>
                <span className="font-mono font-bold text-emerald-900">{statusCounts.completed} Tiket</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${(statusCounts.completed / totalReq) * 100}%` }}
                />
              </div>
            </div>

          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-600">Tingkat Penyelesaian Layanan:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono">
              {completionRate}% Selesai
            </span>
          </div>
        </div>

      </div>

      {/* Grid 2: Segmentasi Jenis Layanan & Kinerja Pelayanan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
        
        {/* Segmentasi Jenis Layanan */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <span className="font-bold text-slate-900 block text-xs">
            3. Segmentasi Jenis Program Layanan
          </span>
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">L2T2 Terjadwal Berkala:</span>
              <strong className="text-teal-900 font-mono">{serviceTypeCounts.l2t2_berkala} ({Math.round((serviceTypeCounts.l2t2_berkala / totalReq) * 100)}%)</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">L2TT Reguler (On-Call):</span>
              <strong className="text-slate-900 font-mono">{serviceTypeCounts.l2tt_reguler} ({Math.round((serviceTypeCounts.l2tt_reguler / totalReq) * 100)}%)</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Rumah Ibadah (Tarif Sosial):</span>
              <strong className="text-emerald-900 font-mono">{serviceTypeCounts.rumah_ibadah} ({Math.round((serviceTypeCounts.rumah_ibadah / totalReq) * 100)}%)</strong>
            </div>
          </div>
        </div>

        {/* Efisiensi Armada TRUK-01 */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <span className="font-bold text-slate-900 block text-xs">
            4. Kinerja Operasional Armada TRUK-01
          </span>
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Armada Aktif:</span>
              <strong className="text-slate-900 font-mono">1 Truk (BK 8155 R)</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Driver & Kru:</span>
              <span className="text-slate-800 font-semibold">Wira Syahputra L. + 4 Kru</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Rata-Rata Waktu Tiba:</span>
              <span className="text-emerald-700 font-bold font-mono">18.5 Menit</span>
            </div>
          </div>
        </div>

        {/* Tingkat Respon Pengaduan Pelayanan */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <span className="font-bold text-slate-900 block text-xs">
            5. SLA & Mutu Pengaduan Pelayanan
          </span>
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total Pengaduan Pelayanan:</span>
              <strong className="text-slate-900 font-mono">{totalComplaints} Kasus</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Telah Ditindaklanjuti:</span>
              <strong className="text-emerald-700 font-mono">{resolvedComplaints} Selesai</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Tingkat Penyelesaian (SLA):</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">
                {complaintResolutionRate}%
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
