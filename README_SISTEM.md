# 🌟 Website IPNU IPPNU Desa Sijono

Website sistem informasi lengkap untuk organisasi IPNU IPPNU Desa Sijono dengan fitur CRUD admin yang komprehensif.

---

## ✨ Fitur Utama

### 🏠 Halaman Publik

1. **Beranda (Home)**
   - Hero section dengan call-to-action
   - 4 kartu layanan utama
   - Galeri kegiatan
   - Responsive design

2. **Tentang Kita**
   - Profil IPNU & IPPNU
   - Visi, Misi, dan Nilai
   - Struktur Pengurus IPNU & IPPNU (Tabs)
   - Card layout untuk pengurus

3. **Layanan Surat**
   - 4 jenis layanan surat
   - **✅ Formulir pengajuan dengan field nomor telepon**
   - Modal dialog untuk pengajuan
   - Toast notification

4. **Berita & Artikel**
   - Grid layout berita
   - Kategori dengan color coding
   - Halaman detail berita
   - Galeri foto

5. **Gabung Anggota**
   - Form pendaftaran lengkap
   - Pilihan IPNU/IPPNU
   - Contact person cards
   - Validasi form

6. **Administrasi**
   - Arsip surat (view & download)
   - Data inventaris
   - Laporan keuangan
   - Protected dengan demo login

### 🔐 Sistem Login

**Kredensial:**

- **Admin:** `admin` / `admin123`
- **Anggota:** `anggota` / `anggota123`

**Fitur:**

- Password visibility toggle
- Role selection (Admin/Anggota)
- Protected routes
- Context API untuk auth state

### 👨‍💼 Admin Dashboard (CRUD Lengkap)

#### 1. 📊 Dashboard Overview

- **Statistik Real-time:**
  - Total Anggota
  - Berita Terpublikasi
  - Surat Pending
  - Total Inventaris
- **Tabel Surat Pending:**
  - Approve/Reject surat
  - View nomor telepon pemohon
  - Quick actions

#### 2. 📰 Kelola Berita (CRUD)

- **Create:** Tambah berita baru
  - Judul
  - Kategori (Kegiatan, Kajian, Sosial, Organisasi)
  - Tanggal
  - Excerpt
- **Read:** Tabel daftar berita
- **Update:** Edit berita existing
- **Delete:** Hapus berita dengan konfirmasi

#### 3. 📄 Kelola Surat (CRUD)

- **Read:** Lihat semua surat
- **Approve:** Setujui pengajuan surat
- **Reject:** Tolak pengajuan surat
- **Delete:** Hapus surat
- **Status Badge:** Pending, Disetujui, Ditolak
- **Field Baru:** ✅ Nomor telepon pemohon

#### 4. 👥 Kelola Pengurus (CRUD)

- **Create:** Tambah pengurus baru
  - Nama
  - Jabatan
  - Organisasi (IPNU/IPPNU)
- **Read:** Tabel daftar pengurus
- **Update:** Edit data pengurus
- **Delete:** Hapus pengurus

#### 5. 📦 Kelola Inventaris (CRUD)

- **Create:** Tambah item baru
  - Nama Barang
  - Jumlah (number input)
  - Kondisi (Baik, Rusak Ringan, Rusak Berat)
  - Lokasi
- **Read:** Tabel inventaris
- **Update:** Edit item
- **Delete:** Hapus item

#### 6. 💰 Laporan Keuangan

- View laporan keuangan
- Download LPJ
- (Placeholder untuk development)

---

## 🎨 Design System

### Color Scheme

