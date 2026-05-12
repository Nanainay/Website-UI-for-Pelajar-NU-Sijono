import React, { useState } from "react";
import { 
  Users, UserCheck, ShieldCheck, Search, Plus, 
  Edit2, Trash2, Phone, MapPin, Calendar, Info, X, MessageCircle,
  CheckCircle, XCircle
} from "lucide-react";
import { useOrganization, Manager, Member } from "../context/OrganizationContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

// ── Type Definitions ──────────────────────────────────────────────────────────

type ManagerForm = { name: string; position: string; period: string; photo: string; type: "IPNU" | "IPPNU" };
type MemberForm  = { 
  name: string; 
  address: string; 
  phone: string; 
  status: "Aktif" | "Cuti" | "Keluar" | "Pending" | "Ditolak";
  email: string;
  age: string;
  gender: string;
  education: string;
  organization: string;
  rejectionReason: string;
};

const EMPTY_MANAGER: ManagerForm = { name: "", position: "", period: "2024-2026", photo: "", type: "IPNU" };
const EMPTY_MEMBER:  MemberForm  = { 
  name: "", address: "", phone: "", status: "Aktif",
  email: "", age: "", gender: "", education: "", organization: "", rejectionReason: ""
};

// ── Component ─────────────────────────────────────────────────────────────────

