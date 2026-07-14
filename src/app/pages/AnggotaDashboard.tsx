import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import {
  Home, FileText, Newspaper, Package, Users, Info,
  Clock, CheckCircle2, Send, ArrowRight, History,
  Loader2, Eye, UserCheck, BookOpen
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLetters, LetterRequest } from "../context/LettersContext";
import { useNews } from "../context/NewsContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const statusColors: Record<string, string> = {
  menunggu: "bg-amber-100 text-amber-700",
  dicek_sekretaris: "bg-blue-100 text-blue-700",
  menunggu_ttd_ketua: "bg-purple-100 text-purple-700",
  selesai: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-600",
};
const statusLabels: Record<string, string> = {
  menunggu: "Menunggu",
  dicek_sekretaris: "Diproses",
  menunggu_ttd_ketua: "TTD Ketua",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 4 && h < 11) return "Selamat Pagi";
  if (h >= 11 && h < 15) return "Selamat Siang";
  if (h >= 15 && h < 18) return "Selamat Sore";
  return "Selamat Malam";
}

export function AnggotaDashboard() {
  const { user } = useAuth();
  const { getMyLetters } = useLetters();
  const { articles } = useNews();
  const [myLetters, setMyLetters] = useState<LetterRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const letters = await getMyLetters();
      setMyLetters(letters);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const greeting = useMemo(() => getGreeting(), []);
  const pending = myLetters.filter((l) => l.status === "menunggu").length;
  const done = myLetters.filter((l) => l.status === "selesai").length;
  const latestNews = articles.filter((a) => a.status === "Published").slice(0, 3);

  const quickActions = [
    { icon: Send, label: "Ajukan Surat", sub: "Buat pengajuan baru", href: "/layanan-surat", color: "from-[#0f5132] to-emerald-600" },
    { icon: Newspaper, label: "Baca Berita", sub: "Artikel terbaru", href: "/berita", color: "from-blue-600 to-blue-700" },
    { icon: Package, label: "Inventaris", sub: "Daftar barang", href: "/inventaris", color: "from-amber-500 to-amber-600" },
    { icon: Info, label: "Tentang Kita", sub: "Profil organisasi", href: "/tentang-kita", color: "from-purple-600 to-purple-700" },
    { icon: Users, label: "Struktur Pengurus", sub: "BPH IPNU IPPNU", href: "/struktur-pengurus", color: "from-teal-600 to-teal-700" },
    { icon: UserCheck, label: "Gabung Anggota", sub: "Daftar sekarang", href: "/gabung-anggota", color: "from-rose-500 to-rose-600" },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen font-poppins pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0f5132] via-green-800 to-emerald-700 text-white pt-12 pb-10 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none select-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-green-200 text-xs font-black uppercase tracking-[0.3em]">Dashboard Anggota</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
            {greeting}, <span className="text-amber-300">{user?.name || "Anggota"}</span> 👋
          </h1>
          <p className="text-green-100/80 text-lg font-medium max-w-2xl">
            Selamat datang di sistem informasi IPNU IPPNU Desa Sijono. Anda bisa mengajukan surat, membaca berita, dan mengakses informasi organisasi.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Stats */}
        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-5">Ringkasan Anda</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Pengajuan", value: myLetters.length, icon: <FileText className="w-6 h-6 text-white" />, color: "bg-[#0f5132] text-white" },
              { label: "Menunggu", value: pending, icon: <Clock className="w-6 h-6 text-white" />, color: "bg-amber-500 text-white" },
              { label: "Selesai", value: done, icon: <CheckCircle2 className="w-6 h-6 text-white" />, color: "bg-emerald-600 text-white" },
              { label: "Berita Tersedia", value: latestNews.length, icon: <Newspaper className="w-6 h-6 text-white" />, color: "bg-blue-600 text-white" },
            ].map((s, i) => (
              <div key={i} className={`relative overflow-hidden rounded-[2rem] p-6 shadow-xl border border-white/20 ${s.color} hover:scale-[1.02] transition-all duration-300`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">{s.icon}</div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">{s.label}</p>
                <span className="text-3xl font-black leading-none">{loading ? <Loader2 className="w-6 h-6 animate-spin" /> : s.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-5">Akses Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.href} to={a.href}
                  className={`bg-gradient-to-br ${a.color} text-white rounded-[2rem] p-5 shadow-xl hover:scale-[1.04] hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between min-h-[140px]`}>
                  <div className="mb-3 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-black text-sm leading-tight">{a.label}</p>
                    <p className="text-[10px] opacity-70 font-medium mt-0.5">{a.sub}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Letters & News */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Letters */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-50 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">Riwayat Surat Anda</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">5 terbaru</p>
              </div>
              <History className="w-5 h-5 text-[#0f5132]" />
            </div>
            <div className="p-5 space-y-3">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-300 mx-auto" />
                </div>
              ) : myLetters.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-medium">Belum ada pengajuan</p>
                  <Link to="/layanan-surat" className="text-[#0f5132] font-bold text-sm mt-2 inline-block hover:underline">
                    Ajukan Sekarang →
                  </Link>
                </div>
              ) : (
                myLetters.slice(0, 5).map((l) => (
                  <div key={l.id} className="p-4 rounded-2xl border border-gray-100 hover:border-green-100 transition-colors">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="font-bold text-gray-800 text-sm">{l.type}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${statusColors[l.status] || "bg-gray-100 text-gray-600"}`}>
                        {statusLabels[l.status] || l.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{l.purpose}</p>
                    <span className="text-[10px] font-bold text-gray-400 mt-1 block">
                      {new Date(l.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-gray-100">
              <Link to="/layanan-surat" className="flex items-center justify-center gap-2 text-sm font-black text-[#0f5132] hover:text-green-700 transition-colors">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Latest News */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-50 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">Berita Terbaru</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Artikel & Kegiatan</p>
              </div>
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div className="p-5 space-y-3">
              {latestNews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Newspaper className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-medium">Belum ada berita</p>
                </div>
              ) : (
                latestNews.map((n) => (
                  <Link key={n.id} to={`/berita/${n.id}`}
                    className="block p-4 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
                    <div className="flex gap-4">
                      {n.image ? (
                        <img src={n.image} alt={n.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Newspaper className="w-6 h-6 text-blue-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm line-clamp-2 group-hover:text-blue-700 transition-colors">{n.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-green-50 text-green-700">{n.category}</span>
                          <span className="text-[10px] font-bold text-gray-400">{new Date(n.date).toLocaleDateString("id-ID")}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <div className="p-4 border-t border-gray-100">
              <Link to="/berita" className="flex items-center justify-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700 transition-colors">
                Semua Berita <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
