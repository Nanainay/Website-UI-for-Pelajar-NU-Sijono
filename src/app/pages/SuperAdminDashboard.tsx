import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Users, Mail, CheckCircle2, Clock, Package,
  TrendingUp, ArrowRight, ShieldCheck, Newspaper,
  LayoutDashboard, Loader2, Shield, Settings, UserCog,
  LogIn, FileText, Eye
} from "lucide-react";
import { useOrganization } from "../context/OrganizationContext";
import { useInventory } from "../context/InventoryContext";
import { useNews } from "../context/NewsContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../../services/api";

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

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 4 && h < 11) return "Selamat Pagi";
  if (h >= 11 && h < 15) return "Selamat Siang";
  if (h >= 15 && h < 18) return "Selamat Sore";
  return "Selamat Malam";
}

function StatCard({
  icon, label, value, sub, color, href,
}: {
  icon: React.ReactNode; label: string; value: number | string;
  sub?: string; color: string; href?: string;
}) {
  const inner = (
    <div className={`group relative overflow-hidden rounded-[2rem] p-7 shadow-xl border border-white/20 flex flex-col justify-between min-h-[150px] hover:scale-[1.02] transition-all duration-300 cursor-pointer ${color}`}>
      <div className="flex justify-between items-start">
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">{icon}</div>
        <ArrowRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">{label}</p>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-black leading-none">{value}</span>
          {sub && <span className="text-xs font-bold opacity-60 mb-1">{sub}</span>}
        </div>
      </div>
    </div>
  );
  return href ? <Link to={href}>{inner}</Link> : <div>{inner}</div>;
}

