import { useParams, Link } from "react-router";
import { useNews } from "../context/NewsContext";
import { ArrowLeft, Info, FileText, MessageSquare, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { ArticleHeader } from "../components/news/ArticleHeader";
import { ArticleSection } from "../components/news/ArticleSection";
import { PhotoGallery } from "../components/news/PhotoGallery";

export function AdminNewsDetail() {
  const { id } = useParams();
  const { getArticle } = useNews();
  const article = getArticle(id || "");

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md w-full">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-black font-poppins text-gray-900 mb-2">Artikel Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">Maaf, data artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
          <Link to="/admin/berita">
            <Button className="w-full bg-[#0f5132] hover:bg-green-900 text-white rounded-xl h-12 font-bold shadow-lg shadow-green-900/20">
              Kembali ke Daftar Berita
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sectionIcons: Record<string, any> = {
    "Tujuan Kegiatan": <Info />,
    "Materi dan Narasumber": <FileText />,
    "Kesan Peserta": <MessageSquare />,
    "Penutup": <CheckCircle2 />
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-poppins pb-20">
      {/* Dynamic Header */}
      <ArticleHeader 
        title={article.title}
        date={article.date}
        author={article.author}
        category={article.category}
      />

      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
        <nav className="flex items-center gap-2 mb-8 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-white w-fit">
          <Link to="/admin/berita" className="text-gray-500 hover:text-[#0f5132] transition-colors">Admin</Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <Link to="/admin/berita" className="text-gray-500 hover:text-[#0f5132] transition-colors">Berita</Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-[#0f5132] font-bold">Detail Artikel</span>
        </nav>

        <div className="space-y-10">
          {/* Main Content */}
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-green-900/5 border border-green-50">
            <div className="prose prose-lg prose-green max-w-none">
              <p className="text-gray-700 leading-[1.8] text-lg whitespace-pre-line first-letter:text-5xl first-letter:font-black first-letter:text-[#0f5132] first-letter:mr-3 first-letter:float-left">
                {article.content}
              </p>
            </div>
          </div>

          {/* Special Sections */}
          {article.sections && article.sections.length > 0 && (
            <div className="grid grid-cols-1 gap-8">
              {article.sections.map((section, index) => (
                <ArticleSection 
                  key={index} 
                  title={section.title} 
                  icon={sectionIcons[section.title] || <Info />}
                >
                  <p className={section.title === "Kesan Peserta" ? "font-playfair italic text-xl text-gray-600 border-l-4 border-amber-400 pl-6 py-2 bg-amber-50/30" : ""}>
                    {section.content}
                  </p>
                </ArticleSection>
              ))}
            </div>
          )}

          {/* Photo Gallery */}
          {article.gallery && article.gallery.length > 0 && (
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-green-900/5 border border-green-50">
                <PhotoGallery images={article.gallery} />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-green-100 shadow-lg shadow-green-900/5">
            <div className="text-center sm:text-left">
                <h4 className="font-black text-[#0f5132] mb-1">Butuh Perubahan?</h4>
                <p className="text-sm text-gray-500">Anda dapat memperbarui informasi artikel ini kapan saja.</p>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
                <Link to={`/admin/berita/edit/${article.id}`} className="flex-1">
                    <Button className="w-full bg-[#0f5132] hover:bg-green-900 text-white px-8 h-12 rounded-xl font-bold transition-all hover:scale-105 active:scale-95">
                        Edit Artikel
                    </Button>
                </Link>
                <Button variant="outline" className="flex-1 sm:flex-none border-green-100 text-[#0f5132] hover:bg-green-50 px-8 h-12 rounded-xl font-bold">
                    Bagikan
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

