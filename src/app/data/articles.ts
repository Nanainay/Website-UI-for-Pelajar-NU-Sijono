// Article data types and complete dummy data

export interface ArticleSection {
  tujuan: string;
  materi: string;
  kesan: string;
  penutup: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  createdAt: string;
  imageUrl: string;
  gallery: string[];
  sections: ArticleSection;
}

export interface ArticleFormData {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageFile: File | null;
  imagePreview: string;
  galleryFiles: File[];
  galleryPreviews: string[];
  sections: ArticleSection;
}

export const initialFormData: ArticleFormData = {
  title: "",
  slug: "",
  category: "kegiatan",
  excerpt: "",
  content: "",
  author: "",
  date: "",
  imageFile: null,
  imagePreview: "",
  galleryFiles: [],
  galleryPreviews: [],
  sections: {
    tujuan: "",
    materi: "",
    kesan: "",
    penutup: "",
  },
};

// Helper function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Complete dummy data for articles
export const dummyArticles: Article[] = [
  {
    id: 1,
    title: "Pelatihan Kepemimpinan Angkatan X IPNU IPPNU Sijono",
    slug: "pelatihan-kepemimpinan-angkatan-x",
    category: "kegiatan",
    excerpt: "Pelatihan intensif untuk membentuk karakter dan kemampuan pemimpin pelajar NU.",
    content: "IPNU IPPNU Desa Sijono telah berhasil menyelenggarakan Pelatihan Kepemimpinan Angkatan X yang berlangsung selama 3 hari, dari tanggal 10-12 April 2026. Kegiatan ini diikuti oleh 50 peserta yang merupakan kader muda dari IPNU dan IPPNU.\n\nDalam pelatihan ini, para peserta diberikan berbagai materi kepemimpinan yang sangat bermanfaat untuk pengembangan soft skill dan persiapan menjadi pemimpin masa depan.",
    author: "Admin IPNU IPPNU",
    date: "2026-04-12",
    createdAt: "2026-04-12T10:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1545886082-e66c6b9e011a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1599717462650-02831c496816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1629273229214-d96be4552b9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1774060888176-cd6354047851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    ],
    sections: {
      tujuan: "Pelatihan ini bertujuan untuk mengembangkan kemampuan kepemimpinan para kader muda, meningkatkan soft skill, serta mempersiapkan mereka menjadi pemimpin yang tangguh dan berintegritas.",
      materi: "Peserta mendapatkan berbagai materi yang sangatbermanfaat, antara lain: Leadership dan Team Building oleh Dr. Ahmad Fauzi, Public Speaking dan Komunikasi Efektif oleh Ustadz Mahfud Imran, Manajemen Organisasi oleh Ibu Siti Nurhaliza.",
      kesan: '"Alhambra, pelatihan ini sangatbermanfaat. Saya mendapatkan banyak ilmu baru tentang kepemimpinan yang akan saya terapkan di organisasi." - Ahmad Rizki, Peserta',
      penutup: "Pelatihan Kepemimpinan Angkatan X ditutup dengan pemberian sertifikat kepada seluruh peserta dan deklarasi komitmen untuk menjadi pemimpin yang amanah."
    }
  },
  {
    id: 2,
    title: "Kajian Rutin Bulanan: Memahami Fiqih Kontemporer",
    slug: "kajian-rutin-fiqih-kontemporer",
    category: "kajian",
    excerpt: "Kajian rutin kali ini Erwin Ust. Dr. Ahmad Mahmudi membahas fiqih kontemporer.",
    content: "Kajian rutin bulanan kali ini diselenggarakan di Masjid Nurul Huda dengan pembahasan yang sangat mendalam tentang hukum-hukum Islam kontemporer.",
    author: "Ustadz Mahmud",
    date: "2026-04-08",
    createdAt: "2026-04-08T14:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1629273229214-d96be4552b9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1599717462650-02831c496816?w=400",
      "https://images.unsplash.com/photo-1629273229214-d96be4552b9a?w=400"
    ],
    sections: {
      tujuan: "Meningkatkan pemahaman fiqih kontemporer yang relevan dengan kehidupan pelajar modern.",
      materi: "Pembahasan mengenai hukum-hukum fiqih kontemporer seperti riba, jihad, dan akhlak yang relevan dengan kehidupan masa kini.",
      kesan: '"Kajian ini sangat menambah wawasan kita tentang hukum Islam yang aktual." - Siti Aminah',
      penutup: "Kajian rutin ini akan terus dilaksanakan setiap bulan dengan pembahasan yang beragam."
    }
  },
  {
    id: 3,
    title: "Bakti Sosial Peduli Bencana di Wilayah Sijono",
    slug: "bakti-sosial-peduli-bencana",
    category: "sosial",
    excerpt: "Anggota IPNU IPPNU turun langsung membantuzta warga terdampak banjir.",
    content: "Bakti sosial dilakukan dengan menyalurkan bantuan kepada warga yang terdampak banjir bandang di Desa Sijono.",
    author: "Sekretaris Kaderisasi",
    date: "2026-04-05",
    createdAt: "2026-04-05T08:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1599717462650-02831c496816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1599717462650-02831c496816?w=400",
      "https://images.unsplash.com/photo-1774060888176-cd6354047851?w=400",
      "https://images.unsplash.com/photo-1629273229214-d96be4552b9a?w=400"
    ],
    sections: {
      tujuan: "Membantu masyarakat yang terdampak bencana banjir dan meringankan beban warga sekitar.",
      materi: "Pembagian paket sembako, pakaian, dan kebutuhan pokok lainnya kepada 50 kepala keluarga.",
      kesan: '"Terima kasih atas bantuan yang diberikan. Mudah mudahan Allah membalas kebaikan kalian." - Warga Desa',
      penutup: "IPNU IPPNU akan terus开展此类社会服务活动，以帮助社区中有需要的人。"
    }
  },
  {
    id: 4,
    title: "Musyawarah Kerja (Muker) Tahun 2026",
    slug: "musyawarah-kerja-2026",
    category: "organisasi",
    excerpt: "Musyawarah kerja diselenggarakan untuk menyusun program kerja tahun 2026.",
    content: "Muker dilaksanakan dengan tujuan menyusun program kerja strategis dan evaluasi kegiatan tahun sebelumnya.",
    author: "Sekretaris Umum",
    date: "2026-04-01",
    createdAt: "2026-04-01T09:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1774060888176-cd6354047851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1774060888176-cd6354047851?w=400"
    ],
    sections: {
      tujuan: "Menyusun program kerja strategis tahun 2026 dan evaluasi kegiatan tahun sebelumnya.",
      materi: "Pembahasan program kerja, evaluasi kegiatan, dan anggaran organisasi untuk tahun anggaran berikutnya.",
      kesan: '"Muker ini berjalan dengan lancar dan produktif. Kita punya program yang jelas untuk tahun ini." - Ketua',
      penutup: "Hasil Muker 2026 akan menjadi pedoman kerja seluruh pengurus selama satu tahun ke depan."
    }
  },
  {
    id: 5,
    title: "Seminar Nasional: Generasi Muda dalam Era Digital",
    slug: "seminar-generasi-muda-era-digital",
    category: "seminar",
    excerpt: "Seminar nasional membahas peran generasi muda di era digital.",
    content: "Seminar diselenggarakan dengan mengundang pembicara dari berbagai bidang teknologi dan pendidikan.",
    author: "Sekretaris PD",
    date: "2026-03-28",
    createdAt: "2026-03-28T13:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1545886082-e66c6b9e011a?w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1545886082-e66c6b9e011a?w=400",
      "https://images.unsplash.com/photo-1629273229214-d96be4552b9a?w=400"
    ],
    sections: {
      tujuan: "Membahas peran generasi muda di era digital dan tantangan yang dihadapi dalam memanfaatkan teknologi secara positif.",
      materi: "Pembicara ahli di bidang teknologi, pendidikan, dan entrepreneurship memberikan wawasan berharga.",
      kesan: '"Seminar ini sangat inspire untuk kita semua. Mari kita manfaatkan teknologi untuk hal yang positif." - Peserta',
      penutup: "Seminar ditutup dengan sesi tanya jawab dan foto bersama seluruh peserta."
    }
  }
];
