import { Link, useParams, useNavigate } from "react-router";
import { Calendar, ArrowLeft, Share2, User, Tag, Images } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNews } from "../context/NewsContext";
import { toast } from "sonner";

const PLACEHOLDER = "https://images.unsplash.com/photo-1523240715630-1a1bb4a1eebe?q=80&w=800&auto=format&fit=crop";

export function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getArticle } = useNews();

  const article = getArticle(id ?? "");

  if (!article || article.status !== "Published") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#f8fafc] font-poppins">
        <div className="text-6xl">📰</div>
        <h2 className="text-2xl font-black text-gray-700">Artikel tidak ditemukan.</h2>
        <Button onClick={() => navigate("/berita")} className="bg-[#0f5132] text-white rounded-2xl px-8 h-12 font-black">
          Kembali ke Berita
        </Button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Link berhasil disalin ke clipboard!");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-poppins">

      {/* Hero Image */}
      <div className="relative h-80 md:h-[480px] overflow-hidden">
        <img
          src={article.image || PLACEHOLDER}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl text-sm font-black transition-all border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>

        {/* Category badge */}
        <div className="absolute top-6 right-6">
          <span className="px-4 py-1.5 bg-amber-400 text-green-950 text-[10px] font-black rounded-full uppercase tracking-widest">
            {article.category}
          </span>
        </div>

        {/* Title over image */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-medium">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(article.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {article.author}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Share */}
        <div className="flex justify-end mb-8">
          <Button onClick={handleShare} variant="outline" className="border-gray-200 text-gray-600 hover:bg-green-50 hover:text-[#0f5132] rounded-2xl px-5 h-11 font-bold gap-2">
            <Share2 className="w-4 h-4" /> Bagikan
          </Button>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 mb-8 border border-gray-50">
          <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line font-medium">
            {article.content}
          </p>
        </div>

        {/* Sections */}
        {article.sections && article.sections.length > 0 && (
          <div className="space-y-6 mb-8">
            {article.sections.map((section, i) => (
              <div key={i} className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-50">
                <h2 className="text-2xl font-black text-[#0f5132] mb-4 pb-4 border-b border-gray-100 flex items-center gap-3">
                  <Tag className="w-5 h-5 text-amber-500" />
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed font-medium">{section.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Gallery */}
        {article.gallery && article.gallery.length > 0 && (
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 mb-8 border border-gray-50">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Images className="w-6 h-6 text-[#0f5132]" />
              Galeri Foto
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {article.gallery.map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden aspect-square shadow-md group">
                  <img
                    src={img}
                    alt={`Galeri ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="text-center">
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 text-[#0f5132] font-black hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Berita
          </Link>
        </div>
      </div>
    </div>
  );
}