- **Primary:** Green (#16a34a) - Identitas NU
- **Secondary:** Amber (#f59e0b) - Aksen emas
- **Accent:** White (#ffffff)
- **Text:** Green-800 untuk heading, Green-600 untuk body

### Components

- **Cards:** Border radius 0.75rem, shadow-lg
- **Buttons:** Rounded-lg, smooth transitions
- **Forms:** Border green-200, focus:border-green-500
- **Badges:** Color-coded by status/category

### Typography

- **Headings:** Font-bold, various sizes
- **Body:** Leading-relaxed untuk readability
- **Labels:** Font-semibold

---

## 🛠️ Teknologi Stack

### Frontend

- **React 18.3.1** - UI Library
- **TypeScript** - Type Safety
- **React Router 7** - Routing & Navigation
- **Tailwind CSS v4** - Utility-first CSS
- **Vite** - Build Tool

### UI Components

- **Radix UI** - Accessible primitives
  - Dialog, Tabs, Select, Radio Group
  - Sheet (Sidebar), Table, Badge
- **Lucide React** - Modern icon library
- **Sonner** - Toast notifications

### State Management

- **React Context API** - Authentication state
- **useState** - Local component state

### Form Handling

- Controlled components
- Custom validation
- Toast feedback

---

## 📂 Struktur Folder

```
/src
  /app
    /components
      /ui          - Radix UI components
      Layout.tsx   - Main layout dengan navbar & footer
    /context
      AuthContext.tsx  - Authentication context
    /pages
      Home.tsx
      About.tsx
      LetterServices.tsx  - ✅ Dengan field nomor telepon
      News.tsx
      NewsDetail.tsx
      MemberRegistration.tsx
      Administration.tsx
      Login.tsx         - ✅ Kredensial berbeda
      AdminDashboard.tsx  - ✅ CRUD lengkap
      NotFound.tsx
    App.tsx
    routes.tsx
  /styles
    fonts.css
    index.css
    tailwind.css
    theme.css
```

---

## 🚀 Cara Menggunakan

### 1. Login sebagai Admin

```
URL: /login
Username: admin
Password: admin123
Role: Admin
```

Setelah login → diarahkan ke `/admin`

### 2. CRUD Operations

#### Tambah Berita:

1. Klik menu "Kelola Berita"
2. Klik tombol "Tambah Berita"
3. Isi form (judul, kategori, tanggal, excerpt)
4. Klik "Simpan"

#### Edit Berita:

1. Klik icon Edit (✏️) di baris berita
2. Ubah data yang diperlukan
3. Klik "Simpan"

#### Hapus Berita:

1. Klik icon Trash (🗑️)
2. Konfirmasi penghapusan
3. Data terhapus

_Proses yang sama berlaku untuk Pengurus dan Inventaris_

#### Approve/Reject Surat:

1. Di Dashboard atau menu "Kelola Surat"
2. Lihat daftar surat pending
3. Klik "Setujui" atau "Tolak"
4. Status berubah otomatis

### 3. Pengajuan Surat (User Publik)

```
URL: /layanan-surat
```

1. Klik "Ajukan Surat"
2. Isi form:
   - Nama Lengkap ✅
   - Jenis Surat ✅
   - Keterangan ✅
   - **Nomor Telepon** ✅ (Field baru!)
3. Klik "Kirim Pengajuan"
4. Surat masuk ke admin dashboard

---

## ✅ Checklist Fitur yang Diminta

### 1. ✅ Perbaiki Error

- Fixed dynamic Tailwind class issues
- Fixed import paths
- All components working properly

### 2. ✅ Tambah Nomor WA di Formulir Surat

- Field "Nomor Telepon" ditambahkan
- Validasi required
- Tampil di admin dashboard
- Admin bisa lihat untuk follow-up

### 3. ✅ CRUD untuk Admin

**Berita:**

- ✅ Create - Tambah berita baru
- ✅ Read - Lihat daftar berita
- ✅ Update - Edit berita
- ✅ Delete - Hapus berita

**Surat:**

- ✅ Read - Lihat semua surat
- ✅ Update - Approve/Reject status
- ✅ Delete - Hapus surat
- ✅ View - Lihat nomor telepon

**Pengurus:**

- ✅ Create - Tambah pengurus
- ✅ Read - Lihat daftar
- ✅ Update - Edit data
- ✅ Delete - Hapus pengurus

**Inventaris:**

- ✅ Create - Tambah item
- ✅ Read - Lihat daftar
- ✅ Update - Edit item
- ✅ Delete - Hapus item

### 4. ✅ Login dengan Password Berbeda

**Admin:**

- Username: `admin`
- Password: `admin123`
- Full access ke dashboard

**Anggota:**

- Username: `anggota`
- Password: `anggota123`
- Limited access

**Features:**

- ✅ Password visibility toggle
- ✅ Role selection
- ✅ Protected routes
- ✅ Logout functionality
- ✅ Context-based auth

---

## 🎯 Next Steps (Recommendations)

### Security (Production)

1. Hash passwords (bcrypt)
2. Implement JWT tokens
3. Add refresh tokens
4. Rate limiting
5. CSRF protection
6. HTTPS only

### Backend Integration

1. Connect to database (PostgreSQL/MongoDB)
2. REST API / GraphQL
3. File upload untuk gambar berita
4. PDF generation untuk surat
5. Email notifications

### Additional Features

1. Search & filter di tabel
2. Pagination
3. Export data (Excel/PDF)
4. Upload foto pengurus
5. Rich text editor untuk berita
6. Calendar untuk kegiatan
7. Multi-role permissions
8. Activity logs

---

## 📞 Support

Untuk pertanyaan atau dukungan teknis, hubungi:

- Email: ipnu.ippnu.sijono@gmail.com
- WhatsApp: +62 xxx-xxxx-xxxx

---

## 📝 License

© 2026 IPNU IPPNU Desa Sijono. All rights reserved.

---

**Dibuat dengan ❤️ untuk kemajuan Pelajar NU Sijono**