import { Link } from "react-router";
import { Plus, Eye, Edit2, Trash2, Calendar, User, Search, Newspaper, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNews } from "../context/NewsContext";
import { useState } from "react";
import { toast } from "sonner";

export function AdminNews() {
  const { articles, loading, deleteArticle } = useNews();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredArticles = articles.filter(art => 
    art.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
      deleteArticle(deleteId);
      toast.success("Artikel berhasil dihapus!");
      setDeleteId(null);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-poppins pb-20">
      {/* Page Header Area */}
      <div className="bg-[#0f5132] text-white pt-12 pb-24 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                <h1 className="text-4xl md:text-5xl font-black flex items-center gap-4 mb-2">
                    <Newspaper className="w-10 h-10 text-amber-400" />
                    Manajemen Berita
                </h1>
                <p className="text-green-100/80 text-lg">Publikasikan kegiatan dan informasi terbaru organisasi Anda.</p>
            </div>
            <Link to="/admin/berita/tambah" className="animate-in fade-in slide-in-from-right-4 duration-700">
                <Button className="bg-amber-400 hover:bg-amber-500 text-green-950 rounded-2xl shadow-xl shadow-amber-400/20 px-8 h-14 font-black flex items-center gap-3 transition-all hover:scale-105 active:scale-95">
                    <Plus className="w-6 h-6" />
                    BUAT ARTIKEL BARU
                </Button>
            </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-12">
        {/* Delete Confirmation Modal */}
        {deleteId && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-green-950/40 backdrop-blur-md p-4">
            <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300 border border-green-50">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                    <Trash2 className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 text-center mb-4 leading-tight">Hapus Artikel?</h2>
                <p className="text-gray-500 text-center mb-10 leading-relaxed">
                Tindakan ini akan menghapus data secara permanen dan tidak dapat dipulihkan. Apakah Anda yakin?
                </p>
                <div className="flex gap-4">
                <Button 
                    onClick={() => setDeleteId(null)} 
                    variant="outline" 
                    className="flex-1 rounded-2xl h-14 font-bold border-gray-100 hover:bg-gray-50"
                >
                    Batal
                </Button>
                <Button 
                    onClick={handleDelete} 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl h-14 font-bold shadow-lg shadow-red-600/20"
                >
                    Ya, Hapus
                </Button>
                </div>
            </div>
            </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-xl shadow-green-900/5 border border-white mb-10 flex flex-wrap gap-4 items-center animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
            <div className="relative flex-1 min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Cari artikel berdasarkan judul..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 h-14 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-green-100 transition-all text-lg font-medium"
                />
            </div>
            <div className="flex gap-4">
                <select className="h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-4 focus:ring-green-100 font-bold text-gray-600 outline-none cursor-pointer">
                    <option>Semua Kategori</option>
                    <option>Kaderisasi</option>
                    <option>Kegiatan</option>
                    <option>Organisasi</option>
                </select>
                <div className="hidden sm:flex h-14 items-center px-4 bg-green-50 rounded-2xl">
                    <span className="text-sm font-black text-[#0f5132] uppercase tracking-widest">{filteredArticles.length} Artikel</span>
                </div>
            </div>
        </div>

        {/* Articles Content */}
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3].map(i => (
                    <div key={i} className="bg-white h-[400px] rounded-[2.5rem] animate-pulse border border-gray-100 shadow-sm" />
                ))}
            </div>
        ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
                <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-gray-400">Tidak ada artikel ditemukan</h3>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                {filteredArticles.map((article) => (
                    <div key={article.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-green-100 transition-all duration-500 group relative flex flex-col">
                        <div className="aspect-[16/10] relative overflow-hidden">
                            <img 
                                src={article.image || "https://images.unsplash.com/photo-1523240715630-1a1bb4a1eebe?q=80&w=800&auto=format&fit=crop"} 
                                alt={article.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                            <div className="absolute top-6 right-6">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg backdrop-blur-md ${
                                article.status === 'Published' ? 'bg-green-500/90 text-white' : 'bg-amber-400/90 text-green-950'
                                }`}>
                                {article.status}
                                </span>
                            </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <Tag className="w-3 h-3 text-amber-500" />
                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">{article.category}</span>
                            </div>
                            
                            <h3 className="text-2xl font-black text-gray-900 line-clamp-2 leading-[1.3] group-hover:text-[#0f5132] transition-colors mb-6">
                                {article.title}
                            </h3>
                            
                            <div className="flex items-center justify-between text-xs font-bold text-gray-400 mt-auto pt-6 border-t border-gray-50">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#0f5132]/40" />
                                    {new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#0f5132]/40" />
                                    {article.author}
                                </div>
                            </div>
                            
                            {/* Hover Actions Layer */}
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-white via-white to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex gap-3">
                                <Link to={`/admin/berita/${article.id}`} className="flex-1">
                                    <Button className="w-full bg-[#0f5132] hover:bg-green-900 text-white rounded-2xl h-14 font-black transition-all">
                                        LIHAT DETAIL
                                    </Button>
                                </Link>
                                <Link to={`/admin/berita/edit/${article.id}`}>
                                    <Button variant="outline" className="w-14 h-14 border-gray-100 rounded-2xl hover:bg-green-50 hover:text-[#0f5132] p-0 flex items-center justify-center">
                                        <Edit2 className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setDeleteId(article.id)}
                                    className="w-14 h-14 border-gray-100 rounded-2xl hover:bg-red-50 hover:text-red-600 p-0 flex items-center justify-center"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}

import { Tag } from "lucide-react";




