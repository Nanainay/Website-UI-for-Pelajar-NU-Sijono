# Aplikasi PHP Native untuk Pelajar NU Sijono

## Struktur baru
- `index.php` — front controller PHP untuk menangani rute
- `includes/` — konfigurasi database dan header/footer
- `pages/` — halaman konten PHP untuk setiap menu
- `assets/css/style.css` — styling aplikasi
- `database.sql` — skrip MySQL untuk membuat database dan tabel
- `.htaccess` — rewrite URL agar menggunakan URL bersih

## Cara pasang di XAMPP
1. Copy folder proyek ke `C:\xampp\htdocs\pelajar-nu`
2. Pastikan Apache dan MySQL berjalan di XAMPP Control Panel
3. Buka phpMyAdmin: `http://localhost/phpmyadmin`
4. Import `database.sql` atau jalankan skrip di file tersebut
5. Buka browser: `http://localhost/pelajar-nu/`

## Akun demo
- Admin: `admin@example.com` / `admin123`
- Member: `member@example.com` / `member123`

## Rute aplikasi
- `/` — Beranda
- `/tentang-kita` — Tentang Kita
- `/layanan-surat` — Layanan Surat
- `/berita` — Berita & Artikel
- `/berita/{slug}` — Detail artikel
- `/gabung-anggota` — Pendaftaran anggota
- `/login` — Halaman login
- `/administrasi` — Panel admin
- `/administrasi/artikel` — Manajemen artikel (admin)
- `/administrasi/artikel/tambah` — Tambah artikel baru (admin)
- `/administrasi/artikel/edit/{id}` — Sunting artikel (admin)
- `/administrasi/anggota` — Manajemen anggota (admin)
- `/administrasi/layanan` — Manajemen permintaan layanan (admin)

## Catatan
- Aplikasi ini menggunakan PHP native dan MySQLi tanpa framework.
- Jika Anda ingin menambahkan modul baru, cukup buat file di `pages/` dan update `index.php`.
- Styling saat ini sederhana; silakan kembangkan `assets/css/style.css` sesuai kebutuhan.