export function Administration() {
  const { managers, members, addManager, updateManager, deleteManager, addMember, updateMember, deleteMember } = useOrganization();

  const [activeTab,    setActiveTab]    = useState<"IPNU" | "IPPNU" | "Anggota">("IPNU");
  const [searchTerm,   setSearchTerm]   = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  // Modal state
  const [showModal,   setShowModal]   = useState(false);
  const [editingId,   setEditingId]   = useState<string | null>(null);
  const [mgrForm,     setMgrForm]     = useState<ManagerForm>(EMPTY_MANAGER);
  const [memForm,     setMemForm]     = useState<MemberForm>(EMPTY_MEMBER);

  // ── Filtered lists ────────────────────────────────────────────────────────

  const filteredManagers = managers.filter(m =>
    m.type === activeTab && m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMembers = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "Semua" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Modal helpers ─────────────────────────────────────────────────────────

  const openAddModal = () => {
    setEditingId(null);
    if (activeTab !== "Anggota") {
      setMgrForm({ ...EMPTY_MANAGER, type: activeTab });
    } else {
      setMemForm(EMPTY_MEMBER);
    }
    setShowModal(true);
  };

  const openEditManager = (m: Manager) => {
    setEditingId(m.id);
    setMgrForm({ name: m.name, position: m.position, period: m.period, photo: m.photo || "", type: m.type });
    setShowModal(true);
  };

  const openEditMember = (m: Member) => {
    setEditingId(m.id);
    setMemForm({ 
      name: m.name, 
      address: m.address, 
      phone: m.phone, 
      status: m.status,
      email: m.email || "",
      age: m.age || "",
      gender: m.gender || "",
      education: m.education || "",
      organization: m.organization || "",
      rejectionReason: m.rejectionReason || ""
    });
    setShowModal(true);
  };

  // ── Submit handlers ───────────────────────────────────────────────────────

  const handleSubmitManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mgrForm.name || !mgrForm.position) { toast.error("Nama dan jabatan wajib diisi."); return; }
    if (editingId) {
      updateManager(editingId, mgrForm);
      toast.success("Data pengurus berhasil diperbarui!");
    } else {
      addManager(mgrForm);
      toast.success(`Pengurus ${mgrForm.type} berhasil ditambahkan! Halaman Tentang Kita otomatis diperbarui.`);
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
    if (confirm(`Hapus pengurus "${name}"? Data akan hilang dari halaman Tentang Kita.`)) {
      deleteManager(id);
      toast.success("Pengurus berhasil dihapus.");
    }
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`Hapus anggota "${name}"?`)) {
      deleteMember(id);
      toast.success("Anggota berhasil dihapus.");
    }
  };

  const handleNotifyWA = (member: Member, status: "Setuju" | "Tolak", reason?: string) => {
    const phone = member.phone.replace(/[^0-9]/g, "");
    const waPhone = phone.startsWith("0") ? "62" + phone.slice(1) : phone;
    
    let message = "";
    if (status === "Setuju") {
      message = `Halo ${member.name}, Selamat! Pendaftaran Anda di IPNU IPPNU Desa Sijono telah DISETUJUI. Selamat bergabung menjadi bagian dari keluarga besar kami. Belajar, Berjuang, Bertaqwa!`;
    } else {
      message = `Halo ${member.name}, Mohon maaf, pendaftaran Anda di IPNU IPPNU Desa Sijono belum dapat kami setujui.\n\nAlasan: ${reason || "Data belum lengkap"}\n\nTerima kasih atas minatnya.`;
    }

    const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleApprove = (member: Member) => {
    updateMember(member.id, { status: "Aktif" });
    toast.success(`${member.name} telah disetujui!`);
    handleNotifyWA(member, "Setuju");
  };

  const handleRejectAction = (member: Member) => {
    const reason = prompt("Masukkan alasan penolakan:", "Data kurang lengkap");
    if (reason === null) return;
    
    updateMember(member.id, { status: "Ditolak", rejectionReason: reason });
    toast.error(`${member.name} telah ditolak.`);
    handleNotifyWA(member, "Tolak", reason);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-[#f8fafc] min-h-screen font-poppins pb-20">

      {/* ── Header ── */}
      <div className="bg-[#0f5132] text-white pt-12 pb-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black flex items-center gap-4 mb-2 uppercase tracking-tight">
              <Users className="w-10 h-10 text-amber-400" />
              Manajemen Keanggotaan
            </h1>
            <p className="text-green-100/80 text-lg font-medium">Kelola data pengurus organisasi dan anggota IPNU IPPNU Sijono.</p>
          </div>
          {/* Tabs */}
          <div className="flex gap-3 bg-white/10 p-1.5 rounded-2xl backdrop-blur-md flex-shrink-0">
            {(["IPNU", "IPPNU", "Anggota"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearchTerm(""); }}
                className={`px-7 h-12 rounded-xl text-sm font-black transition-all ${
                  activeTab === tab ? "bg-amber-400 text-green-950 shadow-lg" : "text-white hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Toolbar ── */}
        <div className="bg-white p-4 rounded-[2rem] shadow-xl mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Cari nama ${activeTab === "Anggota" ? "anggota" : "pengurus"}...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 h-13 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-green-100 transition-all font-medium text-sm"
            />
          </div>

          {activeTab === "Anggota" && (
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="h-12 bg-gray-50 border-none rounded-xl px-5 font-bold text-gray-600 outline-none cursor-pointer focus:ring-4 focus:ring-green-100"
            >
              <option value="Semua">Semua Status</option>
              <option value="Pending">🕒 Menunggu Persetujuan</option>
              <option value="Aktif">✅ Aktif</option>
              <option value="Cuti">🟡 Cuti</option>
              <option value="Keluar">🔴 Keluar</option>
              <option value="Ditolak">❌ Ditolak</option>
            </select>
          )}

          <Button
            onClick={openAddModal}
            className="h-12 px-6 rounded-2xl font-black bg-[#0f5132] hover:bg-green-900 text-white shadow-lg shadow-green-900/20 gap-2"
          >
            <Plus className="w-5 h-5" />
            TAMBAH {activeTab.toUpperCase()}
          </Button>
        </div>

        {/* ── Content ── */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">

          {/* Member table */}
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
                          <span className="font-bold text-gray-900">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-300 flex-shrink-0" />{member.address || "-"}</div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-300 flex-shrink-0" />{member.phone || "-"}</div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500 font-medium whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md w-fit mb-1 ${
                            member.organization === "IPNU" ? "bg-green-50 text-green-700" : 
                            member.organization === "IPPNU" ? "bg-amber-50 text-amber-700" : "bg-gray-50 text-gray-400"
                          }`}>
                            {member.organization || "UMUM"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold">{new Date(member.joinDate).toLocaleDateString("id-ID")}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          member.status === "Aktif"   ? "bg-green-100 text-green-700" :
                          member.status === "Pending" ? "bg-blue-100 text-blue-700" :
                          member.status === "Cuti"    ? "bg-amber-100 text-amber-700" : 
                          member.status === "Ditolak" ? "bg-red-50 text-red-400" : "bg-red-100 text-red-700"
                        }`}>{member.status}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {member.status === "Pending" && (
                            <>
                              <button onClick={() => handleApprove(member)} className="p-2 h-9 w-9 rounded-xl hover:bg-green-50 text-green-600 transition-colors flex items-center justify-center" title="Setujui">
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleRejectAction(member)} className="p-2 h-9 w-9 rounded-xl hover:bg-red-50 text-red-500 transition-colors flex items-center justify-center" title="Tolak">
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => {
                              const phone = member.phone.replace(/[^0-9]/g, "");
                              const waPhone = phone.startsWith("0") ? "62" + phone.slice(1) : phone;
                              window.open(`https://wa.me/${waPhone}`, "_blank");
                            }} 
                            className="p-2 h-9 w-9 rounded-xl hover:bg-green-50 text-emerald-500 transition-colors flex items-center justify-center" title="WhatsApp"
                          >
                            <MessageCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => openEditMember(member)} className="p-2 h-9 w-9 rounded-xl hover:bg-blue-50 text-blue-500 transition-colors flex items-center justify-center" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteMember(member.id, member.name)} className="p-2 h-9 w-9 rounded-xl hover:bg-red-50 text-red-400 transition-colors flex items-center justify-center" title="Hapus">
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
            /* Manager card grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
              {filteredManagers.map(manager => (
                <div key={manager.id} className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 hover:border-green-200 hover:bg-white hover:shadow-xl transition-all group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#0f5132] overflow-hidden">
                      {manager.photo
                        ? <img src={manager.photo} alt={manager.name} className="w-full h-full object-cover" />
                        : <UserCheck className="w-10 h-10" />}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEditManager(manager)} className="p-2 h-9 w-9 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors flex items-center justify-center">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteManager(manager.id, manager.name)} className="p-2 h-9 w-9 rounded-xl hover:bg-red-50 text-red-400 transition-colors flex items-center justify-center">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-1">{manager.name}</h3>
                  <p className="text-[#0f5132] font-black text-xs uppercase tracking-[0.2em] mb-4">{manager.position}</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 pt-4 border-t border-gray-100">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    Periode: {manager.period}
                  </div>
                </div>
              ))}

              {/* Add card placeholder */}
              <button
                onClick={openAddModal}
                className="border-4 border-dashed border-gray-100 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center min-h-[230px] hover:border-green-300 hover:bg-green-50/30 transition-all group"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100 group-hover:scale-110 transition-all">
                  <Plus className="w-8 h-8 text-gray-300 group-hover:text-[#0f5132]" />
                </div>
                <p className="text-gray-400 font-bold group-hover:text-[#0f5132] transition-colors">Tambah Pengurus {activeTab}</p>
              </button>
            </div>
          )}
        </div>

        {/* ── Sync Info ── */}
        <div className="mt-6 bg-blue-50 p-5 rounded-[1.75rem] border border-blue-100 flex items-center gap-5">
          <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-500 flex-shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <p className="text-blue-700 text-sm font-medium">
            <strong>Sinkronisasi otomatis:</strong> Perubahan data Pengurus IPNU &amp; IPPNU langsung muncul di halaman <strong>"Tentang Kita"</strong> tanpa perlu reload.
          </p>
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {editingId ? "Edit" : "Tambah"} {activeTab === "Anggota" ? "Anggota" : `Pengurus ${activeTab}`}
                  </h2>
                  <p className="text-sm text-gray-400 font-medium mt-1">
                    {activeTab !== "Anggota" && !editingId && "Akan langsung tampil di halaman Tentang Kita."}
                  </p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* ── Manager Form ── */}
              {activeTab !== "Anggota" ? (
                <form onSubmit={handleSubmitManager} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nama Lengkap *</label>
                    <Input
                      value={mgrForm.name}
                      onChange={e => setMgrForm({ ...mgrForm, name: e.target.value })}
                      placeholder="Contoh: Muhammad Wildan"
                      className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Jabatan *</label>
                    <Input
                      value={mgrForm.position}
                      onChange={e => setMgrForm({ ...mgrForm, position: e.target.value })}
                      placeholder="Contoh: Ketua, Sekretaris, Bendahara"
                      className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Periode</label>
                      <Input
                        value={mgrForm.period}
                        onChange={e => setMgrForm({ ...mgrForm, period: e.target.value })}
                        placeholder="2024-2026"
                        className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Organisasi</label>
                      <select
                        value={mgrForm.type}
                        onChange={e => setMgrForm({ ...mgrForm, type: e.target.value as "IPNU" | "IPPNU" })}
                        className="w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 font-bold text-sm focus:ring-2 focus:ring-green-200"
                      >
                        <option value="IPNU">IPNU</option>
                        <option value="IPPNU">IPPNU</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Foto (Opsional)</label>
                    <div className="flex items-center gap-4">
                      {/* Preview */}
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {mgrForm.photo
                          ? <img src={mgrForm.photo} alt="preview" className="w-full h-full object-cover" />
                          : <UserCheck className="w-7 h-7 text-gray-300" />
                        }
                      </div>
                      {/* Upload button */}
                      <label className="flex-1 cursor-pointer">
                        <div className="h-12 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-green-700">
                          <Plus className="w-4 h-4" />
                          Pilih Foto dari Perangkat
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 2 * 1024 * 1024) {
                              toast.error("Ukuran foto maksimal 2MB.");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => setMgrForm(prev => ({ ...prev, photo: reader.result as string }));
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      {/* Remove */}
                      {mgrForm.photo && (
                        <button type="button" onClick={() => setMgrForm(prev => ({ ...prev, photo: "" }))} className="p-2 rounded-xl hover:bg-red-50 text-red-400 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">Format: JPG, PNG, WEBP. Maks 2MB.</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 h-12 rounded-2xl font-bold border-gray-200">Batal</Button>
                    <Button type="submit" className="flex-1 h-12 rounded-2xl font-black bg-[#0f5132] hover:bg-green-900 text-white shadow-lg shadow-green-900/20">
                      {editingId ? "SIMPAN" : "TAMBAHKAN"}
                    </Button>
                  </div>
                </form>
              ) : (
                /* ── Member Form ── */
                 <form onSubmit={handleSubmitMember} className="space-y-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nama Lengkap *</label>
                     <Input
                       value={memForm.name}
                       onChange={e => setMemForm({ ...memForm, name: e.target.value })}
                       placeholder="Nama lengkap anggota"
                       className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium"
                     />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Usia</label>
                      <Input
                        value={memForm.age}
                        onChange={e => setMemForm({ ...memForm, age: e.target.value })}
                        placeholder="Contoh: 17"
                        className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Organisasi</label>
                      <select
                        value={memForm.organization}
                        onChange={e => setMemForm({ ...memForm, organization: e.target.value })}
                        className="w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 font-bold text-sm focus:ring-2 focus:ring-green-200"
                      >
                        <option value="">- Pilih -</option>
                        <option value="IPNU">IPNU</option>
                        <option value="IPPNU">IPPNU</option>
                      </select>
                    </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Alamat</label>
                     <Input
                       value={memForm.address}
                       onChange={e => setMemForm({ ...memForm, address: e.target.value })}
                       placeholder="Contoh: Sijono RT 01/02"
                       className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium"
                     />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No. HP</label>
                       <Input
                         value={memForm.phone}
                         onChange={e => setMemForm({ ...memForm, phone: e.target.value })}
                         placeholder="08xx-xxxx-xxxx"
                         className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</label>
                       <select
                         value={memForm.status}
                         onChange={e => setMemForm({ ...memForm, status: e.target.value as any })}
                         className="w-full h-12 rounded-xl bg-gray-50 border border-gray-100 px-4 font-bold text-sm focus:ring-2 focus:ring-green-200"
                       >
                         <option value="Aktif">Aktif</option>
                         <option value="Cuti">Cuti</option>
                         <option value="Keluar">Keluar</option>
                       </select>
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email</label>
                      <Input
                        value={memForm.email}
                        onChange={e => setMemForm({ ...memForm, email: e.target.value })}
                        placeholder="email@example.com"
                        className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pendidikan</label>
                      <Input
                        value={memForm.education}
                        onChange={e => setMemForm({ ...memForm, education: e.target.value })}
                        placeholder="Contoh: SMA"
                        className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium"
                      />
                    </div>
                   </div>
                   <div className="flex gap-3 pt-2">
                     <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 h-12 rounded-2xl font-bold border-gray-200">Batal</Button>
                     <Button type="submit" className="flex-1 h-12 rounded-2xl font-black bg-[#0f5132] hover:bg-green-900 text-white shadow-lg shadow-green-900/20">
                       {editingId ? "SIMPAN" : "TAMBAHKAN"}
                     </Button>
                   </div>
                 </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
