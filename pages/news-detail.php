<?php
$slug = $_GET['slug'] ?? '';
$article = null;

if ($slug) {
    $result = db_query('SELECT * FROM articles WHERE slug = ? LIMIT 1', 's', [$slug]);
    $article = $result->fetch_assoc();
}
?>
<section class="section">
    <div class="container">
        <?php if ($article): ?>
            <h2><?= htmlspecialchars($article['title']) ?></h2>
            <p class="article-date">Dipublikasikan: <?= date('d M Y', strtotime($article['created_at'])) ?></p>
            <p><?= nl2br(htmlspecialchars($article['content'])) ?></p>
            <a class="button button-secondary" href="<?= base_url('/berita') ?>">Kembali ke Berita</a>
        <?php else: ?>
            <h2>Artikel tidak ditemukan</h2>
            <p>Maaf, artikel yang Anda cari tidak ditemukan.</p>
            <a class="button button-secondary" href="<?= base_url('/berita') ?>">Kembali ke Berita</a>
        <?php endif; ?>
    </div>
</section>
