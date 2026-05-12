import React, { useState } from "react";
import { 
  Package, Search, Plus, Edit2, Trash2, Tag, Box, 
  MapPin, X, CheckCircle2, AlertTriangle, XCircle, SlidersHorizontal
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useInventory, InventoryItem } from "../context/InventoryContext";
import { toast } from "sonner";

const CATEGORIES = ["Elektronik", "Mebel", "Atribut", "Perlengkapan", "Dokumen", "Lainnya"];
const CONDITIONS = ["Baik", "Rusak Ringan", "Rusak Berat"] as const;

const conditionConfig: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  "Baik":         { label: "Baik",         bg: "bg-emerald-100", text: "text-emerald-700", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  "Rusak Ringan": { label: "Rusak Ringan", bg: "bg-amber-100",   text: "text-amber-700",   icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  "Rusak Berat":  { label: "Rusak Berat",  bg: "bg-red-100",     text: "text-red-700",     icon: <XCircle className="w-3.5 h-3.5" /> },
};

type FormState = {
  name: string;
  category: string;
  location: string;
  condition: "Baik" | "Rusak Ringan" | "Rusak Berat";
  qty: number;
  lastCheck: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  name: "", category: "Elektronik", location: "", condition: "Baik",
  qty: 1, lastCheck: new Date().toISOString().split("T")[0], notes: ""
};

export function AdminInventory() {
  const { items, addItem, updateItem, deleteItem } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCondition, setFilterCondition] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  // Filtered items
  const filtered = items.filter(item => {
    const matchSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCond = filterCondition === "Semua" || item.condition === filterCondition;
    return matchSearch && matchCond;
  });

  // Stats derived from ACTUAL data
  const totalQty    = items.reduce((sum, i) => sum + i.qty, 0);
  const baikQty     = items.filter(i => i.condition === "Baik").reduce((sum, i) => sum + i.qty, 0);
  const rusakQty    = items.filter(i => i.condition !== "Baik").reduce((sum, i) => sum + i.qty, 0);
  const totalItems  = items.length;

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setForm({ name: item.name, category: item.category, location: item.location, condition: item.condition, qty: item.qty, lastCheck: item.lastCheck, notes: item.notes || "" });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.location) {
      toast.error("Nama barang dan lokasi wajib diisi.");
      return;
    }
    if (editingId) {
      updateItem(editingId, form);
      toast.success("Data barang berhasil diperbarui!");
    } else {
      addItem(form);
      toast.success("Barang baru berhasil ditambahkan!");
    }
    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus barang "${name}" dari inventaris?`)) {
      deleteItem(id);
      toast.success("Barang berhasil dihapus.");
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-poppins pb-20">
      {/* Header */}
      <div className="bg-[#0f5132] text-white pt-12 pb-8 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-end pr-16">
          <Package className="w-96 h-96" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <h1 className="text-4xl md:text-5xl font-black flex items-center gap-4 mb-2 uppercase tracking-tight">
            <Package className="w-10 h-10 text-amber-400 flex-shrink-0" />
            Kelola Inventaris
          </h1>
          <p className="text-green-100/80 text-lg font-medium">Manajemen aset dan perlengkapan organisasi IPNU IPPNU Sijono.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Jenis Barang", value: totalItems, suffix: "Jenis", color: "bg-[#0f5132] text-white", icon: <Box className="w-6 h-6 opacity-70" /> },
            { label: "Total Unit", value: totalQty, suffix: "Unit", color: "bg-white text-gray-900", icon: <Package className="w-6 h-6 text-[#0f5132]" /> },
            { label: "Kondisi Baik", value: baikQty, suffix: "Unit", color: "bg-white text-gray-900", icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" /> },
            { label: "Perlu Perbaikan", value: rusakQty, suffix: "Unit", color: "bg-white text-gray-900", icon: <AlertTriangle className="w-6 h-6 text-amber-500" /> },
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} rounded-[2rem] p-6 shadow-xl border border-white flex flex-col justify-between min-h-[130px]`}>
              <div className="flex justify-between items-start">
                {stat.icon}
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${i === 0 ? "text-green-100/70" : "text-gray-400"}`}>{stat.label}</p>
                <div className="flex items-end gap-1.5">
                  <span className="text-3xl font-black leading-none">{stat.value}</span>
                  <span className={`text-xs font-bold mb-0.5 ${i === 0 ? "text-green-200" : "text-gray-400"}`}>{stat.suffix}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-[2rem] shadow-xl mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nama, kategori, atau lokasi..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 h-13 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-green-100 transition-all font-medium text-sm"
            />
          </div>
          <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl">
            {["Semua", "Baik", "Rusak Ringan", "Rusak Berat"].map(f => (
              <button
                key={f}
                onClick={() => setFilterCondition(f)}
                className={`px-4 h-10 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  filterCondition === f ? "bg-white text-[#0f5132] shadow-md" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          <Button
            onClick={openAdd}
            className="h-12 px-6 rounded-2xl font-black bg-[#0f5132] hover:bg-green-900 text-white shadow-lg shadow-green-900/20 gap-2"
          >
            <Plus className="w-5 h-5" /> TAMBAH BARANG
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-50">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  {["Nama Barang", "Kategori", "Lokasi", "Kondisi", "Jumlah", "Cek Terakhir", "Aksi"].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap last:text-right">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-gray-400 font-bold">
                      Tidak ada barang ditemukan.
                    </td>
                  </tr>
                ) : filtered.map(item => {
                  const cond = conditionConfig[item.condition];
                  return (
                    <tr key={item.id} className="hover:bg-green-50/20 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0f5132]/5 rounded-xl flex items-center justify-center text-[#0f5132] flex-shrink-0">
                            <Box className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                            {item.notes && <p className="text-xs text-gray-400 font-medium">{item.notes}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                          <Tag className="w-4 h-4 text-gray-300" /> {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                          <MapPin className="w-4 h-4 text-gray-300" /> {item.location}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${cond.bg} ${cond.text}`}>
                          {cond.icon} {cond.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-black text-gray-900">{item.qty} <span className="text-gray-400 font-medium text-xs">unit</span></td>
                      <td className="px-6 py-5 text-sm text-gray-400 font-medium whitespace-nowrap">
                        {new Date(item.lastCheck).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(item)} className="p-2 h-9 w-9 rounded-xl hover:bg-blue-50 text-blue-500 transition-colors flex items-center justify-center">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(item.id, item.name)} className="p-2 h-9 w-9 rounded-xl hover:bg-red-50 text-red-400 transition-colors flex items-center justify-center">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 font-poppins">{editingId ? "Edit Barang" : "Tambah Barang Baru"}</h2>
                  <p className="text-sm text-gray-400 font-medium mt-1">Isi formulir data aset inventaris.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nama Barang *</label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Speaker Aktif Polytron" className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kategori</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full h-12 rounded-xl bg-gray-50 border-gray-100 px-4 font-medium text-sm focus:ring-2 focus:ring-green-200 border">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kondisi</label>
                    <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value as any })} className="w-full h-12 rounded-xl bg-gray-50 border-gray-100 px-4 font-medium text-sm focus:ring-2 focus:ring-green-200 border">
                      {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Jumlah (Unit)</label>
                    <Input type="number" min={1} value={form.qty} onChange={e => setForm({ ...form, qty: Number(e.target.value) })} className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Cek Terakhir</label>
                    <Input type="date" value={form.lastCheck} onChange={e => setForm({ ...form, lastCheck: e.target.value })} className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Lokasi Penyimpanan *</label>
                  <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Contoh: Gudang Masjid" className="h-12 rounded-xl bg-gray-50 border-gray-100 font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Catatan (Opsional)</label>
                  <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Tambahkan keterangan jika ada..." className="rounded-xl bg-gray-50 border-gray-100 font-medium min-h-[80px]" />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 h-12 rounded-2xl font-bold border-gray-200">
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1 h-12 rounded-2xl font-black bg-[#0f5132] hover:bg-green-900 text-white shadow-lg shadow-green-900/20">
                    {editingId ? "SIMPAN PERUBAHAN" : "TAMBAHKAN BARANG"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