export function SuperAdminDashboard() {
  const { managers, members } = useOrganization();
  const { items: inventoryItems } = useInventory();
  const { articles } = useNews();
  const { user } = useAuth();

  const [stats, setStats] = useState<any>({});
  const [last7Data, setLast7Data] = useState<number[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [apiUsers, setApiUsers] = useState<any[]>([]);

  useEffect(() => {
    api.getDashboardStats()
      .then((data) => {
        setStats(data.stats);
        setLast7Data(data.last7.map((d: any) => d.count));
      })
      .catch(() => {})
      .finally(() => setLoadingStats(false));

    api.getUsers()
      .then((data) => setApiUsers(data))
      .catch(() => {});
  }, []);

  const greeting = useMemo(() => getGreeting(), []);
  const activeMembers = members.filter((m) => m.status === "Aktif").length;
  const ipnuManagers = managers.filter((m) => m.type === "IPNU").length;
  const ippnuManagers = managers.filter((m) => m.type === "IPPNU").length;
  const pendingLetters = parseInt(stats.pending_letters || "0");
  const doneLetters = parseInt(stats.done_letters || "0");
  const processingLetters = parseInt(stats.processing_letters || "0");
  const publishedArticles = articles.filter((a) => a.status === "Published").length;

  const last7 = useMemo(() => getLast7Days(), []);
  const lettersByDay = last7Data.length === 7 ? last7Data : last7.map(() => 0);
  const maxBar = Math.max(...lettersByDay, 1);

  const totalPeople = ipnuManagers + ippnuManagers + activeMembers;
  const donutData = [
    { label: "IPNU", value: ipnuManagers, pct: totalPeople ? Math.round((ipnuManagers / totalPeople) * 100) : 0, color: "#0f5132" },
    { label: "IPPNU", value: ippnuManagers, pct: totalPeople ? Math.round((ippnuManagers / totalPeople) * 100) : 0, color: "#f59e0b" },
    { label: "Anggota", value: activeMembers, pct: totalPeople ? Math.round((activeMembers / totalPeople) * 100) : 0, color: "#3b82f6" },
  ];
  let cumulative = 0;
  const donutGradient = donutData
    .map((d) => {
      const start = cumulative;
      cumulative += d.pct;
      return `${d.color} ${start}% ${cumulative}%`;
    })
    .join(", ");

  return (
    <div className="bg-[#f8fafc] min-h-screen font-poppins pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white pt-12 pb-10 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none">
          <LayoutDashboard className="absolute bottom-4 right-8 w-80 h-80" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-gray-400 text-xs font-black uppercase tracking-[0.3em]">Super Admin Panel</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
            {greeting}, <span className="text-amber-400">{user?.name || "Admin"}</span>
          </h1>
          <p className="text-gray-300 text-lg font-medium max-w-2xl">
            Kontrol penuh atas seluruh sistem IPNU IPPNU Desa Sijono. Kelola anggota, pengurus, surat, berita, inventaris, dan akses login.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Stats */}
        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-5">Ringkasan Data</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard icon={<Users className="w-6 h-6 text-white" />} label="Anggota Aktif" value={activeMembers} sub="orang" color="bg-[#0f5132] text-white" href="/admin/anggota" />
            <StatCard icon={<ShieldCheck className="w-6 h-6 text-white" />} label="Pengurus IPNU" value={ipnuManagers} sub="orang" color="bg-emerald-600 text-white" href="/admin/anggota" />
            <StatCard icon={<ShieldCheck className="w-6 h-6 text-white" />} label="Pengurus IPPNU" value={ippnuManagers} sub="orang" color="bg-amber-600 text-white" href="/admin/anggota" />
            <StatCard icon={<Clock className="w-6 h-6 text-white" />} label="Surat Menunggu" value={pendingLetters} sub="surat" color="bg-orange-500 text-white" href="/admin/surat" />
            <StatCard icon={<Newspaper className="w-6 h-6 text-white" />} label="Berita Terbit" value={publishedArticles} sub="artikel" color="bg-blue-600 text-white" href="/admin/berita" />
            <StatCard icon={<Package className="w-6 h-6 text-white" />} label="Inventaris" value={inventoryItems.length} sub="jenis" color="bg-purple-600 text-white" href="/admin/inventaris" />
          </div>
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl p-8 border border-gray-50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900">Pengajuan Surat</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">7 Hari Terakhir</p>
              </div>
              <TrendingUp className="w-6 h-6 text-[#0f5132]" />
            </div>
            <div className="flex items-end justify-between gap-3 h-48">
              {last7.map((day, i) => {
                const val = lettersByDay[i];
                const heightPct = Math.max((val / maxBar) * 100, val === 0 ? 0 : 8);
                return (
                  <div key={day} className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-xs font-black text-gray-500">{val > 0 ? val : ""}</span>
                    <div className="w-full bg-gray-100 rounded-full flex flex-col justify-end overflow-hidden" style={{ height: "160px" }}>
                      <div className="w-full bg-gradient-to-t from-gray-800 to-gray-500 rounded-full transition-all duration-700"
                        style={{ height: `${heightPct}%`, minHeight: val > 0 ? "8px" : "0" }} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{shortDay(day)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Donut */}
          <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-50 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-black text-gray-900">Proporsi</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">IPNU : IPPNU : Anggota</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-40 h-40">
                <div className="w-full h-full rounded-full"
                  style={{ background: totalPeople > 0 ? `conic-gradient(${donutGradient})` : "conic-gradient(#e5e7eb 0% 100%)" }} />
                <div className="absolute inset-[22%] bg-white rounded-full flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <p className="text-2xl font-black text-gray-900 leading-none">{totalPeople}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              {donutData.map((d) => (
                <div key={d.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-sm font-bold text-gray-600">{d.label}</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{d.value} <span className="text-xs text-gray-400 font-medium">({d.pct}%)</span></span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Letter Status + User Accounts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Letter Status */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-50 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-xl font-black text-gray-900">Status Surat</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Gambaran Umum</p>
            </div>
            <div className="p-8 space-y-4">
              {[
                { label: "Menunggu", value: pendingLetters, color: "bg-amber-400" },
                { label: "Diproses", value: processingLetters, color: "bg-blue-400" },
                { label: "Selesai", value: doneLetters, color: "bg-green-400" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="text-gray-900">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} transition-all duration-700`}
                      style={{ width: `${Math.min((item.value / Math.max(pendingLetters + processingLetters + doneLetters, 1)) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100">
              <Link to="/admin/surat" className="flex items-center justify-center gap-2 text-sm font-black text-gray-700 hover:text-gray-900 transition-colors">
                Kelola Surat <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-50 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900">User Terdaftar</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">{apiUsers.length} akun</p>
              </div>
              <UserCog className="w-5 h-5 text-gray-400" />
            </div>
            <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
              {apiUsers.slice(0, 6).map((u: any) => (
                <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 font-black text-sm flex-shrink-0">
                    {u.name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{u.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{u.email}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    u.role === "super_admin" ? "bg-red-100 text-red-600" :
                    u.role === "ketua" ? "bg-amber-100 text-amber-700" :
                    u.role === "sekretaris" ? "bg-blue-100 text-blue-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100">
              <Link to="/admin/log-akses" className="flex items-center justify-center gap-2 text-sm font-black text-gray-700 hover:text-gray-900 transition-colors">
                Log Akses Login <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-5">Akses Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { icon: <Users className="w-7 h-7" />, label: "Kelola Anggota", sub: `${activeMembers} anggota`, href: "/admin/anggota", color: "from-[#0f5132] to-emerald-600" },
              { icon: <ShieldCheck className="w-7 h-7" />, label: "Pengurus", sub: `${ipnuManagers + ippnuManagers} orang`, href: "/admin/anggota", color: "from-teal-600 to-teal-700" },
              { icon: <Mail className="w-7 h-7" />, label: "Kelola Surat", sub: `${pendingLetters} menunggu`, href: "/admin/surat", color: "from-orange-500 to-orange-600" },
              { icon: <Newspaper className="w-7 h-7" />, label: "Kelola Berita", sub: `${publishedArticles} terbit`, href: "/admin/berita", color: "from-blue-600 to-blue-700" },
              { icon: <Package className="w-7 h-7" />, label: "Inventaris", sub: `${inventoryItems.length} jenis`, href: "/admin/inventaris", color: "from-purple-600 to-purple-700" },
              { icon: <LogIn className="w-7 h-7" />, label: "Log Akses", sub: `${apiUsers.length} user`, href: "/admin/log-akses", color: "from-rose-600 to-rose-700" },
              { icon: <Settings className="w-7 h-7" />, label: "Pengaturan", sub: "Backup & Sistem", href: "/admin/pengaturan", color: "from-gray-700 to-gray-800" },
            ].map((item) => (
              <Link key={item.href} to={item.href}
                className={`bg-gradient-to-br ${item.color} text-white rounded-[2rem] p-5 shadow-xl hover:scale-[1.03] transition-all duration-300 group`}>
                <div className="mb-3 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">{item.icon}</div>
                <p className="font-black text-sm">{item.label}</p>
                <p className="text-[10px] opacity-70 font-medium mt-0.5">{item.sub}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
