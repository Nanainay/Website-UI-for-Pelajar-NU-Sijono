import { useState } from "react";
import { 
  Shield, Database, Download, Upload, UserPlus, 
  Trash2, ShieldCheck, Info, AlertTriangle, FileJson
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { toast } from "sonner";

export function AdminSettings() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // ── Backup Logic (Export to JSON) ──────────────────────────────────────────
  const handleExportData = () => {
    setIsExporting(true);
    try {
      const data = {
        members: JSON.parse(localStorage.getItem("nu_members") || "[]"),
        managers: JSON.parse(localStorage.getItem("nu_managers") || "[]"),
        news: JSON.parse(localStorage.getItem("nu_articles") || "[]"),
        inventory: JSON.parse(localStorage.getItem("nu_inventory") || "[]"),
        letters: JSON.parse(localStorage.getItem("nu_letters") || "[]"),
        exportDate: new Date().toISOString(),
        version: "1.0"
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `backup_pelajar_nu_sijono_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Data berhasil diekspor! Simpan file ini di tempat yang aman.");
    } catch (error) {
      toast.error("Gagal mengekspor data.");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  // ── Restore Logic (Import from JSON) ─────────────────────────────────────────
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        if (confirm("PERINGATAN: Mengimpor data akan menimpa data yang ada saat ini. Lanjutkan?")) {
          if (data.members) localStorage.setItem("nu_members", JSON.stringify(data.members));
          if (data.managers) localStorage.setItem("nu_managers", JSON.stringify(data.managers));
          if (data.news) localStorage.setItem("nu_articles", JSON.stringify(data.news));
          if (data.inventory) localStorage.setItem("nu_inventory", JSON.stringify(data.inventory));
          if (data.letters) localStorage.setItem("nu_letters", JSON.stringify(data.letters));
          
          toast.success("Data berhasil diimpor! Silakan refresh halaman.");
          setTimeout(() => window.location.reload(), 1500);
        }
      } catch (error) {
        toast.error("Format file tidak valid.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-poppins pb-20">
      {/* Header */}
      <div className="bg-[#0f5132] text-white pt-12 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black flex items-center gap-4 mb-2 uppercase tracking-tight">
            <Shield className="w-10 h-10 text-amber-400" />
            Administrasi & Sistem
          </h1>
          <p className="text-green-100/80 text-lg font-medium">Manajemen keamanan, akun pengurus, dan cadangan data organisasi.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 4.1 Manajemen Pengguna */}
          <Card className="rounded-[2.5rem] shadow-xl border-none overflow-hidden">
            <CardHeader className="bg-white border-b border-gray-50 p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-gray-900">4.1 Manajemen Pengguna</CardTitle>
                  <CardDescription className="font-medium">Otoritas akses admin dan pengurus.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex gap-4">
                <Info className="w-6 h-6 text-blue-500 shrink-0" />
                <p className="text-sm text-blue-700 leading-relaxed font-medium">
                  Saat ini sistem menggunakan konfigurasi kredensial statis untuk keamanan database lokal. Untuk menambah admin baru, silakan hubungi pengembang sistem.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Daftar Akun Aktif
                </h3>
                <div className="divide-y divide-gray-50 border rounded-2xl overflow-hidden">
                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="font-black text-gray-900 text-sm">Administrator Utama</p>
                      <p className="text-xs text-gray-500 font-medium">Username: admin | Role: Super Admin</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">Aktif</span>
                  </div>
                  <div className="p-4 flex justify-between items-center opacity-50">
                    <div>
                      <p className="font-black text-gray-900 text-sm">Sekretaris Ranting</p>
                      <p className="text-xs text-gray-500 font-medium">Username: sekretaris | Role: Admin</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-[10px] font-black uppercase">Non-aktif</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button disabled className="w-full h-12 rounded-2xl font-black bg-gray-100 text-gray-400 gap-2 border-none">
                   Fitur Edit Akun Terkunci (Developer Only)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 4.2 Backup & Restore */}
          <Card className="rounded-[2.5rem] shadow-xl border-none overflow-hidden">
            <CardHeader className="bg-white border-b border-gray-50 p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#0f5132]">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-gray-900">4.2 Backup & Restore</CardTitle>
                  <CardDescription className="font-medium">Cadangkan data organisasi secara berkala.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <Download className="w-4 h-4 text-green-600" /> Ekspor Data
                  </h3>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Unduh seluruh database (Anggota, Inventaris, Berita, Surat) ke dalam file .json untuk disimpan sebagai cadangan fisik.
                </p>
                <Button 
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="w-full h-12 rounded-2xl font-black bg-[#0f5132] hover:bg-green-900 text-white shadow-lg gap-2"
                >
                  <FileJson className="w-5 h-5" />
                  {isExporting ? "Mengekspor..." : "EKSPOR SEMUA DATA (.JSON)"}
                </Button>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-amber-600" /> Impor / Pulihkan Data
                </h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Unggah file cadangan .json untuk memulihkan data. <span className="text-red-500 font-black">Peringatan: Data saat ini akan tertimpa!</span>
                </p>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <Button 
                    variant="outline"
                    className="w-full h-12 rounded-2xl font-black border-2 border-dashed border-gray-200 text-gray-500 hover:bg-gray-50 gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    PILIH FILE CADANGAN
                  </Button>
                </div>
              </div>

              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  <strong>PENTING:</strong> Karena aplikasi menggunakan LocalStorage browser, data dapat terhapus jika Anda melakukan 'Clear History' atau menggunakan 'Incognito Mode'. Lakukan backup setiap hari!
                </p>
              </div>

            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
