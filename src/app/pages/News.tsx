import { Link } from "react-router";
import { Calendar, ArrowRight, Search, Newspaper, User, Tag } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNews } from "../context/NewsContext";
import { useState } from "react";

const categoryColors: Record<string, string> = {
  Kegiatan:     "bg-green-100 text-green-700",
  Kajian:       "bg-blue-100 text-blue-700",
  Sosial:       "bg-amber-100 text-amber-700",
  Organisasi:   "bg-purple-100 text-purple-700",
  Seminar:      "bg-pink-100 text-pink-700",
  Peringatan:   "bg-red-100 text-red-700",
  Kaderisasi:   "bg-teal-100 text-teal-700",
};

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1523240715630-1a1bb4a1eebe?q=80&w=800&auto=format&fit=crop";

export function News() {
  const { articles, loading } = useNews();
  const [searchTerm, setSearchTerm]   = useState("");
  const [activeCategory, setCategory] = useState("Semua");

  // Only show Published articles to members
  const published = articles.filter(a => a.status === "Published");

  const categories = ["Semua", ...Array.from(new Set(published.map(a => a.category)))];

  const filtered = published.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === "Semua" || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-poppins">

      {/* Hero */}
      <div className="bg-[#0f5132] text-white relative overflow-hidden py-20">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none flex items-center justify-end">
          <Newspaper className="w-96 h-96 mr-8" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-amber-400/30">
            <Newspaper className="w-4 h-4" />
            Publikasi Terbaru
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 uppercase leading-none">
            Berita & Artikel
          </h1>
          <p className="text-green-100/70 text-xl font-medium max-w-2xl">
            Update terbaru seputar kegiatan dan program IPNU IPPNU Desa Sijono.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Search + Category Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-green-100 transition-all font-medium"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition-all border whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-[#0f5132] text-white border-[#0f5132] shadow-lg shadow-green-900/20"
                    : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-[#0f5132]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white h-[400px] rounded-[2.5rem] animate-pulse border border-gray-100" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-gray-400 mb-2">Belum ada artikel tersedia</h3>
            <p className="text-gray-400 font-medium">
              {searchTerm ? "Coba kata kunci lain." : "Admin belum mempublikasikan artikel."}
            </p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(article => (
              <Card key={article.id} className="overflow-hidden rounded-[2rem] border-none shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white group">
                
                {/* Thumbnail */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={article.image || PLACEHOLDER_IMG}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                  />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-md ${
                      categoryColors[article.category] || "bg-gray-100 text-gray-700"
                    }`}>
                      {article.category}
                    </span>
                  </div>
                </div>

                <CardContent className="p-7 flex flex-col gap-4">
                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#0f5132]/40" />
                      {new Date(article.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#0f5132]/40" />
                      {article.author}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-xl text-gray-900 line-clamp-2 leading-snug group-hover:text-[#0f5132] transition-colors">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-medium flex-1">
                    {article.content}
                  </p>

                  {/* CTA */}
                  <Link to={`/berita/${article.id}`}>
                    <Button className="w-full bg-[#0f5132] hover:bg-green-900 text-white rounded-2xl h-12 font-black transition-all shadow-md shadow-green-900/10 flex items-center justify-center gap-2">
                      Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Article count */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-sm text-gray-400 font-medium mt-10">
            Menampilkan <strong className="text-[#0f5132]">{filtered.length}</strong> dari {published.length} artikel terpublikasi.
          </p>
        )}

      </div>
    </div>
  );
}
