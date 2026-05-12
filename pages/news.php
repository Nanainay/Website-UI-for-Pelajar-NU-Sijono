<?php
$articles = db_query('SELECT * FROM articles ORDER BY created_at DESC');
?>
<section class="section">
    <div class="container">
        <h2>Berita & Artikel</h2>
        <p>Berita terbaru dan informasi kegiatan IPNU IPPNU Desa Sijono.</p>
        <div class="news-list">
            <?php while ($article = $articles->fetch_assoc()): ?>
                <article class="news-card">
                    <h3><?= htmlspecialchars($article['title']) ?></h3>
                    <p><?= htmlspecialchars($article['excerpt']) ?></p>
                    <a href="<?= base_url('/berita/' . urlencode($article['slug'])) ?>">Baca Selengkapnya</a>
                </article>
            <?php endwhile; ?>
        </div>
    </div>
</section>
