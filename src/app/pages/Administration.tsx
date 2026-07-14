import React, { useState, useEffect } from "react";
import {
  Users, UserCheck, ShieldCheck, Search, Plus,
  Edit2, Trash2, Phone, MapPin, Calendar, Info, X, MessageCircle,
  CheckCircle, XCircle, UserCog, Save
} from "lucide-react";
import { useOrganization, Manager, Member } from "../context/OrganizationContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { RoleBadge } from "../components/RoleBadge";
import { useAuth } from "../context/AuthContext";
import { api } from "../../services/api";

type ManagerForm = { name: string; position: string; period: string; photo: string; type: "IPNU" | "IPPNU"; nia: string };
type MemberForm = {
  name: string; address: string; phone: string;
  status: "Aktif" | "Cuti" | "Keluar" | "Pending" | "Ditolak";
  email: string; age: string; gender: string; education: string; organization: string;
  rejectionReason: string; nia: string;
};

const EMPTY_MANAGER: ManagerForm = { name: "", position: "", period: "2024-2026", photo: "", type: "IPNU", nia: "" };
const EMPTY_MEMBER: MemberForm = {
  name: "", address: "", phone: "", status: "Aktif",
  email: "", age: "", gender: "", education: "", organization: "", rejectionReason: "", nia: ""
};

interface ApiUser {
  id: number; name: string; email: string; role_name: string; role_id: string; nia: string; phone: string; photo: string;
}

