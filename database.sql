-- Database script untuk aplikasi PHP native
CREATE DATABASE IF NOT EXISTS website_pelajar_nu CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE website_pelajar_nu;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','member') NOT NULL DEFAULT 'member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS articles_old (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('pending','processed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS surat_masuk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nomor_surat VARCHAR(255) NOT NULL,
  tanggal_masuk DATE NOT NULL,
  pengirim VARCHAR(255) NOT NULL,
  perihal TEXT NOT NULL,
  file_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS surat_keluar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nomor_surat VARCHAR(255) NOT NULL,
  tanggal_keluar DATE NOT NULL,
  penerima VARCHAR(255) NOT NULL,
  perihal TEXT NOT NULL,
  file_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@example.com', 'admin123', 'admin'),
('Member', 'member@example.com', 'member123', 'member');

INSERT INTO articles (title, slug, excerpt, content) VALUES
('Kegiatan Kajian Rutin', 'kegiatan-kajian-rutin', 'Kajian rutin mingguan untuk meningkatkan wawasan keislaman.', 'Kami mengadakan kajian rutin setiap pekan untuk mendukung pengembangan spiritual dan intelektual anggota.'),
('Pelatihan Kepemimpinan', 'pelatihan-kepemimpinan', 'Program kepemimpinan untuk pelajar aktif.', 'Pelatihan ini bertujuan membentuk karakter dan kemampuan kepemimpinan bagi pengurus dan anggota.'),
('Bakti Sosial Pelajar', 'bakti-sosial-pelajar', 'Kegiatan sosial untuk membantu masyarakat sekitar.', 'Anggota IPNU IPPNU aktif melakukan kegiatan bakti sosial sebagai bentuk pengabdian kepada masyarakat.');


CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  date DATE NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status ENUM('Published', 'Draft') NOT NULL DEFAULT 'Draft',
  image VARCHAR(255),
  sections JSON,
  gallery JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
