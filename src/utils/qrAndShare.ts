import { ServiceRequest, ComplaintItem } from '../types/pald';

export function getWhatsAppBookingLink(req: ServiceRequest): string {
  const text = `*LAYANAN UPTD PALD KOTA BINJAI*\n` +
    `Halo Admin UPTD PALD Kota Binjai, saya ingin mengonfirmasi permohonan penyedotan tangki septik:\n\n` +
    `📌 *No. Tiket:* ${req.ticketNumber}\n` +
    `👤 *Nama Pemohon:* ${req.customerName}\n` +
    `📍 *Alamat:* ${req.address}, Kel. ${req.subDistrict}, Kec. ${req.district}\n` +
    `🚛 *Jenis Layanan:* ${req.serviceType.toUpperCase()}\n` +
    `📅 *Jadwal Pilihan:* ${req.preferredDate} (${req.preferredTimeSlot.toUpperCase()})\n` +
    `💰 *Estimasi Retribusi:* Rp ${req.feeAmount.toLocaleString('id-ID')}\n\n` +
    `Mohon info tindak lanjut dan jadwal kedatangan armada. Terima kasih!`;

  return `https://wa.me/628137344470?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppCitizenNoticeLink(req: ServiceRequest, customNote?: string): string {
  // Format clean phone number to 62...
  let phone = req.phone.replace(/[^0-9]/g, '');
  if (phone.startsWith('0')) {
    phone = '62' + phone.substring(1);
  }

  const latestTimeline = req.timeline[req.timeline.length - 1];
  const statusLabel = latestTimeline?.label || req.status;
  const note = customNote || latestTimeline?.note || '-';

  let specificDetails = '';
  if (req.status === 'on_the_way') {
    specificDetails = 
      `\n🚛 *Armada Pelaksana:* TRUK-01 (Plat: BK 8155 R)\n` +
      `👤 *Driver:* Wira Syahputra Lubis (082169642019)\n` +
      `👥 *Kru Lapangan:* Fahrizal Ardiansyah, Iwan Lubis, Suparman, Andi Ginting\n` +
      `⏱️ *Estimasi Kedatangan:* ±15 - 30 Menit\n` +
      `⚠️ *Penting:* Mohon pastikan jalur pagar rumah terbuka dan area penutup tangki septik dapat dijangkau armada.`;
  } else if (req.status === 'scheduled') {
    specificDetails = 
      `\n📅 *Jadwal Kedatangan:* ${req.preferredDate} (Sesi: ${req.preferredTimeSlot.toUpperCase()})\n` +
      `🚛 *Armada Ditugaskan:* TRUK-01 (BK 8155 R)\n` +
      `💰 *Tarif Retribusi Resmi:* Rp ${req.feeAmount.toLocaleString('id-ID')}`;
  } else if (req.status === 'in_progress') {
    specificDetails = 
      `\n⚙️ Tim operasional UPTD saat ini sedang melakukan penyedotan & pembersihan tangki septik di lokasi Anda.\n` +
      `🚛 *Armada:* TRUK-01 (BK 8155 R)`;
  } else if (req.status === 'completed') {
    specificDetails = 
      `\n✅ Pekerjaan penyedotan tangki septik telah selesai dilaksanakan.\n` +
      `💰 *Status Retribusi:* LUNAS (Kas Daerah Pemko Binjai)\n` +
      `🏅 *e-Kartu Septik Sehat:* Telah diterbitkan secara digital pada portal SI-PALD.\n` +
      `Lumpur tinja diolah higienis dan terstandar di IPLT Kota Binjai.`;
  }

  const text = `*UPTD PALD KOTA BINJAI - PEMBERITAHUAN PELAYANAN*\n` +
    `Yth. Bpk/Ibu *${req.customerName}*,\n\n` +
    `Pemberitahuan pembaruan status layanan penyedotan tangki septik Anda:\n` +
    `📌 *No. Tiket:* ${req.ticketNumber}\n` +
    `⚡ *Status Terbaru:* ${statusLabel.toUpperCase()}\n` +
    `📍 *Lokasi:* ${req.address}, Kel. ${req.subDistrict}, Kec. ${req.district}\n` +
    `📝 *Catatan Petugas:* ${note}` +
    `${specificDetails}\n\n` +
    `Lacak posisi & jadwal lengkap di portal resmi: *SI-PALD KOTA BINJAI*\n` +
    `_Dinas Pekerjaan Umum dan Penataan Ruang Pemerintah Kota Binjai_`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppComplaintLink(cmp: ComplaintItem): string {
  const text = `*PENGADUAN PELAYANAN UPTD PALD KOTA BINJAI*\n` +
    `Halo Petugas UPTD PALD Binjai, saya ingin menyampaikan laporan pengaduan mutu pelayanan:\n\n` +
    `📌 *No. Aduan:* ${cmp.ticketNumber}\n` +
    `👤 *Pelapor:* ${cmp.reporterName} (${cmp.phone})\n` +
    `📍 *Lokasi:* ${cmp.address}, Kel. ${cmp.subDistrict}, Kec. ${cmp.district}\n` +
    `⚠️ *Kategori Pelayanan:* ${cmp.category.replace(/_/g, ' ').toUpperCase()}\n` +
    `📝 *Uraian Kendala Pelayanan:* ${cmp.description}\n\n` +
    `Mohon evaluasi dan tindak lanjut dari UPTD PALD Dinas PUTR Kota Binjai. Terima kasih.`;

  return `https://wa.me/628137344470?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppComplaintFollowUpNoticeLink(
  cmp: ComplaintItem, 
  statusLabel: string, 
  responseNote: string, 
  officerName: string
): string {
  let phone = cmp.phone.replace(/[^0-9]/g, '');
  if (phone.startsWith('0')) {
    phone = '62' + phone.substring(1);
  }

  const text = `*UPTD PALD KOTA BINJAI - TINDAK LANJUT PENGADUAN*\n` +
    `Yth. Bpk/Ibu *${cmp.reporterName}*,\n\n` +
    `Menindaklanjuti laporan pengaduan sanitasi Anda:\n` +
    `📌 *No. Tiket Aduan:* ${cmp.ticketNumber}\n` +
    `📍 *Lokasi:* ${cmp.address}, Kel. ${cmp.subDistrict}, Kec. ${cmp.district}\n` +
    `⚡ *Status Tindak Lanjut:* ${statusLabel.toUpperCase()}\n\n` +
    `📝 *Tanggapan Resmi UPTD:*\n` +
    `"${responseNote || 'Laporan telah diterima dan masuk dalam agenda penanganan teknis UPTD PALD.'}"\n\n` +
    `👤 *Petugas Disposisi:* ${officerName || 'Mhd. Azmi Rusdi (Admin Pelayanan)'}\n` +
    `🏛️ *UPTD PALD Dinas PUTR Pemerintah Kota Binjai*\n` +
    `Hotline WhatsApp: 0813-7344-470`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
