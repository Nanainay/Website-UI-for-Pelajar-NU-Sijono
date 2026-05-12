import React, { useState } from "react";
import { 
  Package, Search, Box, Tag, MapPin, 
  CheckCircle2, AlertTriangle, XCircle, Info, Shield
} from "lucide-react";
import { useInventory } from "../context/InventoryContext";

const conditionConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  "Baik":         { label: "Baik",         bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: <CheckCircle2 className="w-4 h-4" /> },
  "Rusak Ringan": { label: "Rusak Ringan", bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   icon: <AlertTriangle className="w-4 h-4" /> },
  "Rusak Berat":  { label: "Rusak Berat",  bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     icon: <XCircle className="w-4 h-4" /> },
};

const categoryIcons: Record<string, string> = {
  "Elektronik": "⚡",
  "Mebel": "🪑",
  "Atribut": "🏳️",
  "Perlengkapan": "🧰",
  "Dokumen": "📄",
  "Lainnya": "📦",
};

export function Inventory() {
  const { items } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const categories = ["Semua", ...Array.from(new Set(items.map(i => i.category)))];

  const filtered = items.filter(item => {
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === "Semua" || item.category === activeCategory;
    return matchSearch && matchCat;
  });

  const totalQty   = items.reduce((s, i) => s + i.qty, 0);
  const baikQty    = items.filter(i => i.condition === "Baik").reduce((s, i) => s + i.qty, 0);
  const rusakQty   = items.filter(i => i.condition !== "Baik").reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-poppins pb-20">
      {/* Hero */}
      <div className="bg-[#0f5132] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] select-none pointer-events-none flex items-center justify-end">
          <Package className="w-[400px] h-[400px] mr-20" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-amber-400/30">
              <Shield className="w-4 h-4" />
              Daftar Inventaris
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
              Aset &amp; Perlengkapan
              <span className="block text-amber-400">IPNU IPPNU Sijono</span>
            </h1>
            <p className="text-green-100/70 text-lg font-medium">
              Catatan resmi aset dan perlengkapan organisasi. Data diperbarui secara berkala oleh pengurus.
            </p>
          </div>
        </div>
        {/* Wave divider */}
        <div className="h-12 bg-[#f8fafc]" style={{clipPath: "ellipse(55% 100% at 50% 100%)"}}>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Stat strip */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Unit Tersedia", value: totalQty, color: "text-[#0f5132]", note: "unit" },
            { label: "Kondisi Baik",        value: baikQty,  color: "text-emerald-600", note: "unit" },
            { label: "Perlu Perbaikan",     value: rusakQty, color: "text-amber-600",   note: "unit" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-[1.75rem] shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
              <div className={`text-4xl font-black ${s.color} mb-1`}>{s.value}</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Read-only notice */}
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-[1.5rem] px-6 py-4 mb-8">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <p className="text-sm font-medium text-blue-700">
            Halaman ini bersifat <strong>hanya baca</strong>. Untuk mengubah data inventaris, hubungi pengurus IPNU IPPNU Sijono.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nama barang atau lokasi..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-100 transition-all font-medium shadow-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition-all border whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-[#0f5132] text-white border-[#0f5132] shadow-lg shadow-green-900/20"
                    : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700"
                }`}
              >
                {cat !== "Semua" && categoryIcons[cat] ? `${categoryIcons[cat]} ` : ""}{cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 font-bold text-xl">Tidak ada barang ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => {
              const cond = conditionConfig[item.condition];
              return (
                <div 
                  key={item.id} 
                  className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-400 overflow-hidden"
                >
                  {/* Top color accent based on condition */}
                  <div className={`h-1.5 w-full ${
                    item.condition === "Baik" ? "bg-emerald-400" :
                    item.condition === "Rusak Ringan" ? "bg-amber-400" : "bg-red-400"
                  }`} />
                  
                  <div className="p-6">
                    {/* Icon + Qty */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-[#0f5132]/5 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-[#0f5132] group-hover:text-white transition-all duration-500">
                        {categoryIcons[item.category] || "📦"}
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-gray-900 leading-none">{item.qty}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">unit</p>
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="font-black text-gray-900 text-lg mb-1 leading-snug">{item.name}</h3>
                    
                    {/* Category */}
                    <p className="text-xs font-bold text-[#0f5132]/70 uppercase tracking-widest mb-4">{item.category}</p>

                    {/* Meta */}
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <MapPin className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        <span className="line-clamp-1">{item.location}</span>
                      </div>
                      {item.notes && (
                        <div className="flex items-start gap-2 text-sm text-gray-400 font-medium">
                          <Info className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{item.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Condition badge */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${cond.bg} ${cond.text} ${cond.border}`}>
                      {cond.icon}
                      {cond.label}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cek Terakhir</p>
                    <p className="text-xs font-black text-gray-600">
                      {new Date(item.lastCheck).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
