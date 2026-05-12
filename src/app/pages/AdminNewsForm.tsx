import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Save, Eye, Image as ImageIcon, Plus, Trash2, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNews, Article } from "../context/NewsContext";
import { toast } from "sonner";
import { ArticleHeader } from "../components/news/ArticleHeader";
import { ArticleSection } from "../components/news/ArticleSection";
import { PhotoGallery } from "../components/news/PhotoGallery";

export function AdminNewsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getArticle, addArticle, updateArticle } = useNews();
  const [isPreview, setIsPreview] = useState(false);

  const [formData, setFormData] = useState<Omit<Article, "id">>({
    title: "",
    date: new Date().toISOString().split('T')[0],
    author: "Admin",
    category: "Kegiatan",
    status: "Draft",
    content: "",
    image: "",
    sections: [],
    gallery: []
  });

  useEffect(() => {
    if (id) {
      const existing = getArticle(id);
      if (existing) {
        const { id: _, ...rest } = existing;
        setFormData(rest);
      }
    }
  }, [id, getArticle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateArticle(id, formData);
      toast.success("Artikel berhasil diperbarui!");
    } else {
      addArticle(formData);
      toast.success("Artikel berhasil ditambahkan!");
    }
    navigate("/admin/berita");
  };

  const handleAddSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { title: "", content: "" }]
    });
  };

  const handleRemoveSection = (index: number) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter((_, i) => i !== index)
    });
  };

  const handleSectionChange = (index: number, field: "title" | "content", value: string) => {
    const newSections = [...formData.sections];
    newSections[index][field] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const handleFileUpload = (file: File, type: "main" | "gallery") => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (type === "main") {
        setFormData(prev => ({ ...prev, image: dataUrl }));
        toast.success("Foto utama berhasil dipilih");
      } else {
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, dataUrl] }));
        toast.success("Foto galeri berhasil ditambahkan");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddGallery = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) handleFileUpload(file, "gallery");
    };
    input.click();
  };

  const handleMainImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) handleFileUpload(file, "main");
    };
    input.click();
  };

  const handleRemoveGallery = (index: number) => {
    setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== index) });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/admin/berita" className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-green-900">
          {id ? "Edit Artikel" : "Tambah Artikel Baru"}
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsPreview(!isPreview)}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            {isPreview ? <Edit2 className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isPreview ? "Edit Data" : "Preview Tampilan"}
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Simpan Artikel
          </Button>
        </div>
      </div>

      {isPreview ? (
        <div className="animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl border border-green-50 overflow-hidden mb-12">
            <div className="scale-[0.9] origin-top">
              <ArticleHeader 
                title={formData.title || "Judul Artikel Anda"}
                date={formData.date}
                author={formData.author}
                category={formData.category}
              />
              
              <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20 pb-20">
                <div className="space-y-10">
                  {/* Main Image in Preview */}
                  <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                    <img src={formData.image} alt="Preview main" className="w-full h-full object-cover" />
                  </div>

                  {/* Content Body */}
                  <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-green-50">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {formData.content || "Isi artikel akan muncul di sini..."}
                      </p>
                    </div>
                  </div>

                  {/* Sections Preview */}
                  <div className="grid grid-cols-1 gap-8">
                    {formData.sections.map((section, index) => (
                      <ArticleSection key={index} title={section.title || "Judul Bagian"}>
                        <p>{section.content || "Konten bagian..."}</p>
                      </ArticleSection>
                    ))}
                  </div>

                  {/* Gallery Preview */}
                  {formData.gallery.length > 0 && (
                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-green-50">
                      <PhotoGallery images={formData.gallery} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center bg-amber-50 p-6 rounded-3xl border border-amber-200 mb-8">
            <p className="text-amber-800 font-bold flex items-center justify-center gap-2">
              <Eye className="w-5 h-5" />
              Mode Preview Aktif - Klik "Edit Data" untuk mengubah kembali
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-green-100 shadow-sm mb-6">
            <label className="text-sm font-black text-[#0f5132] uppercase tracking-widest mb-4 block">Foto Utama Artikel</label>
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-64 aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 relative group">
                    <img src={formData.image} alt="Main preview" className="w-full h-full object-cover" />
                    <button 
                        type="button"
                        onClick={handleMainImageUpload}
                        className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
                    >
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-xs font-bold uppercase tracking-wider">Ganti Foto</span>
                    </button>
                </div>
                <div className="flex-1 space-y-2">
                    <p className="text-sm text-gray-500 italic">Pilih foto berkualitas tinggi sebagai sampul artikel Anda. Format yang didukung: JPG, PNG, WEBP.</p>
                    <Button 
                        type="button" 
                        onClick={handleMainImageUpload}
                        className="bg-green-50 text-[#0f5132] hover:bg-green-100 rounded-xl px-6 h-12 font-bold"
                    >
                        Pilih dari Perangkat
                    </Button>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-green-900">Judul Artikel</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Masukkan judul artikel..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-green-900">Tanggal</label>
                    <input 
                        type="date" 
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-green-900">Penulis</label>
                    <input 
                        type="text" 
                        value={formData.author}
                        onChange={e => setFormData({...formData, author: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-green-900">Kategori</label>
                <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                >
                    <option>Kaderisasi</option>
                    <option>Kegiatan</option>
                    <option>Organisasi</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold text-green-900">Status</label>
                <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                >
                    <option>Draft</option>
                    <option>Published</option>
                </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-green-900">Isi Artikel</label>
            <textarea 
              rows={10}
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Tuliskan isi artikel lengkap di sini..."
              required
            ></textarea>
          </div>

          {/* Special Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-green-900 uppercase tracking-wider">Bagian Konten Tambahan</label>
                <Button type="button" size="sm" onClick={handleAddSection} className="bg-green-100 text-green-700 hover:bg-green-200">
                    <Plus className="w-4 h-4 mr-1" /> Tambah Bagian
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {formData.sections.map((section, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 relative group">
                        <button 
                            type="button" 
                            onClick={() => handleRemoveSection(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input 
                                placeholder="Judul Bagian (e.g. Tujuan)" 
                                value={section.title}
                                onChange={e => handleSectionChange(index, "title", e.target.value)}
                                className="px-3 py-2 border rounded-lg outline-none focus:border-green-500"
                            />
                            <textarea 
                                placeholder="Isi Konten Bagian..." 
                                value={section.content}
                                onChange={e => handleSectionChange(index, "content", e.target.value)}
                                className="md:col-span-2 px-3 py-2 border rounded-lg outline-none focus:border-green-500 h-20"
                            ></textarea>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Gallery Upload */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-green-900 uppercase tracking-wider">Galeri Foto</label>
            <div className="flex flex-wrap gap-4">
                {formData.gallery.map((url, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden group shadow-md">
                        <img src={url} className="w-full h-full object-cover" />
                        <button 
                            type="button" 
                            onClick={() => handleRemoveGallery(index)}
                            className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <button 
                    type="button"
                    onClick={handleAddGallery}
                    className="w-24 h-24 border-2 border-dashed border-green-200 rounded-xl flex flex-col items-center justify-center text-green-600 hover:bg-green-50 hover:border-green-400 transition-all"
                >
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold">Add Photo</span>
                </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

import { Edit2 } from "lucide-react";
