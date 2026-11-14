import type { Announcement } from '@/types/client/announcement.types';

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    slug: 'instruksi-konsolidasi-akbar-komisariat-se-malang-raya',
    title: 'Instruksi Pimpinan: Konsolidasi Akbar Komisariat Se-Malang Raya',
    excerpt: 'Menindaklanjuti agenda strategis perkaderan semester ganjil, seluruh pimpinan komisariat diinstruksikan hadir dalam agenda konsolidasi.',
    content: `
      <p>Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
      <p>Berdasarkan hasil Rapat Pleno BPH PC IMM Malang pada tanggal 2 November 2026, dengan ini Pimpinan Cabang Ikatan Mahasiswa Muhammadiyah Malang menginstruksikan kepada:</p>
      <ul>
        <li>Ketua Umum & Sekretaris Umum PK IMM se-Malang Raya</li>
        <li>Ketua Bidang Organisasi & Kader PK IMM se-Malang Raya</li>
      </ul>
      <p>Untuk menghadiri <strong>Konsolidasi Akbar dan Evaluasi Gerak Kader</strong> yang akan dilaksanakan pada:</p>
      <p><strong>Hari/Tanggal:</strong> Sabtu, 14 November 2026<br/><strong>Waktu:</strong> 08.30 WIB - Selesai<br/><strong>Tempat:</strong> Aula Gedung PDM Kota Malang</p>
      <p>Demikian instruksi ini disampaikan untuk dilaksanakan dengan penuh amanah dan tanggung jawab. <em>Billahi Fii Sabililhaq Fastabiqul Khairat.</em></p>
    `,
    category: 'instruksi',
    author: 'Pimpinan Cabang IMM Malang',
    authorRole: 'Sekretaris Umum',
    publishedAt: '2026-11-04T08:00:00Z',
    isPinned: true,
    attachments: [
      {
        name: 'Surat_Instruksi_Konsolidasi_082.pdf',
        url: '#',
        size: '420 KB',
      },
    ],
  },
  {
    id: 'ann-2',
    slug: 'pembukaan-pendaftaran-darul-arqam-madya-dam-2026',
    title: 'Pembukaan Pendaftaran Darul Arqam Madya (DAM) Nasional 2026',
    excerpt: 'Pimpinan Cabang IMM Malang membuka pendaftaran perkaderan tingkat madya bagi kader utama se-Indonesia dengan tema kepemimpinan profetik.',
    content: `
      <p>Bidang Kader PC IMM Malang resmi membuka pendaftaran <strong>Darul Arqam Madya (DAM) Tingkat Nasional</strong> tahun 2026.</p>
      <p>Perkaderan ini dirancang untuk mencetak kader intelektual profetik yang memiliki integritas keilmuan, kepemimpinan berwawasan kebangsaan, dan komitmen keagamaan yang kokoh.</p>
      <p><strong>Timeline Pendaftaran:</strong></p>
      <ol>
        <li>Pengumpulan Berkas & Esai: 1 - 20 November 2026</li>
        <li>Pengumuman Kelulusan Berkas: 25 November 2026</li>
        <li>Screening & Uji Gagasan: 28 - 29 November 2026</li>
        <li>Pelaksanaan Forum: 5 - 11 Desember 2026</li>
      </ol>
      <p>Unduh petunjuk teknis (Juknis) dan instrumen pendaftaran melalui lampiran di bawah.</p>
    `,
    category: 'edaran',
    author: 'Bidang Kaderisasi PC IMM Malang',
    authorRole: 'Ketua Bidang Kader',
    publishedAt: '2026-11-01T10:30:00Z',
    isPinned: true,
    attachments: [
      {
        name: 'Juknis_DAM_Nasional_PC_IMM_Malang_2026.pdf',
        url: '#',
        size: '1.8 MB',
      },
      {
        name: 'Formulir_Biodata_Peserta.docx',
        url: '#',
        size: '115 KB',
      },
    ],
  },
  {
    id: 'ann-3',
    slug: 'siaran-pers-respon-kebijakan-pendidikan-tinggi-dan-kesejahteraan-mahasiswa',
    title: 'Siaran Pers: Respon Kebijakan Pendidikan Tinggi & Subsidi UKT Mahasiswa',
    excerpt: 'PC IMM Malang mendesak transparansi penentuan golongan UKT serta penjaminan bantuan biaya kuliah bagi mahasiswa berlatar ekonomi rentan.',
    content: `
      <p>Pimpinan Cabang Ikatan Mahasiswa Muhammadiyah Malang melalui Bidang Hikmah, Politik, dan Kebijakan Publik mengeluarkan pernyataan sikap resmi terkait gejolak pembiayaan pendidikan tinggi di kawasan Malang Raya.</p>
      <p>Dalam telaah advokasi kami, lonjakan UKT dan pemangkasan kuota beasiswa berdampak langsung pada kelangsungan studi mahasiswa.</p>
      <p>IMM Malang menuntut: transparansi audit keuangan perguruan tinggi, pembukaan posko aduan mahasiswa, dan pelibatan lembaga mahasiswa dalam penentuan regulasi kampus.</p>
    `,
    category: 'siaran-pers',
    author: 'Bidang Hikmah & Kebijakan Publik',
    authorRole: 'Kabid Hikmah',
    publishedAt: '2026-10-28T14:15:00Z',
    isPinned: false,
  },
  {
    id: 'ann-4',
    slug: 'sukses-gelar-pelantikan-serentak-5-komisariat-kampus',
    title: 'Warta: Khidmat Pelantikan Serentak 5 Komisariat Se-Kawasan Dinoyo',
    excerpt: 'Sebanyak 5 pimpinan komisariat resmi dilantik untuk periode amanah baru, menandai regenerasi kepemimpinan berkelanjutan di basis kampus.',
    content: `
      <p>Bertempat di Aula Utama, pelantikan serentak berlangsung khidmat dengan dihadiri pimpinan cabang, alumni Fokal IMM, serta perwakilan ortom tingkat daerah.</p>
      <p>Ketua Umum PC IMM Malang menegaskan pentingnya penguatan basis gerakan di tingkat komisariat sebagai ujung tombak dakwah pencerahan.</p>
    `,
    category: 'berita',
    author: 'Lembaga Media & Komunikasi PC IMM',
    authorRole: 'Tim Redaksi',
    publishedAt: '2026-10-22T09:00:00Z',
    isPinned: false,
  },
];

