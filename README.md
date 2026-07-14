# 🌟 Website Sistem Informasi IPNU IPPNU Desa Sijono

Selamat datang di repositori proyek **Sistem Informasi Pelajar NU (IPNU IPPNU) Desa Sijono**. Aplikasi ini merupakan Single Page Application (SPA) modern yang dibangun menggunakan ekosistem React, dilengkapi dengan sistem *Role-Based Access Control* (RBAC), pengelolaan surat-menyurat elektronik, serta menggunakan Supabase sebagai *backend-as-a-service* (BaaS).

---

## ✨ Fitur Utama Sistem

### 🏠 Portal Publik (Halaman Depan)
* **Beranda (Home):** Menyajikan *hero section*, informasi singkat organisasi, fitur layanan, dan galeri kegiatan terbaru.
* **Profil & Struktur:** Informasi mendetail mengenai sejarah, visi, misi, serta bagan struktur kepengurusan IPNU & IPPNU yang interaktif.
* **Portal Berita:** Sistem manajemen konten (CMS) mini untuk mempublikasikan artikel, kajian, dan berita kegiatan organisasi kepada publik.
* **Formulir Layanan Surat:** Masyarakat atau anggota dapat mengajukan surat (Surat Keterangan, Undangan, dll) secara *online*, lengkap dengan pengisian nomor telepon/WhatsApp untuk *follow-up*.
* **Pendaftaran Anggota:** Formulir pendaftaran *online* untuk calon kader IPNU dan IPPNU baru.

### 🔐 Sistem Autentikasi & RBAC (Role-Based Access Control)
Terintegrasi secara aman dengan **Supabase Auth** dan mendukung *multi-role login*:
1. **Super Admin**: Memiliki akses tak terbatas untuk mengelola sistem, *logs*, dan database inti.
2. **Admin**: Mengelola konten *website* (Berita, Inventaris, Data Anggota).
3. **Ketua**: Memberikan persetujuan akhir (Approve/Reject) dan Tanda Tangan pada dokumen surat.
4. **Sekretaris**: Membuat, memverifikasi dokumen awal, serta membubuhkan stempel resmi organisasi.
5. **Anggota**: Memiliki portal *dashboard* khusus anggota untuk memantau status pengajuan atau kegiatan.

### 👨‍💼 Dashboard Administrasi Terpadu (Sistem Manajemen)
* **Manajemen Surat-Menyurat elektronik (E-Surat)**: 
  * Proses pengajuan ➡️ Verifikasi Sekretaris ➡️ Persetujuan & Tanda Tangan Ketua.
  * Fitur unggah (Upload) tanda tangan dan stempel (terintegrasi dengan Supabase Storage).
* **Kelola Berita (CMS)**: CRUD (*Create, Read, Update, Delete*) artikel dan berita yang akan tampil di halaman depan.
* **Data Anggota & Pengurus**: Pencatatan database *real-time* anggota dan pengurus aktif.
* **Inventaris & Aset**: Pencatatan aset barang organisasi, jumlah, kondisi, dan lokasi.
* **Log Aktivitas**: Pemantauan histori login (Admin Login Log) untuk keamanan sistem.

---

## 🛠️ Teknologi Stack

**Frontend Architecture:**
* **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Bahasa**: TypeScript (Type Safety & Scalability)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **UI Components**: [Radix UI](https://www.radix-ui.com/) & Material UI Icons
* **State & Routing**: React Context API & React Router v7

**Backend & Infrastruktur:**
* **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
* **Storage**: Supabase Storage Bucket (untuk Tanda Tangan, Stempel, dan Lampiran)
* **CI/CD**: GitHub Actions (Otomatisasi *Build* & *Test*)

---

## 🚀 Persiapan & Instalasi Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer Anda (Lokal).

### 1. Kloning Repositori
```bash
git clone https://github.com/Nanainay/Website-UI-for-Pelajar-NU-Sijono.git
cd "Website UI for Pelajar NU Sijono"
```

### 2. Setup Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment (Supabase)
Buat sebuah file bernama `.env` di *root directory* (sejajar dengan package.json) dan isi dengan kredensial proyek Supabase Anda:
```env
VITE_SUPABASE_URL=https://[PROJECT-ID].supabase.co
VITE_SUPABASE_ANON_KEY=ey...[ANON-KEY-ANDA]...
```
*(Catatan: File `.env` sudah dimasukkan ke `.gitignore` sehingga aman dan tidak akan ter-push ke GitHub).*

### 4. Setup Database (SQL) di Supabase
Buka **SQL Editor** pada *dashboard* Supabase Anda, lalu eksekusi file-file berikut secara berurutan:
1. Jalankan isi file `supabase_schema.sql` untuk membuat struktur tabel (Users, Letters, News, dll) serta kebijakan keamanan (RLS).
2. Jalankan isi file `setup_storage.sql` untuk membuat dan mengonfigurasi *Storage Buckets* khusus *signatures* (tanda tangan) dan *stamps* (stempel).
3. (Opsional) Jalankan isi file `seed_users.sql` untuk membuat data pengguna awal (Akun Admin, Ketua, dll).

### 5. Jalankan Development Server
```bash
npm run dev
```
Buka `http://localhost:5173` di peramban web Anda.

---

## 📂 Struktur Folder Utama

```text
/
├── .github/workflows/       # Konfigurasi CI/CD GitHub Actions
├── public/                  # Aset statis publik
├── src/
│   ├── app/
│   │   ├── components/      # UI Component (Reusable components, Form, Dialog, Layout)
│   │   ├── context/         # React Context (AuthContext, OrganizationContext, dll)
│   │   ├── pages/           # Halaman Aplikasi (Dashboard, Home, Login, dll)
│   │   ├── routes.tsx       # Konfigurasi routing aplikasi
│   │   └── App.tsx          # Komponen Utama
│   ├── services/            # API dan Integrasi Backend
│   │   ├── api.ts           # Abstraksi endpoint lokal/dummy (Legacy)
│   │   └── supabase.ts      # Klien dan konfigurasi Supabase Database & Auth
│   ├── utils/               # Fungsi-fungsi utilitas bantuan
│   └── types.ts             # Definisi global TypeScript interfaces
├── .env                     # Variabel Environment (Lokal)
├── supabase_schema.sql      # Skema Database PostgreSQL
├── setup_storage.sql        # Skema Storage Bucket Supabase
├── seed_users.sql           # Data Dummy Pengguna
└── package.json             # Konfigurasi proyek & skrip npm
```

---

## 🔒 Panduan Login Default (Seed)

Jika Anda mengeksekusi `seed_users.sql`, berikut adalah daftar kredensial yang dapat digunakan:

* **Super Admin**: `superadmin@ipnusijono.org` | Password: `password123`
* **Admin**: `admin@ipnusijono.org` | Password: `password123`
* **Ketua**: `ketua@ipnusijono.org` | Password: `password123`
* **Sekretaris**: `sekretaris@ipnusijono.org` | Password: `password123`
* **Anggota**: `anggota@ipnusijono.org` | Password: `password123`

---

## 📞 Kontak & Dukungan
Sistem ini terus dikembangkan untuk memajukan administrasi digital Pimpinan Ranting IPNU-IPPNU Desa Sijono. Apabila ditemukan permasalahan dalam sistem (*bug*), silakan buat **Issue** baru pada repositori ini.

**© 2026 IPNU IPPNU Desa Sijono. All rights reserved.**
Dibuat oleh:
FINA INAYATUL MAULA
101230036
TF23B
