import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import {
  Mail, Clock, CheckCircle2, Loader2, ArrowRight,
  TrendingUp, Inbox, FileText, Send, AlertCircle,
  Shield, Eye, Package, Newspaper
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLetters, LetterRequest } from "../context/LettersContext";
import { useOrganization } from "../context/OrganizationContext";
import { api } from "../../services/api";

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 4 && h < 11) return "Selamat Pagi";
  if (h >= 11 && h < 15) return "Selamat Siang";
  if (h >= 15 && h < 18) return "Selamat Sore";
  return "Selamat Malam";
}

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}

function shortDay(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", { weekday: "short", day: "numeric" });
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  menunggu: { label: "Menunggu", color: "bg-amber-100 text-amber-700", icon: <Clock className="w-3 h-3" /> },
  dicek_sekretaris: { label: "Diproses", color: "bg-blue-100 text-blue-700", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  menunggu_ttd_ketua: { label: "TTD Ketua", color: "bg-purple-100 text-purple-700", icon: <Clock className="w-3 h-3" /> },
  selesai: { label: "Selesai", color: "bg-green-100 text-green-700", icon: <CheckCircle2 className="w-3 h-3" /> },
  ditolak: { label: "Ditolak", color: "bg-red-100 text-red-600", icon: <AlertCircle className="w-3 h-3" /> },
};

export function SekretarisDashboard() {
  const { user, selectedOrg: authSelectedOrg, setSelectedOrg: setAuthSelectedOrg } = useAuth();
  const { requests, refreshLetters } = useLetters();
  const { managers } = useOrganization();
  const [stats, setStats] = useState<any>({});
  const [last7Data, setLast7Data] = useState<number[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const selectedOrg = authSelectedOrg || "IPNU";
  const setSelectedOrg = (org: "IPNU" | "IPPNU") => setAuthSelectedOrg(org);

  const getDisplayName = () => {
    if (!user) return "Sekretaris";
    if (user.role === 'sekretaris' && selectedOrg) {
      const manager = managers.find(m => m.type === selectedOrg && m.position.toLowerCase() === 'sekretaris');
      if (manager) return manager.name;
    }
    return user.name;
  };
  const displayName = getDisplayName();

  useEffect(() => {
    refreshLetters();
    api.getDashboardStats()
      .then((data) => {
        setStats(data.stats);
        setLast7Data(data.last7.map((d: any) => d.count));
      })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  const greeting = useMemo(() => getGreeting(), []);
  const pendingLetters = requests.filter((r) => r.status === "menunggu");
  const processingLetters = requests.filter((r) => r.status === "dicek_sekretaris" || r.status === "menunggu_ttd_ketua");
  const doneLetters = requests.filter((r) => r.status === "selesai");

  const last7 = useMemo(() => getLast7Days(), []);
  const lettersByDay = last7Data.length === 7 ? last7Data : last7.map(() => 0);
  const maxBar = Math.max(...lettersByDay, 1);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-poppins pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-700 text-white pt-12 pb-10 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none select-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
            <span className="text-blue-200 text-xs font-black uppercase tracking-[0.3em]">Dashboard Sekretaris {selectedOrg}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
            {greeting}, <span className="text-blue-200">{displayName}</span>
          </h1>
          <p className="text-blue-100/80 text-lg font-medium max-w-2xl">
            Kelola pengajuan surat masuk, proses dokumen, dan kirim ke ketua untuk persetujuan.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Organization Selector */}
        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-5">Pilih Organisasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IPNU Card */}
            <button onClick={() => setSelectedOrg("IPNU")}
              className={`relative overflow-hidden rounded-[2.5rem] p-8 text-left transition-all duration-500 group cursor-pointer border-4 ${
                selectedOrg === "IPNU"
                  ? "bg-gradient-to-br from-[#0f5132] to-emerald-600 text-white border-emerald-400 shadow-2xl shadow-green-500/20 scale-[1.02]"
                  : "bg-white text-gray-700 border-transparent shadow-xl hover:border-green-200 hover:shadow-2xl"
              }`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                  selectedOrg === "IPNU" ? "bg-white/20" : "bg-green-50"
                }`}>
                  <Shield className={`w-8 h-8 ${selectedOrg === "IPNU" ? "text-white" : "text-[#0f5132]"}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Sekretaris IPNU</h3>
                  <p className={`text-sm font-medium ${selectedOrg === "IPNU" ? "text-green-200" : "text-gray-500"}`}>
                    Ikatan Pelajar Nahdlatul Ulama
                  </p>
                </div>
              </div>
              {selectedOrg === "IPNU" && (
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span className="text-sm font-black text-emerald-200">AKTIF — Akses panel Sekretaris IPNU</span>
                </div>
              )}
            </button>

            {/* IPPNU Card */}
            <button onClick={() => setSelectedOrg("IPPNU")}
              className={`relative overflow-hidden rounded-[2.5rem] p-8 text-left transition-all duration-500 group cursor-pointer border-4 ${
                selectedOrg === "IPPNU"
                  ? "bg-gradient-to-br from-amber-500 to-yellow-500 text-white border-amber-300 shadow-2xl shadow-amber-500/20 scale-[1.02]"
                  : "bg-white text-gray-700 border-transparent shadow-xl hover:border-amber-200 hover:shadow-2xl"
              }`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                  selectedOrg === "IPPNU" ? "bg-white/20" : "bg-amber-50"
                }`}>
                  <Shield className={`w-8 h-8 ${selectedOrg === "IPPNU" ? "text-white" : "text-amber-600"}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Sekretaris IPPNU</h3>
                  <p className={`text-sm font-medium ${selectedOrg === "IPPNU" ? "text-amber-100" : "text-gray-500"}`}>
                    Ikatan Pelajar Putri Nahdlatul Ulama
                  </p>
                </div>
              </div>
              {selectedOrg === "IPPNU" && (
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-200" />
                  <span className="text-sm font-black text-amber-100">AKTIF — Akses panel Sekretaris IPPNU</span>
                </div>
              )}
            </button>
          </div>
        </section>

        {/* Stats */}
        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-5">Ringkasan Surat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Surat Masuk Baru", value: pendingLetters.length, icon: <Inbox className="w-6 h-6 text-white" />, color: "bg-amber-500 text-white", href: "/admin/surat" },
              { label: "Sedang Diproses", value: processingLetters.length, icon: <Loader2 className="w-6 h-6 text-white" />, color: "bg-blue-600 text-white", href: "/admin/surat" },
              { label: "Surat Selesai", value: doneLetters.length, icon: <CheckCircle2 className="w-6 h-6 text-white" />, color: "bg-emerald-600 text-white", href: "/admin/surat" },
              { label: "Total Surat", value: requests.length, icon: <Mail className="w-6 h-6 text-white" />, color: "bg-indigo-600 text-white", href: "/admin/surat" },
            ].map((s) => (
              <Link key={s.label} to={s.href!}
                className={`group relative overflow-hidden rounded-[2rem] p-6 shadow-xl border border-white/20 ${s.color} hover:scale-[1.02] transition-all duration-300`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">{s.icon}</div>
                  <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">{s.label}</p>
                <span className="text-3xl font-black leading-none">
                  {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : s.value}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl p-8 border border-gray-50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900">Pengajuan Surat</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">7 Hari Terakhir</p>
              </div>
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-end justify-between gap-3 h-48">
              {last7.map((day, i) => {
                const val = lettersByDay[i];
                const heightPct = Math.max((val / maxBar) * 100, val === 0 ? 0 : 8);
                return (
                  <div key={day} className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-xs font-black text-gray-500">{val > 0 ? val : ""}</span>
                    <div className="w-full bg-gray-100 rounded-full flex flex-col justify-end overflow-hidden" style={{ height: "160px" }}>
                      <div className="w-full bg-gradient-to-t from-blue-700 to-blue-400 rounded-full transition-all duration-700"
                        style={{ height: `${heightPct}%`, minHeight: val > 0 ? "8px" : "0" }} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{shortDay(day)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Letters Quick View */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-50 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Inbox className="w-5 h-5 text-amber-500" />
                Surat Menunggu
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                {pendingLetters.length} pengajuan baru
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[300px]">
              {pendingLetters.length === 0 ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-10 h-10 text-green-300 mx-auto mb-3" />
                  <p className="text-gray-400 font-bold text-sm">Semua surat telah diproses!</p>
                </div>
              ) : (
                pendingLetters.slice(0, 8).map((l) => (
                  <div key={l.id} className="p-3.5 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-800 text-xs line-clamp-1">{l.user_name}</h4>
                      <span className="text-[9px] font-black text-gray-400">
                        {new Date(l.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#0f5132] font-bold line-clamp-1">{l.type}</p>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-gray-100">
              <Link to="/admin/surat" className="flex items-center justify-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700 transition-colors">
                Proses Surat <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-5">Akses Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <FileText className="w-7 h-7" />, label: "Proses Surat", sub: `${pendingLetters.length} menunggu`, href: "/admin/surat", color: "from-blue-600 to-blue-700" },
              { icon: <Newspaper className="w-7 h-7" />, label: "Kelola Berita", sub: "Artikel & Kegiatan", href: "/admin/berita", color: "from-purple-600 to-purple-700" },
              { icon: <Package className="w-7 h-7" />, label: "Inventaris", sub: "Kelola barang", href: "/admin/inventaris", color: "from-amber-500 to-amber-600" },
              { icon: <Eye className="w-7 h-7" />, label: "Lihat Berita", sub: "Halaman publik", href: "/berita", color: "from-teal-600 to-teal-700" },
            ].map((item) => (
              <Link key={item.href} to={item.href}
                className={`bg-gradient-to-br ${item.color} text-white rounded-[2rem] p-6 shadow-xl hover:scale-[1.03] transition-all duration-300 group`}>
                <div className="mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">{item.icon}</div>
                <p className="font-black text-base">{item.label}</p>
                <p className="text-[11px] opacity-70 font-medium mt-0.5">{item.sub}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
