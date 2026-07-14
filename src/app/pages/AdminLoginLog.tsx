import { useState, useEffect } from "react";
import {
  LogIn, Search, Users, Shield, ShieldCheck, User,
  Crown, Loader2, RefreshCw, Clock, Calendar
} from "lucide-react";
import { Button } from "../components/ui/button";
import { api } from "../../services/api";
import { RoleBadge } from "../components/RoleBadge";

interface UserLog {
  id: string;
  name: string;
  email: string;
  role: string;
  role_id: number;
  nia: string;
  phone: string;
  created_at: string;
  last_sign_in_at?: string;
}

const roleIcons: Record<string, React.ReactNode> = {
  super_admin: <Shield className="w-4 h-4 text-red-500" />,
  ketua: <Crown className="w-4 h-4 text-amber-500" />,
  sekretaris: <ShieldCheck className="w-4 h-4 text-blue-500" />,
  anggota: <User className="w-4 h-4 text-green-500" />,
};

export function AdminLoginLog() {
  const [users, setUsers] = useState<UserLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("semua");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === "semua" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Stats
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "super_admin").length;
  const ketuaCount = users.filter((u) => u.role === "ketua").length;
  const sekretarisCount = users.filter((u) => u.role === "sekretaris").length;
  const anggotaCount = users.filter((u) => u.role === "anggota").length;

  function getRelativeTime(dateStr?: string) {
    if (!dateStr) return "Belum pernah login";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} hari lalu`;
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  }

  function isOnline(dateStr?: string) {
    if (!dateStr) return false;
    const diff = Date.now() - new Date(dateStr).getTime();
    return diff < 30 * 60 * 1000; // within 30 minutes
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen font-poppins pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white pt-12 pb-8 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none">
          <LogIn className="absolute bottom-4 right-8 w-64 h-64" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-gray-400 text-xs font-black uppercase tracking-[0.3em]">Super Admin</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black flex items-center gap-4 mb-2 uppercase tracking-tight">
            <LogIn className="w-10 h-10 text-amber-400" />
            Log Akses Login
          </h1>
          <p className="text-gray-300 text-lg font-medium">Monitor siapa saja yang telah login ke sistem.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Total User", value: totalUsers, icon: <Users className="w-5 h-5 text-white" />, color: "bg-gray-800 text-white" },
            { label: "Admin", value: adminCount, icon: <Shield className="w-5 h-5 text-white" />, color: "bg-red-600 text-white" },
            { label: "Ketua", value: ketuaCount, icon: <Crown className="w-5 h-5 text-white" />, color: "bg-amber-600 text-white" },
            { label: "Sekretaris", value: sekretarisCount, icon: <ShieldCheck className="w-5 h-5 text-white" />, color: "bg-blue-600 text-white" },
            { label: "Anggota", value: anggotaCount, icon: <User className="w-5 h-5 text-white" />, color: "bg-green-600 text-white" },
          ].map((s, i) => (
            <div key={i} className={`rounded-[1.5rem] p-5 shadow-lg ${s.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white/20 rounded-lg">{s.icon}</div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">{s.label}</p>
              <span className="text-2xl font-black">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-[2rem] shadow-xl flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Cari nama atau email..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 h-12 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-gray-100 transition-all font-medium text-sm" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="h-12 bg-gray-50 border-none rounded-xl px-5 font-bold text-gray-600 outline-none cursor-pointer focus:ring-4 focus:ring-gray-100">
            <option value="semua">Semua Role</option>
            <option value="super_admin">🔴 Super Admin</option>
            <option value="ketua">🟡 Ketua</option>
            <option value="sekretaris">🔵 Sekretaris</option>
            <option value="anggota">🟢 Anggota</option>
          </select>
          <Button onClick={loadUsers} variant="outline" className="h-12 px-6 rounded-xl font-bold gap-2" disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  {["User", "Email", "Role", "NIA", "No. HP", "Terdaftar Sejak", "Login Terakhir", "Status"].map((h) => (
                    <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-400 font-bold">Memuat data...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 font-bold">Tidak ada user ditemukan</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const online = isOnline(u.last_sign_in_at);
                    return (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 font-black text-sm flex-shrink-0 relative">
                              {u.name?.charAt(0) || "?"}
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                                online ? "bg-green-400" : "bg-gray-300"
                              }`} />
                            </div>
                            <span className="font-bold text-gray-900 text-sm">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">{u.email}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {roleIcons[u.role] || roleIcons.anggota}
                            <RoleBadge role={u.role} />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">{u.nia || "-"}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium whitespace-nowrap">{u.phone || "-"}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {getRelativeTime(u.last_sign_in_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            online ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                          }`}>
                            {online ? "Online" : "Offline"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
