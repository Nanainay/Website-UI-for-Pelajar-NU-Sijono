<?php
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($name && $email && $password) {
        $existing = db_fetch_one('SELECT id FROM users WHERE email = ? LIMIT 1', 's', [$email]);
        if ($existing) {
            $message = 'Email sudah terdaftar. Gunakan email lain.';
        } else {
            db_execute(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                'ssss',
                [$name, $email, hash_password($password), 'member']
            );
            $message = 'Pendaftaran berhasil! Silakan login.';
        }
    } else {
        $message = 'Semua field harus diisi.';
    }
}
?>
<section class="section">
    <div class="container">
        <h2>Gabung Anggota</h2>
        <?php if ($message): ?>
            <div class="message"><?= htmlspecialchars($message) ?></div>
        <?php endif; ?>
        <form method="post" class="form-card">
            <label for="name">Nama Lengkap</label>
            <input type="text" id="name" name="name" placeholder="Masukkan nama lengkap Anda" required />
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="contoh@email.com" required />
            <label for="password">Kata Sandi</label>
            <input type="password" id="password" name="password" placeholder="Minimal 6 karakter" required />
            <button type="submit" class="button button-primary" style="width: 100%; margin-top: 8px;">Daftar Sekarang</button>
        </form>
    </div>
</section>
