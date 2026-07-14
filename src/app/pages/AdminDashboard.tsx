import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Users, Mail, CheckCircle2, Clock, Package,
  TrendingUp, ArrowRight, ShieldCheck, AlertCircle,
  Newspaper, ChevronRight, LayoutDashboard, Loader2
} from "lucide-react";
import { useOrganization } from "../context/OrganizationContext";
import { useInventory } from "../context/InventoryContext";
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

function StatCard({
  icon, label, value, sub, color, href,
}: {
  icon: React.ReactNode; label: string; value: number | string;
  sub?: string; color: string; href?: string;
}) {
  const inner = (
    <div className={`group relative overflow-hidden rounded-[2rem] p-7 shadow-xl border border-white flex flex-col justify-between min-h-[150px] hover:scale-[1.02] transition-all duration-300 cursor-pointer ${color}`}>
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

export function AdminDashboard() {
  const { managers, members } = useOrganization();
  const { items: inventoryItems } = useInventory();

  const [stats, setStats] = useState<any>({});
  const [last7Data, setLast7Data] = useState<number[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    api.getDashboardStats()
      .then(data => {
        setStats(data.stats);
        setLast7Data(data.last7.map((d: any) => d.count));
      })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  const activeMembers = members.filter(m => m.status === "Aktif").length;
  const ipnuManagers = managers.filter(m => m.type === "IPNU").length;
  const ippnuManagers = managers.filter(m => m.type === "IPPNU").length;
  const pendingLetters = parseInt(stats.pending_letters || '0');
  const doneLetters = parseInt(stats.done_letters || '0');
  const processingLetters = parseInt(stats.processing_letters || '0');

  const last7 = useMemo(() => getLast7Days(), []);
  const lettersByDay = last7Data.length === 7 ? last7Data : last7.map(() => 0);
  const maxBar = Math.max(...lettersByDay, 1);

  const totalPeople = ipnuManagers + ippnuManagers + activeMembers;
  const donutData = [
    { label: "IPNU", value: ipnuManagers, pct: totalPeople ? Math.round(ipnuManagers / totalPeople * 100) : 0, color: "#0f5132" },
    { label: "IPPNU", value: ippnuManagers, pct: totalPeople ? Math.round(ippnuManagers / totalPeople * 100) : 0, color: "#f59e0b" },
    { label: "Anggota", value: activeMembers, pct: totalPeople ? Math.round(activeMembers / totalPeople * 100) : 0, color: "#3b82f6" },
  ];
  let cumulative = 0;
  const donutGradient = donutData.map(d => {
    const start = cumulative;
    cumulative += d.pct;
    return `${d.color} ${start}% ${cumulative}%`;
  }).join(", ");

  const goodItems = inventoryItems.filter(i => i.condition === "Baik").length;
  const needsRepair = inventoryItems.filter(i => i.condition !== "Baik").length;

  return (
    <div className="bg-[#f8fafc] min-h-screen font-poppins pb-20">
      <div className="bg-[#0f5132] text-white pt-12 pb-8 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none flex items-end justify-end">
          <LayoutDashboard className="w-96 h-96 mb-4 mr-4" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-green-200 text-xs font-black uppercase tracking-[0.3em]">Dashboard Aktif</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 uppercase leading-none">Panel Admin</h1>
          <p className="text-green-100/70 text-lg font-medium">
            Selamat datang! Semua aktivitas organisasi terpantau di sini secara <span className="text-amber-400 font-black">real-time</span>.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-5">Ringkasan Data</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard icon={<Users className="w-6 h-6 text-white" />} label="Anggota Aktif" value={activeMembers} sub="orang" color="bg-[#0f5132] text-white" href="/admin/anggota" />
            <StatCard icon={<ShieldCheck className="w-6 h-6 text-white" />} label="Pengurus IPNU" value={ipnuManagers} sub="orang" color="bg-emerald-600 text-white" href="/admin/anggota" />
            <StatCard icon={<ShieldCheck className="w-6 h-6 text-white" />} label="Pengurus IPPNU" value={ippnuManagers} sub="orang" color="bg-teal-600 text-white" href="/admin/anggota" />
            <StatCard icon={<Clock className="w-6 h-6 text-white" />} label="Surat Menunggu" value={pendingLetters} sub="surat" color="bg-amber-500 text-white" href="/admin/surat" />
            <StatCard icon={<CheckCircle2 className="w-6 h-6 text-white" />} label="Surat Selesai" value={doneLetters} sub="surat" color="bg-blue-600 text-white" href="/admin/surat" />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      <div className="w-full bg-gradient-to-t from-[#0f5132] to-emerald-400 rounded-full transition-all duration-700"
                        style={{ height: `${heightPct}%`, minHeight: val > 0 ? "8px" : "0" }} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{shortDay(day)}</span>
                  </div>
                );
              })}
            </div>
          </div>

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
              {donutData.map(d => (
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

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-50 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900">Status Surat</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Gambaran Umum</p>
              </div>
            </div>
            <div className="p-8 space-y-4">
              {[
                { label: 'Menunggu', value: pendingLetters, color: 'bg-amber-400' },
                { label: 'Diproses', value: processingLetters, color: 'bg-blue-400' },
                { label: 'Selesai', value: doneLetters, color: 'bg-green-400' },
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
              <Link to="/admin/surat" className="flex items-center justify-center gap-2 text-sm font-black text-[#0f5132] hover:text-green-700 transition-colors">
                Kelola Surat <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-50 p-8">
            <h3 className="text-xl font-black text-gray-900 mb-6">Ringkasan Inventaris</h3>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { label: "Total Barang", value: inventoryItems.length, unit: "jenis", color: "text-[#0f5132]" },
                { label: "Total Unit", value: inventoryItems.reduce((s, i) => s + i.qty, 0), unit: "unit", color: "text-blue-600" },
                { label: "Kondisi Baik", value: inventoryItems.filter(i => i.condition === "Baik").reduce((s, i) => s + i.qty, 0), unit: "unit", color: "text-emerald-600" },
                { label: "Perlu Perbaikan", value: inventoryItems.filter(i => i.condition !== "Baik").reduce((s, i) => s + i.qty, 0), unit: "unit", color: "text-amber-600" },
              ].map((s, i) => (
                <div key={i} className="text-center p-5 bg-gray-50 rounded-[1.5rem]">
                  <div className={`text-3xl font-black ${s.color} mb-1`}>{s.value}</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
            <Link to="/admin/inventaris" className="flex items-center justify-center gap-2 text-sm font-black text-[#0f5132] hover:text-green-700 transition-colors">
              Kelola Inventaris <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-5">Akses Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Users className="w-7 h-7" />, label: "Kelola Anggota", sub: `${activeMembers} anggota`, href: "/admin/anggota", color: "from-[#0f5132] to-emerald-600" },
              { icon: <Mail className="w-7 h-7" />, label: "Kelola Surat", sub: `${pendingLetters} menunggu`, href: "/admin/surat", color: "from-blue-600 to-blue-700" },
              { icon: <Newspaper className="w-7 h-7" />, label: "Kelola Berita", sub: "Artikel & Kegiatan", href: "/admin/berita", color: "from-purple-600 to-purple-700" },
              { icon: <Package className="w-7 h-7" />, label: "Inventaris", sub: `${inventoryItems.length} jenis barang`, href: "/admin/inventaris", color: "from-amber-500 to-amber-600" },
            ].map(item => (
              <Link key={item.href} to={item.href} className={`bg-gradient-to-br ${item.color} text-white rounded-[2rem] p-6 shadow-xl hover:scale-[1.03] transition-all duration-300 group`}>
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
