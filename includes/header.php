<?php
$siteTitle = 'Pelajar NU Sijono';
$basePath = $basePath ?? '';
$currentPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($basePath && str_starts_with($currentPath, $basePath)) {
    $currentPath = substr($currentPath, strlen($basePath));
}
$paths = [
    '/' => 'Beranda',
    '/tentang-kita' => 'Tentang Kita',
    '/layanan-surat' => 'Layanan Surat',
    '/berita' => 'Berita',
];
$user = $_SESSION['user'] ?? null;
$assetBase = $basePath ?: '';
$rootUrl = $assetBase ?: '/';
function build_url($path) {
    global $basePath;
    return ($basePath ?: '') . $path;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= htmlspecialchars($siteTitle) ?></title>
    <link rel="stylesheet" href="<?= $assetBase ?>/assets/css/style.css" />
</head>
<body>
<header class="site-header">
    <div class="container header-inner">
        <a class="brand" href="<?= $rootUrl ?>">
            <div class="brand-logos">
                <div class="logo-shadow-wrapper">
                    <img src="<?= $assetBase ?>/images/logo IPNU IPPNU.PNG" alt="IPNU IPPNU Logo" class="logo-combined">
                </div>
            </div>
            <span class="brand-text">Pelajar NU Sijono</span>
        </a>
        <div class="menu-toggle" onclick="toggleMenu()">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <nav class="site-nav" id="main-nav">
            <div class="nav-links">
                <?php if (($user['role'] ?? '') !== 'admin'): ?>
                    <?php foreach ($paths as $path => $label): ?>
                        <?php $link = build_url($path); ?>
                        <a class="nav-link<?= $currentPath === $path ? ' active' : '' ?>" href="<?= $link ?>"><?= $label ?></a>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
            <div class="nav-actions">
                <?php if (($user['role'] ?? '') !== 'admin'): ?>
                    <a class="btn-module btn-outline<?= $currentPath === '/gabung-anggota' ? ' active' : '' ?>" href="<?= build_url('/gabung-anggota') ?>">Gabung Anggota</a>
                <?php endif; ?>
                <?php if ($user): ?>
                    <div class="user-dropdown">
                        <button class="nav-user dropdown-toggle" onclick="this.nextElementSibling.classList.toggle('show')">
                            Halo, <?= htmlspecialchars($user['name']) ?>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </button>
                        <div class="dropdown-menu">
                            <?php if (($user['role'] ?? '') === 'admin'): ?>
                                <div class="dropdown-header">Panel Admin</div>
                                <a href="<?= build_url('/admin/dashboard') ?>" class="dropdown-item">Dashboard</a>
                                <a href="<?= build_url('/admin/berita') ?>" class="dropdown-item">Kelola Berita</a>
                                <a href="<?= build_url('/admin/surat') ?>" class="dropdown-item">Kelola Surat</a>
                                <a href="<?= build_url('/admin/inventaris') ?>" class="dropdown-item">Kelola Inventaris</a>
                            <?php else: ?>
                                <div class="dropdown-header">Menu Anggota</div>
                                <a href="<?= build_url('/') ?>" class="dropdown-item">Beranda</a>
                                <a href="<?= build_url('/tentang-kita') ?>" class="dropdown-item">Tentang Kita</a>
                                <a href="<?= build_url('/struktur-pengurus') ?>" class="dropdown-item" style="padding-left: 28px; font-size: 0.9rem; color: #6b7280;">↳ Struktur Pengurus</a>
                                <a href="<?= build_url('/layanan-surat') ?>" class="dropdown-item">Layanan Surat</a>
                                <a href="<?= build_url('/berita') ?>" class="dropdown-item">Artikel / Berita</a>
                                <a href="<?= build_url('/gabung-anggota') ?>" class="dropdown-item">Gabung Anggota</a>
                                <a href="<?= build_url('/inventaris') ?>" class="dropdown-item">Daftar Inventaris</a>
                                <a href="<?= build_url('/kelola-anggota') ?>" class="dropdown-item">Kelola Anggota</a>
                            <?php endif; ?>
                        </div>
                    </div>
                    <a href="<?= build_url('/logout') ?>" class="btn-module" style="color: #dc2626; border: 1px solid #fecaca; background: #fef2f2; padding: 8px 16px; border-radius: 50px; text-decoration: none; font-weight: 600;">Logout</a>
                <?php else: ?>
                    <a class="btn-module btn-primary<?= $currentPath === '/login' ? ' active' : '' ?>" href="<?= build_url('/login') ?>">Login</a>
                <?php endif; ?>
            </div>
        </nav>
    </div>
</header>
<main class="site-main">
