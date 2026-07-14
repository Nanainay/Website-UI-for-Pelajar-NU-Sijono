import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import {
  Crown, CheckCircle2, Clock, Loader2, ArrowRight,
  FileText, Shield, X, Eye, ThumbsUp, AlertTriangle,
  Mail, TrendingUp
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLetters, LetterRequest } from "../context/LettersContext";
import { useOrganization } from "../context/OrganizationContext";
import { api } from "../../services/api";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 4 && h < 11) return "Selamat Pagi";
  if (h >= 11 && h < 15) return "Selamat Siang";
  if (h >= 15 && h < 18) return "Selamat Sore";
  return "Selamat Malam";
}

const statusConfig: Record<string, { label: string; color: string }> = {
  menunggu: { label: "Menunggu", color: "bg-amber-100 text-amber-700" },
  dicek_sekretaris: { label: "Diproses", color: "bg-blue-100 text-blue-700" },
  menunggu_ttd_ketua: { label: "Menunggu TTD", color: "bg-purple-100 text-purple-700" },
  selesai: { label: "Selesai", color: "bg-green-100 text-green-700" },
  ditolak: { label: "Ditolak", color: "bg-red-100 text-red-600" },
};

export function KetuaDashboard() {
  const { user, selectedOrg: authSelectedOrg, setSelectedOrg: setAuthSelectedOrg } = useAuth();
  const { requests, ttdKetuaLetter, tolakLetter, refreshLetters } = useLetters();
  const { managers } = useOrganization();
  
  const selectedOrg = authSelectedOrg || "IPNU";
  const setSelectedOrg = (org: "IPNU" | "IPPNU") => setAuthSelectedOrg(org);

  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState<any>({});

  const getDisplayName = () => {
    if (!user) return "Ketua";
    if (user.role === 'ketua') {
      const manager = managers.find(m => m.type === selectedOrg && m.position.toLowerCase() === 'ketua');
      if (manager) return manager.name;
    }
    return user.name;
  };
  const displayName = getDisplayName();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    refreshLetters();
    api.getDashboardStats()
      .then((data) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  const greeting = useMemo(() => getGreeting(), []);
  const waitingTTD = requests.filter((r) => r.status === "menunggu_ttd_ketua");
  const doneToday = requests.filter((r) => {
    if (r.status !== "selesai") return false;
    const today = new Date().toISOString().split("T")[0];
    return r.updated_at?.startsWith(today);
  });

  const handleReject = async () => {
    if (!rejectId || !rejectReason) {
      toast.error("Alasan penolakan wajib diisi");
      return;
    }
    setLoading(true);
    try {
      await tolakLetter(rejectId, rejectReason);
      toast.success("Surat ditolak");
      setShowRejectModal(false);
      setRejectReason("");
      setRejectId(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal menolak surat");
    } finally {
      setLoading(false);
    }
  };

  const openReject = (id: number) => {
    setRejectId(id);
    setShowRejectModal(true);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-poppins pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-600 text-white pt-12 pb-10 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none select-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <Crown className="absolute bottom-4 right-8 w-64 h-64 opacity-[0.08]" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
            <span className="text-amber-200 text-xs font-black uppercase tracking-[0.3em]">Dashboard Ketua</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
            {greeting}, <span className="text-yellow-200">{displayName}</span>
          </h1>
          <p className="text-amber-100/80 text-lg font-medium max-w-2xl">
            Review dan setujui pengajuan surat yang telah diproses oleh sekretaris. Pilih organisasi untuk menandatangani.
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
                  <h3 className="text-2xl font-black">Ketua IPNU</h3>
                  <p className={`text-sm font-medium ${selectedOrg === "IPNU" ? "text-green-200" : "text-gray-500"}`}>
                    Ikatan Pelajar Nahdlatul Ulama
                  </p>
                </div>
              </div>
              {selectedOrg === "IPNU" && (
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span className="text-sm font-black text-emerald-200">AKTIF — TTD atas nama Ketua IPNU</span>
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
                  <Crown className={`w-8 h-8 ${selectedOrg === "IPPNU" ? "text-white" : "text-amber-600"}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Ketua IPPNU</h3>
                  <p className={`text-sm font-medium ${selectedOrg === "IPPNU" ? "text-amber-100" : "text-gray-500"}`}>
                    Ikatan Pelajar Putri Nahdlatul Ulama
                  </p>
                </div>
              </div>
              {selectedOrg === "IPPNU" && (
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-200" />
                  <span className="text-sm font-black text-amber-100">AKTIF — TTD atas nama Ketua IPPNU</span>
                </div>
              )}
            </button>
          </div>
        </section>

        {/* Stats */}
        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-5">Statistik</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Menunggu TTD", value: waitingTTD.length, icon: <Clock className="w-6 h-6 text-white" />, color: "bg-purple-600 text-white" },
              { label: "Disetujui Hari Ini", value: doneToday.length, icon: <CheckCircle2 className="w-6 h-6 text-white" />, color: "bg-emerald-600 text-white" },
              { label: "Total Selesai", value: stats.done_letters || 0, icon: <Mail className="w-6 h-6 text-white" />, color: "bg-amber-600 text-white" },
            ].map((s, i) => (
              <div key={i} className={`relative overflow-hidden rounded-[2rem] p-6 shadow-xl border border-white/20 ${s.color}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">{s.icon}</div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">{s.label}</p>
                <span className="text-3xl font-black leading-none">
                  {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : s.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Waiting Letters */}
        <section className="bg-white rounded-[2rem] shadow-xl border border-gray-50 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Surat Menunggu Persetujuan
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                Sebagai Ketua {selectedOrg} — {waitingTTD.length} surat
              </p>
            </div>
            <Link to="/admin/surat" className="text-sm font-black text-purple-600 hover:text-purple-700 flex items-center gap-1">
              Lihat Detail <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {waitingTTD.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 rotate-6">
                <CheckCircle2 className="w-10 h-10 text-green-400 -rotate-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Semua Sudah Disetujui!</h3>
              <p className="text-gray-400 font-medium">Tidak ada surat yang menunggu tanda tangan Anda.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {waitingTTD.map((letter) => (
                <div key={letter.id} className="p-6 hover:bg-purple-50/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-black text-lg flex-shrink-0">
                          {letter.user_name?.charAt(0) || "?"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-gray-900 text-sm">{letter.user_name}</h4>
                          <p className="text-xs text-purple-600 font-bold">{letter.type}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 ml-[52px]">{letter.purpose}</p>
                      <span className="text-[10px] font-bold text-gray-400 ml-[52px] block mt-1">
                        Diajukan: {new Date(letter.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ml-[52px] md:ml-0">
                      <Link to="/admin/surat">
                        <Button className="h-10 px-5 rounded-xl font-black bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5">
                          <ThumbsUp className="w-4 h-4" /> Berikan TTD
                        </Button>
                      </Link>
                      <Button variant="outline" onClick={() => openReject(letter.id)}
                        className="h-10 px-4 rounded-xl font-bold border-red-200 text-red-600 hover:bg-red-50 text-xs gap-1.5">
                        <X className="w-4 h-4" /> Tolak
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Access */}
        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-5">Akses Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: <FileText className="w-7 h-7" />, label: "Kelola Surat", sub: `${waitingTTD.length} menunggu TTD`, href: "/admin/surat", color: "from-purple-600 to-purple-700" },
              { icon: <Eye className="w-7 h-7" />, label: "Lihat Berita", sub: "Halaman publik", href: "/berita", color: "from-blue-600 to-blue-700" },
              { icon: <TrendingUp className="w-7 h-7" />, label: "Beranda", sub: "Halaman utama", href: "/", color: "from-[#0f5132] to-emerald-600" },
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

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowRejectModal(false)}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Tolak Surat</h3>
            <p className="text-gray-500 font-medium mb-4">Berikan alasan penolakan.</p>
            <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Alasan penolakan..."
              className="min-h-[120px] border-gray-100 bg-gray-50 rounded-xl mb-4" />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowRejectModal(false)} className="flex-1 h-12 rounded-2xl font-bold">Batal</Button>
              <Button onClick={handleReject} disabled={loading || !rejectReason}
                className="flex-1 h-12 rounded-2xl font-black bg-red-600 hover:bg-red-700 text-white">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                TOLAK SURAT
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