export function Administration() {
  const { managers, members, addManager, updateManager, deleteManager, addMember, updateMember, deleteMember } = useOrganization();
  const { hasRole } = useAuth();

  const [activeTab, setActiveTab] = useState<"IPNU" | "IPPNU" | "Anggota" | "Role">("Anggota");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mgrForm, setMgrForm] = useState<ManagerForm>(EMPTY_MANAGER);
  const [memForm, setMemForm] = useState<MemberForm>(EMPTY_MEMBER);

  const [apiUsers, setApiUsers] = useState<ApiUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const [showApiUserModal, setShowApiUserModal] = useState(false);
  const [editingApiUser, setEditingApiUser] = useState<ApiUser | null>(null);
  const [apiUserForm, setApiUserForm] = useState({ name: "", email: "", password: "", role_id: 4 });

  useEffect(() => {
    if (activeTab === 'Role') {
      loadApiUsers();
    }
  }, [activeTab]);

  const loadApiUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await api.getUsers();
      setApiUsers(data);
    } catch (err: any) {
      toast.error('Gagal memuat data user');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRoleChange = async (userId: number, roleId: number) => {
    try {
      await api.updateUserRole(userId, roleId);
      toast.success('Role berhasil diupdate');
      await loadApiUsers();
    } catch (err: any) {
      toast.error(err.message || 'Gagal update role');
    }
  };

  const handleDeleteUser = async (userId: number, name: string) => {
    if (confirm(`Hapus user "${name}"?`)) {
      try {
        await api.deleteUser(userId);
        toast.success('User berhasil dihapus');
        await loadApiUsers();
      } catch (err: any) {
        toast.error(err.message || 'Gagal hapus user');
      }
    }
  };

  const handleApiUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiUserForm.name || !apiUserForm.email) {
      toast.error("Nama dan Email wajib diisi!");
      return;
    }
    
    setLoadingUsers(true);
    try {
      if (editingApiUser) {
        // Edit existing user
        await api.updateUser(editingApiUser.id, { name: apiUserForm.name, role_id: apiUserForm.role_id });
        toast.success("Data user berhasil diperbarui!");
      } else {
        // Add new user
        if (!apiUserForm.password) {
          toast.error("Password wajib diisi untuk user baru!");
          setLoadingUsers(false);
          return;
        }
        await api.createUser({
          name: apiUserForm.name,
          email: apiUserForm.email,
          password: apiUserForm.password,
          role_id: apiUserForm.role_id
        });
        toast.success("User baru berhasil ditambahkan!");
      }
      setShowApiUserModal(false);
      await loadApiUsers();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan!");
    } finally {
      setLoadingUsers(false);
    }
  };

  const openAddApiUser = () => {
    setEditingApiUser(null);
    setApiUserForm({ name: "", email: "", password: "", role_id: 4 });
    setShowApiUserModal(true);
  };

  const openEditApiUser = (u: ApiUser) => {
    setEditingApiUser(u);
    setApiUserForm({ name: u.name, email: u.email, password: "", role_id: parseInt(u.role_id) || 4 });
    setShowApiUserModal(true);
  };

  const roleOptions = [
    { id: 1, name: 'super_admin', label: 'Super Admin' },
    { id: 2, name: 'ketua', label: 'Ketua' },
    { id: 3, name: 'sekretaris', label: 'Sekretaris' },
    { id: 4, name: 'anggota', label: 'Anggota' },
  ];

  const filteredManagers = managers.filter(m =>
    m.type === activeTab && m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMembers = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "Semua" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openAddModal = () => {
    setEditingId(null);
    if (activeTab === "IPNU" || activeTab === "IPPNU") {
      setMgrForm({ ...EMPTY_MANAGER, type: activeTab });
    } else {
      setMemForm(EMPTY_MEMBER);
    }
    setShowModal(true);
  };

  const openEditManager = (m: Manager) => {
    setEditingId(m.id);
    setMgrForm({ name: m.name, position: m.position, period: m.period, photo: m.photo || "", type: m.type, nia: m.nia || "" });
    setShowModal(true);
  };

  const openEditMember = (m: Member) => {
    setEditingId(m.id);
    setMemForm({
      name: m.name, address: m.address, phone: m.phone, status: m.status,
      email: m.email || "", age: m.age || "", gender: m.gender || "",
      education: m.education || "", organization: m.organization || "",
      rejectionReason: m.rejectionReason || "", nia: m.nia || ""
    });
    setShowModal(true);
  };

  const handleSubmitManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mgrForm.name || !mgrForm.position) { toast.error("Nama dan jabatan wajib diisi."); return; }
    if (editingId) {
      updateManager(editingId, mgrForm);
      toast.success("Data pengurus berhasil diperbarui!");
    } else {
      addManager(mgrForm);
      toast.success("Pengurus berhasil ditambahkan!");
    }
    setShowModal(false);
  };

  const handleSubmitMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memForm.name) { toast.error("Nama anggota wajib diisi."); return; }
    if (editingId) {
      updateMember(editingId, memForm);
      toast.success("Data anggota berhasil diperbarui!");
    } else {
      addMember(memForm);
      toast.success("Anggota baru berhasil ditambahkan!");
    }
    setShowModal(false);
  };

  const handleDeleteManager = (id: string, name: string) => {
    if (confirm(`Hapus pengurus "${name}"?`)) { deleteManager(id); toast.success("Pengurus berhasil dihapus."); }
  };
  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`Hapus anggota "${name}"?`)) { deleteMember(id); toast.success("Anggota berhasil dihapus."); }
  };

  const handleApprove = (member: Member) => {
    updateMember(member.id, { status: "Aktif" });
    toast.success(`${member.name} telah disetujui!`);
  };

  const handleRejectAction = (member: Member) => {
    const reason = prompt("Masukkan alasan penolakan:", "Data kurang lengkap");
    if (reason === null) return;
    updateMember(member.id, { status: "Ditolak", rejectionReason: reason });
    toast.error(`${member.name} telah ditolak.`);
  };

  const tabs: { key: string; label: string }[] = [
    { key: 'IPNU', label: 'IPNU' },
    { key: 'IPPNU', label: 'IPPNU' },
    { key: 'Anggota', label: 'Anggota' },
  ];
  if (hasRole('super_admin')) {
    tabs.push({ key: 'Role', label: '⚙️ Role' });
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen font-poppins pb-20">
      <div className="bg-[#0f5132] text-white pt-12 pb-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black flex items-center gap-4 mb-2 uppercase tracking-tight">
              <Users className="w-10 h-10 text-amber-400" />
              Manajemen Keanggotaan
            </h1>
            <p className="text-green-100/80 text-lg font-medium">Kelola data pengurus organisasi dan anggota IPNU IPPNU Sijono.</p>
          </div>
          <div className="flex gap-3 bg-white/10 p-1.5 rounded-2xl backdrop-blur-md flex-shrink-0">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => { setActiveTab(tab.key as any); setSearchTerm(""); }}
                className={`px-7 h-12 rounded-xl text-sm font-black transition-all ${
                  activeTab === tab.key ? "bg-amber-400 text-green-950 shadow-lg" : "text-white hover:bg-white/10"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pengurus IPNU", value: managers.filter(m => m.type === "IPNU").length, color: "bg-[#0f5132] text-white" },
            { label: "Pengurus IPPNU", value: managers.filter(m => m.type === "IPPNU").length, color: "bg-amber-600 text-white" },
            { label: "Anggota Aktif", value: members.filter(m => m.status === "Aktif").length, color: "bg-emerald-600 text-white" },
            { label: "Menunggu Verifikasi", value: members.filter(m => m.status === "Pending").length, color: "bg-blue-600 text-white" },
          ].map((s, i) => (
            <div key={i} className={`rounded-2xl p-5 shadow-lg ${s.color}`}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">{s.label}</p>
              <span className="text-3xl font-black">{s.value}</span>
            </div>
          ))}
        </div>
        {activeTab === 'Role' ? (
          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <UserCog className="w-6 h-6 text-[#0f5132]" />
                Manajemen Akun Login & Role
              </h2>
              <div className="flex gap-2">
                <Button onClick={loadApiUsers} variant="outline" className="rounded-xl h-10 text-xs font-bold" disabled={loadingUsers}>
                  {loadingUsers ? 'Memuat...' : 'Refresh'}
                </Button>
                <Button onClick={openAddApiUser} className="rounded-xl h-10 text-xs font-bold bg-[#0f5132] hover:bg-green-900 text-white gap-2">
                  <Plus className="w-4 h-4" /> Tambah User
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    {["Nama", "Email", "NIA", "Role Saat Ini", "Ubah Role", "Aksi"].map(h => (
                      <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {apiUsers.map(u => (
                    <tr key={u.id} className="hover:bg-green-50/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{u.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                      <td className="px-6 py-4"><span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">{u.nia || '-'}</span></td>
                      <td className="px-6 py-4"><RoleBadge role={u.role_name} /></td>
                      <td className="px-6 py-4">
                        <select value={u.role_id} onChange={e => handleRoleChange(u.id, parseInt(e.target.value))}
                          className="h-11 bg-gray-50 border border-gray-100 rounded-xl px-3 font-bold text-sm focus:ring-2 focus:ring-green-200 cursor-pointer">
                          {roleOptions.map(r => (
                            <option key={r.id} value={r.id}>{r.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEditApiUser(u)} className="p-2 h-9 w-9 rounded-xl hover:bg-blue-50 text-blue-500 transition-colors" title="Edit User">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteUser(u.id, u.name)} className="p-2 h-9 w-9 rounded-xl hover:bg-red-50 text-red-400 transition-colors" title="Hapus User">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white p-4 rounded-[2rem] shadow-xl mb-6 flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder={`Cari nama ${activeTab === "Anggota" ? "anggota" : "pengurus"}...`}
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 h-13 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-green-100 transition-all font-medium text-sm" />
              </div>
              {activeTab === "Anggota" && (
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  className="h-12 bg-gray-50 border-none rounded-xl px-5 font-bold text-gray-600 outline-none cursor-pointer focus:ring-4 focus:ring-green-100">
                  <option value="Semua">Semua Status</option>
                  <option value="Pending">🕒 Menunggu</option>
                  <option value="Aktif">✅ Aktif</option>
                  <option value="Cuti">🟡 Cuti</option>
                  <option value="Keluar">🔴 Keluar</option>
                  <option value="Ditolak">❌ Ditolak</option>
                </select>
              )}
              <Button onClick={openAddModal} className="h-12 px-6 rounded-2xl font-black bg-[#0f5132] hover:bg-green-900 text-white shadow-lg shadow-green-900/20 gap-2">
                <Plus className="w-5 h-5" /> TAMBAH {activeTab.toUpperCase()}
              </Button>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
              {activeTab === "Anggota" ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/80 border-b border-gray-100">
                      <tr>
                        {["Nama Anggota", "Alamat", "Kontak", "Organisasi", "Status", "Aksi"].map(h => (
                          <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest last:text-right">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredMembers.length === 0 ? (
                        <tr><td colSpan={6} className="py-16 text-center text-gray-400 font-bold">Belum ada anggota.</td></tr>
                      ) : filteredMembers.map(member => (
                        <tr key={member.id} className="hover:bg-green-50/20 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#0f5132]/5 rounded-xl flex items-center justify-center text-[#0f5132] font-black text-lg">
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-gray-900">{member.name}</span>
                                {member.nia && <span className="text-[10px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded block mt-1 w-fit">NIA: {member.nia}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-300" />{member.address || "-"}</div>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-300" />{member.phone || "-"}</div>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-500 font-medium whitespace-nowrap">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${member.organization === "IPNU" ? "bg-green-50 text-green-700" : member.organization === "IPPNU" ? "bg-amber-50 text-amber-700" : "bg-gray-50 text-gray-400"}`}>
                              {member.organization || "UMUM"}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              member.status === "Aktif" ? "bg-green-100 text-green-700" :
                              member.status === "Pending" ? "bg-blue-100 text-blue-700" :
                              member.status === "Cuti" ? "bg-amber-100 text-amber-700" :
                              member.status === "Ditolak" ? "bg-red-50 text-red-400" : "bg-red-100 text-red-700"
                            }`}>{member.status}</span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              {member.status === "Pending" && (
                                <>
                                  <button onClick={() => handleApprove(member)} className="p-2 h-9 w-9 rounded-xl hover:bg-green-50 text-green-600" title="Setujui">
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => handleRejectAction(member)} className="p-2 h-9 w-9 rounded-xl hover:bg-red-50 text-red-500" title="Tolak">
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                </>
                              )}
                              <button onClick={() => window.open(`https://wa.me/62${member.phone.replace(/[^0-9]/g, "").replace(/^0/, "")}`, "_blank")}
                                className="p-2 h-9 w-9 rounded-xl hover:bg-green-50 text-emerald-500" title="WhatsApp">
                                <MessageCircle className="w-5 h-5" />
                              </button>
                              <button onClick={() => openEditMember(member)} className="p-2 h-9 w-9 rounded-xl hover:bg-blue-50 text-blue-500" title="Edit">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteMember(member.id, member.name)} className="p-2 h-9 w-9 rounded-xl hover:bg-red-50 text-red-400" title="Hapus">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                  {filteredManagers.map(manager => (
                    <div key={manager.id} className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 hover:border-green-200 hover:bg-white hover:shadow-xl transition-all group">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#0f5132] overflow-hidden">
                          {manager.photo ? <img src={manager.photo} alt={manager.name} className="w-full h-full object-cover" /> : <UserCheck className="w-10 h-10" />}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => openEditManager(manager)} className="p-2 h-9 w-9 rounded-xl hover:bg-gray-100 text-gray-400"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteManager(manager.id, manager.name)} className="p-2 h-9 w-9 rounded-xl hover:bg-red-50 text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-1">{manager.name}</h3>
                      <p className="text-[#0f5132] font-black text-xs uppercase tracking-[0.2em] mb-2">{manager.position}</p>
                      {manager.nia && <span className="text-[10px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded mb-4 inline-block">NIA: {manager.nia}</span>}
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 pt-4 border-t border-gray-100">
                        <ShieldCheck className="w-4 h-4 text-amber-500" /> Periode: {manager.period}
                      </div>
                    </div>
                  ))}
                  <button onClick={openAddModal} className="border-4 border-dashed border-gray-100 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center min-h-[230px] hover:border-green-300 hover:bg-green-50/30 transition-all group">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100 group-hover:scale-110 transition-all">
                      <Plus className="w-8 h-8 text-gray-300 group-hover:text-[#0f5132]" />
                    </div>
                    <p className="text-gray-400 font-bold group-hover:text-[#0f5132]">Tambah Pengurus {activeTab}</p>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">{editingId ? "Edit" : "Tambah"} {activeTab === "Anggota" ? "Anggota" : `Pengurus ${activeTab}`}</h2>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"><X className="w-6 h-6" /></button>
                </div>
                {activeTab !== "Anggota" ? (
                  <form onSubmit={handleSubmitManager} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nama Lengkap *</label>
                      <Input value={mgrForm.name} onChange={e => setMgrForm({ ...mgrForm, name: e.target.value })}
                        placeholder="Contoh: Muhammad Wildan" className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">NIA</label>
                      <Input value={mgrForm.nia} onChange={e => setMgrForm({ ...mgrForm, nia: e.target.value })}
                        placeholder="Contoh: 12.34.56.7890" className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Jabatan *</label>
                      <Input value={mgrForm.position} onChange={e => setMgrForm({ ...mgrForm, position: e.target.value })}
                        placeholder="Contoh: Ketua, Sekretaris, Bendahara" className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Periode</label>
                        <Input value={mgrForm.period} onChange={e => setMgrForm({ ...mgrForm, period: e.target.value })}
                          placeholder="2024-2026" className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Organisasi</label>
                        <select value={mgrForm.type} onChange={e => setMgrForm({ ...mgrForm, type: e.target.value as "IPNU" | "IPPNU" })}
                          className="w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 font-bold text-sm focus:ring-2 focus:ring-green-200">
                          <option value="IPNU">IPNU</option>
                          <option value="IPPNU">IPPNU</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 h-12 rounded-2xl font-bold border-gray-200">Batal</Button>
                      <Button type="submit" className="flex-1 h-12 rounded-2xl font-black bg-[#0f5132] hover:bg-green-900 text-white">
                        {editingId ? "SIMPAN" : "TAMBAHKAN"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmitMember} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nama Lengkap *</label>
                      <Input value={memForm.name} onChange={e => setMemForm({ ...memForm, name: e.target.value })}
                        placeholder="Nama lengkap anggota" className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">NIA</label>
                      <Input value={memForm.nia} onChange={e => setMemForm({ ...memForm, nia: e.target.value })}
                        placeholder="Contoh: 12.34.56.7890" className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Usia</label>
                        <Input value={memForm.age} onChange={e => setMemForm({ ...memForm, age: e.target.value })}
                          placeholder="Contoh: 17" className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Organisasi</label>
                        <select value={memForm.organization} onChange={e => setMemForm({ ...memForm, organization: e.target.value })}
                          className="w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 font-bold text-sm focus:ring-2 focus:ring-green-200">
                          <option value="">- Pilih -</option>
                          <option value="IPNU">IPNU</option>
                          <option value="IPPNU">IPPNU</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Alamat</label>
                        <Input value={memForm.address} onChange={e => setMemForm({ ...memForm, address: e.target.value })}
                          placeholder="Sijono RT 01/02" className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No. HP</label>
                        <Input value={memForm.phone} onChange={e => setMemForm({ ...memForm, phone: e.target.value })}
                          placeholder="08xx-xxxx-xxxx" className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 h-12 rounded-2xl font-bold border-gray-200">Batal</Button>
                      <Button type="submit" className="flex-1 h-12 rounded-2xl font-black bg-[#0f5132] hover:bg-green-900 text-white">
                        {editingId ? "SIMPAN" : "TAMBAHKAN"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Api User (Login Accounts) */}
        {showApiUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-gray-900">{editingApiUser ? "Edit Akun User" : "Tambah Akun User"}</h2>
                  <button onClick={() => setShowApiUserModal(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleApiUserSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nama Akun (Real-time) *</label>
                    <Input value={apiUserForm.name} onChange={e => setApiUserForm({ ...apiUserForm, name: e.target.value })}
                      placeholder="Nama di Dashboard" className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email Login *</label>
                    <Input type="email" value={apiUserForm.email} onChange={e => setApiUserForm({ ...apiUserForm, email: e.target.value })}
                      placeholder="email@example.com" className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" required disabled={!!editingApiUser} />
                  </div>
                  {!editingApiUser && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Password *</label>
                      <Input type="password" value={apiUserForm.password} onChange={e => setApiUserForm({ ...apiUserForm, password: e.target.value })}
                        placeholder="Password untuk login" className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" required />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Role / Hak Akses</label>
                    <select value={apiUserForm.role_id} onChange={e => setApiUserForm({ ...apiUserForm, role_id: parseInt(e.target.value) })}
                      className="w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 font-bold text-sm focus:ring-2 focus:ring-green-200">
                      {roleOptions.map(r => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowApiUserModal(false)} className="flex-1 h-12 rounded-2xl font-bold border-gray-200">Batal</Button>
                    <Button type="submit" disabled={loadingUsers} className="flex-1 h-12 rounded-2xl font-black bg-[#0f5132] hover:bg-green-900 text-white">
                      {loadingUsers ? "Memproses..." : (editingApiUser ? "SIMPAN" : "TAMBAHKAN")}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
