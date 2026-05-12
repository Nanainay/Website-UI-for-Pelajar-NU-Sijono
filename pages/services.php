<?php
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $serviceType = trim($_POST['service_type'] ?? '');
    $messageText = trim($_POST['message'] ?? '');

    if ($name && $email && $serviceType && $messageText) {
        db_execute(
            'INSERT INTO service_requests (name, email, service_type, message) VALUES (?, ?, ?, ?)',
            'ssss',
            [$name, $email, $serviceType, $messageText]
        );
        $message = 'Permintaan layanan Anda telah dikirim. Kami akan menghubungi Anda segera.';
    } else {
        $message = 'Semua field harus diisi.';
    }
}
?>
<section class="section">
    <div class="container">
        <h2>Layanan Surat</h2>
        <p>Kami membantu pengajuan surat rekomen, mandat, dan dokumen resmi organisasi.</p>
        <?php if ($message): ?>
            <div class="message"><?= htmlspecialchars($message) ?></div>
        <?php endif; ?>
        <form method="post" class="form-card">
            <label for="name">Nama Lengkap</label>
            <input type="text" id="name" name="name" placeholder="Masukkan nama lengkap Anda" required />

            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="contoh@email.com" required />

            <label for="service_type">Jenis Surat</label>
            <select id="service_type" name="service_type" required>
                <option value="">Pilih jenis layanan</option>
                <option value="Surat Rekomendasi">Surat Rekomendasi</option>
                <option value="Surat Mandat">Surat Mandat</option>
                <option value="Surat Keterangan">Surat Keterangan</option>
            </select>

            <label for="message">Pesan Tambahan</label>
            <textarea id="message" name="message" rows="5" placeholder="Jelaskan kebutuhan surat Anda..." required></textarea>

            <button type="submit" class="button button-primary" style="width: 100%; margin-top: 8px;">Kirim Permintaan</button>
        </form>
    </div>
</section>
