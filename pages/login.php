<?php
session_start();
require_once __DIR__ . '/../includes/db.php';

$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $role = trim($_POST['role'] ?? '');

    if ($username && $password && $role) {
        $user = db_fetch_one('SELECT * FROM users WHERE username = ? AND role = ? LIMIT 1', 'ss', [$username, $role]);
        if ($user && verify_password($password, $user['password'])) {
            $_SESSION['user'] = [
                'id' => $user['id'],
                'name' => $user['name'],
                'role' => $user['role'],
                'username' => $user['username'],
            ];
            header('Location: ' . base_url('/'));
            exit;
        }
        $message = 'Email, password, atau peran salah.';
    } else {
        $message = 'Email, password, dan peran harus diisi.';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login Pelajar NU Sijono</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>
      :root {
        color-scheme: dark;
        --green-900: #0f5132;
        --green-800: #164d36;
        --green-700: #1a593f;
        --gold: #e6c87c;
        --soft-bg: #f7f8fb;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: 'Poppins', sans-serif;
        background: #eef2f6;
        color: #102a16;
      }

      body::before {
        content: '';
        position: fixed;
        inset: 0;
        background: radial-gradient(circle at top right, rgba(230, 200, 124, 0.16), transparent 18%),
          radial-gradient(circle at bottom left, rgba(15, 81, 50, 0.12), transparent 24%);
        pointer-events: none;
        z-index: -1;
      }

      .page-grid {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
      }

      .hero-pane {
        position: relative;
        overflow: hidden;
        padding: 3.2rem 2.5rem;
        background: linear-gradient(135deg, rgba(11, 74, 47, 1) 0%, rgba(15, 81, 50, 1) 45%, rgba(26, 88, 63, 1) 100%);
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .hero-pane::before {
        content: '';
        position: absolute;
        inset: 0;
        opacity: 0.14;
        background-image: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18) 0%, transparent 30%),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(180deg, rgba(255,255,255,0.1) 1px, transparent 1px);
        background-size: 120px 120px, 24px 24px, 24px 24px;
        pointer-events: none;
      }

      .hero-content {
        position: relative;
        z-index: 1;
        max-width: 560px;
      }

      .logo-row {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-bottom: 3rem;
      }

      .logo-spot {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 72px;
        height: 72px;
        border-radius: 22px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(6px);
      }

      .logo-spot span {
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.9);
        text-align: center;
        line-height: 1.2;
      }

      .hero-title {
        font-family: 'Poppins', sans-serif;
        font-weight: 800;
        font-size: clamp(3rem, 4vw + 1rem, 5rem);
        line-height: 0.95;
        margin: 0;
      }

      .hero-separator {
        width: 84px;
        height: 4px;
        border-radius: 999px;
        background: linear-gradient(90deg, #f8d478, #f4dd8f 80%, rgba(255,255,255,0.35));
        margin: 1.6rem 0 1.8rem;
      }

      .hero-subtitle {
        font-size: 1.1rem;
        font-weight: 500;
        opacity: 0.96;
        margin-bottom: 1.5rem;
      }

      .hero-tagline {
        font-family: 'Playfair Display', serif;
        font-style: italic;
        font-weight: 600;
        font-size: 2rem;
        color: #f7d785;
        margin: 0;
      }

      .hero-footer {
        margin-top: 3rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.95rem;
        opacity: 0.88;
      }

      .hero-footer svg {
        width: 24px;
        height: 24px;
        color: #f7d785;
        flex-shrink: 0;
      }

      .login-pane {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2.5rem;
        background: #f7f8fb;
      }

      .login-card {
        width: 100%;
        max-width: 460px;
        background: #ffffff;
        border-radius: 34px;
        padding: 2.5rem;
        box-shadow: 0 32px 60px rgba(16, 42, 22, 0.12);
        border: 1px solid rgba(15, 81, 50, 0.06);
        animation: fadeIn 0.95s ease both;
      }

      .login-card h1 {
        margin: 0 0 1.5rem;
        font-size: 2rem;
        font-weight: 700;
        color: #102a16;
      }

      .form-group {
        display: grid;
        gap: 0.95rem;
        margin-bottom: 1.45rem;
      }

      .form-label {
        font-size: 0.95rem;
        font-weight: 600;
        color: #33412a;
      }

      .form-control {
        width: 100%;
        border: 1px solid #d8e2d5;
        border-radius: 18px;
        padding: 1rem 1rem;
        font-size: 1rem;
        color: #152610;
        background: #fcfdfb;
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .form-control:focus {
        border-color: #0f5132;
        box-shadow: 0 0 0 4px rgba(15, 81, 50, 0.1);
      }

      .input-with-icon {
        position: relative;
      }

      .input-with-icon button {
        position: absolute;
        right: 0.8rem;
        top: 50%;
        transform: translateY(-50%);
        border: none;
        background: transparent;
        color: #4d6a4a;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .radio-group {
        display: grid;
        gap: 0.9rem;
        margin-bottom: 1.8rem;
      }

      .radio-item {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        padding: 1rem 1rem;
        border-radius: 18px;
        border: 1px solid #dde6db;
        background: #fcfdfb;
        cursor: pointer;
        transition: border-color 0.2s ease, background 0.2s ease;
      }

      .radio-item input {
        accent-color: #0f5132;
      }

      .radio-item:hover {
        border-color: #0f5132;
        background: rgba(15, 81, 50, 0.05);
      }

      .radio-item span {
        font-size: 0.98rem;
        color: #283822;
      }

      .btn-submit {
        width: 100%;
        border: none;
        border-radius: 18px;
        background: linear-gradient(135deg, #0f5132 0%, #1a673e 100%);
        color: #fff;
        padding: 1rem 1.1rem;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease;
      }

      .btn-submit:hover {
        transform: translateY(-1px);
        box-shadow: 0 18px 32px rgba(15, 81, 50, 0.18);
      }

      .small-note {
        margin-top: 1.4rem;
        font-size: 0.93rem;
        color: #6b7a64;
        opacity: 0.88;
      }

      .error-message {
        background: #fee2e2;
        color: #dc2626;
        padding: 0.75rem 1rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
        font-size: 0.95rem;
        border: 1px solid #fecaca;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 960px) {
        .page-grid {
          grid-template-columns: 1fr;
        }

        .hero-pane,
        .login-pane {
          padding: 2rem;
        }

        .hero-pane {
          min-height: 50vh;
        }
      }

      @media (max-width: 720px) {
        .hero-pane,
        .login-pane {
          padding: 1.7rem;
        }

        .hero-content {
          max-width: 100%;
        }

        .logo-row {
          flex-wrap: wrap;
        }

        .hero-title {
          font-size: clamp(2.5rem, 8vw, 4rem);
        }

        .login-card {
          padding: 1.8rem;
          border-radius: 28px;
        }
      }
    </style>
  </head>
  <body>
    <div class="page-grid">
      <section class="hero-pane">
<div class="hero-content">
          <h1 id="greeting" class="hero-title">Selamat Malam</h1>
          <div class="hero-separator"></div>
          <p class="hero-subtitle">Pimpinan Ranting IPNU IPPNU Desa Sijono</p>
          <p class="hero-tagline">Belajar, Berjuang, Bertaqwa</p>
        </div>

        <div class="hero-footer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a1 1 0 0 1 .993.883L13 3v9h5.385a1 1 0 0 1 .117 1.993L18.385 14H12v7.385a1 1 0 0 1-1.993.117L10 21.385V14H4.615a1 1 0 0 1-.117-1.993L4.615 12H10V3a1 1 0 0 1 1-1z" />
          </svg>
          <span>Masuk sekarang untuk akses anggota dan pengurus.</span>
        </div>
      </section>

<section class="login-pane">
        <form class="login-card" method="post">
          <div style="display: flex; justify-content: center; gap: 0.75rem; margin-bottom: 1.5rem;">
            <img src="/public/images/IPNU.png" alt="IPNU Logo" style="width: 48px; height: 48px; object-fit: contain;" />
            <img src="/public/images/IPPNU.png" alt="IPPNU Logo" style="width: 48px; height: 48px; object-fit: contain;" />
          </div>
          <h1>Login</h1>

          <?php if ($message): ?>
            <div class="error-message"><?= htmlspecialchars($message) ?></div>
          <?php endif; ?>

          <div class="form-group">
            <label class="form-label" for="username">Email</label>
            <input class="form-control" type="email" id="username" name="username" placeholder="Masukkan email" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <div class="input-with-icon">
            <input class="form-control" type="password" id="password" name="password" placeholder="Masukkan password" required />
              <button type="button" aria-label="Toggle password visibility" onclick="togglePassword()">
                <svg id="eyeIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <div class="radio-group">
            <label class="radio-item">
              <input type="radio" name="role" value="member" checked />
              <span>Anggota</span>
            </label>
            <label class="radio-item">
              <input type="radio" name="role" value="admin" />
              <span>Admin / Pengurus</span>
            </label>
          </div>

          <button class="btn-submit" type="submit">Masuk Sekarang</button>
          <p class="small-note">Pastikan email dan password benar, lalu pilih peran yang sesuai sebelum masuk.</p>
        </form>
      </section>
    </div>

    <script>
      const greetingLabel = document.getElementById('greeting');
      const hour = new Date().getHours();
      let greeting = 'Selamat Malam';

      if (hour >= 4 && hour < 11) {
        greeting = 'Selamat Pagi';
      } else if (hour >= 11 && hour < 15) {
        greeting = 'Selamat Siang';
      } else if (hour >= 15 && hour < 18) {
        greeting = 'Selamat Sore';
      }

      greetingLabel.textContent = greeting;

      function togglePassword() {
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.getElementById('eyeIcon');
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';

        eyeIcon.innerHTML = isPassword
          ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" />'
          : '<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.69 21.69 0 0 1 5.06-6.34" /><path d="M1 1l22 22" />';
      }
    </script>
  </body>
</html>
