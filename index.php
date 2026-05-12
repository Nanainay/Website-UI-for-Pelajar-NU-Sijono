<?php
session_start();
require __DIR__ . '/includes/db.php';

$basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
if ($basePath === '.' || $basePath === '\\') {
    $basePath = '';
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($basePath && str_starts_with($path, $basePath)) {
    $path = substr($path, strlen($basePath));
}
$path = rtrim($path, '/');
if ($path === '') {
    $path = '/';
}



$page = '404';
$slug = null;
$articleId = null;

switch ($path) {
    case '/':
        $page = 'home';
        break;
    case '/tentang-kita':
        $page = 'about';
        break;
    case '/layanan-surat':
        $page = 'services';
        break;
    case '/berita':
        $page = 'news';
        break;

    case '/login':
        $page = 'login';
        break;
    case '/gabung-anggota':
        $page = 'join';
        break;
    default:
        if (preg_match('#^/berita/([^/]+)$#', $path, $matches)) {
            $slug = $matches[1];
            $_GET['slug'] = $slug;
            $page = 'news-detail';

        break;
}

include __DIR__ . '/includes/header.php';
$pageFile = __DIR__ . '/pages/' . $page . '.php';
if (file_exists($pageFile)) {
    include $pageFile;
} else {
    include __DIR__ . '/pages/404.php';
}
include __DIR__ . '/includes/footer.php';
