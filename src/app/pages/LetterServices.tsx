import { useState, useEffect } from "react";
import { FileText, Send, CheckCircle, Clock, Loader2, History, Eye, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { useLetters, LetterRequest } from "../context/LettersContext";
import { useAuth } from "../context/AuthContext";
import { LetterPreview } from "../components/LetterPreview";
import { exportToPDF, exportToWord } from "../../utils/exportUtils";

const statusColors: Record<string, string> = {
  menunggu: 'bg-amber-100 text-amber-700',
  dicek_sekretaris: 'bg-blue-100 text-blue-700',
  menunggu_ttd_ketua: 'bg-purple-100 text-purple-700',
  selesai: 'bg-green-100 text-green-700',
  ditolak: 'bg-red-100 text-red-600',
};

const statusLabels: Record<string, string> = {
  menunggu: 'Menunggu',
  dicek_sekretaris: 'Diproses Sekretaris',
  menunggu_ttd_ketua: 'Menunggu TTD Ketua',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

export function LetterServices() {
  const { addRequest, getMyLetters } = useLetters();
  const { user } = useAuth();
  const [myRequests, setMyRequests] = useState<LetterRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    targetOrg: "",
    letterType: "",
    description: "",
    phoneNumber: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [previewLetter, setPreviewLetter] = useState<LetterRequest | null>(null);

  useEffect(() => {
    loadMyLetters();
  }, []);

  const loadMyLetters = async () => {
    try {
      const data = await getMyLetters();
      setMyRequests(data);
    } catch (e) {
      console.error(e);
    }
  };

  const services = [
    { title: "Surat Rekomendasi", description: "Surat rekomendasi untuk berbagai keperluan kegiatan organisasi atau pendidikan", icon: "📄", color: "green" },
    { title: "Surat Tugas dan Mandat", description: "Surat tugas dan mandat untuk kegiatan atau acara yang memerlukan persetujuan organisasi", icon: "📋", color: "blue" },
    { title: "Surat Keterangan Aktif", description: "Surat keterangan status keaktifan sebagai anggota IPNU/IPPNU", icon: "✅", color: "amber" },
    { title: "Surat Dispensasi", description: "Surat dispensasi untuk keperluan izin kegiatan atau acara tertentu", icon: "📝", color: "purple" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetOrg || !formData.letterType || !formData.description || !formData.phoneNumber) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    setLoading(true);
    try {
      const typeWithOrg = `${formData.targetOrg}|${formData.letterType}`;
      await addRequest(typeWithOrg, formData.description, formData.phoneNumber, formData.name);
      toast.success("Pengajuan surat berhasil dikirim! Tim kami akan segera memprosesnya.");
      setFormData({ ...formData, letterType: "", description: "", targetOrg: "" });
      setIsOpen(false);
      await loadMyLetters();
    } catch (err: any) {
      toast.error(err.message || "Gagal mengajukan surat");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const color = statusColors[status] || 'bg-gray-100 text-gray-600';
    const label = statusLabels[status] || status;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${color}`}>
        {status === 'menunggu' && <Clock className="w-3 h-3" />}
        {status === 'dicek_sekretaris' && <Loader2 className="w-3 h-3 animate-spin" />}
        {status === 'menunggu_ttd_ketua' && <Clock className="w-3 h-3" />}
        {status === 'selesai' && <CheckCircle className="w-3 h-3" />}
        {status === 'ditolak' && <span className="text-xs">✕</span>}
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#0f5132] to-green-600 rounded-3xl mb-6 shadow-xl rotate-3">
            <FileText className="h-10 w-10 text-white -rotate-3" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0f5132] mb-4 font-poppins">Layanan Surat</h1>
          <p className="text-lg text-green-700 max-w-2xl mx-auto font-medium">
            Sistem pengajuan surat menyurat digital untuk efisiensi administrasi organisasi IPNU IPPNU Sijono.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <Card key={service.title} className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border-none bg-white rounded-[2rem] overflow-hidden group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0 transition-transform group-hover:scale-110 duration-500 ${
                        service.color === "green" ? "bg-green-100" :
                        service.color === "blue" ? "bg-blue-100" :
                        service.color === "amber" ? "bg-amber-100" : "bg-purple-100"
                      }`}>
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-xl text-gray-900 mb-2 font-poppins">{service.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-[#0f5132] text-white border-none shadow-2xl rounded-[3rem] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
              <CardContent className="p-12 text-center relative z-10">
                <h2 className="text-3xl font-black mb-4 font-poppins">Butuh Surat Resmi?</h2>
                <p className="text-lg mb-8 text-green-100 max-w-xl mx-auto">
                  Ajukan surat dengan mudah melalui formulir digital kami. Proses cepat, transparan, dan profesional.
                </p>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-green-950 shadow-xl hover:shadow-2xl transition-all rounded-2xl px-10 h-14 font-black">
                      <Send className="mr-2 h-5 w-5" />
                      AJUKAN SEKARANG
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] bg-white rounded-[2.5rem] p-8 border-none shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-black text-[#0f5132] font-poppins">Form Pengajuan</DialogTitle>
                      <DialogDescription className="text-green-600 font-medium">
                        Silakan lengkapi data berikut untuk diproses oleh admin.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                      <div className="space-y-2">
                        <Label className="font-bold text-gray-700">Nama Lengkap</Label>
                        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-gray-700">Tujuan Pengajuan</Label>
                        <Select value={formData.targetOrg} onValueChange={(value) => setFormData({ ...formData, targetOrg: value })}>
                          <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-gray-50">
                            <SelectValue placeholder="Pilih tujuan surat" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-xl">
                            <SelectItem value="IPNU">Sekretaris IPNU / Ketua IPNU</SelectItem>
                            <SelectItem value="IPPNU">Sekretaris IPPNU / Ketua IPPNU</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-gray-700">Jenis Surat</Label>
                        <Select value={formData.letterType} onValueChange={(value) => setFormData({ ...formData, letterType: value })}>
                          <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-gray-50">
                            <SelectValue placeholder="Pilih jenis surat" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-xl">
                            <SelectItem value="Surat Rekomendasi">Surat Rekomendasi</SelectItem>
                            <SelectItem value="Surat Tugas dan Mandat">Surat Tugas dan Mandat</SelectItem>
                            <SelectItem value="Surat Keterangan Aktif">Surat Keterangan Aktif</SelectItem>
                            <SelectItem value="Surat Dispensasi">Surat Dispensasi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-gray-700">Tujuan / Keperluan</Label>
                        <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="min-h-[100px] rounded-xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-gray-700">Nomor WhatsApp</Label>
                        <Input value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                      </div>
                      <Button type="submit" disabled={loading}
                        className="w-full bg-[#0f5132] hover:bg-green-900 text-white h-14 rounded-2xl font-black shadow-lg shadow-green-900/20 mt-4 transition-all hover:scale-[1.02] active:scale-95">
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                        {loading ? "MENGIRIM..." : "KIRIM PENGAJUAN"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-gray-50/50 p-8 border-b border-gray-100">
                <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <History className="w-6 h-6 text-[#0f5132]" />
                  Riwayat Anda
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {myRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-medium">Belum ada pengajuan</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myRequests.map((req) => (
                      <div key={req.id} className="p-4 rounded-2xl border border-gray-100 hover:border-green-100 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-800 text-sm">{req.type.includes('|') ? req.type.split('|')[1] : req.type}</h4>
                          {getStatusBadge(req.status)}
                        </div>
                        <p className="text-[10px] font-semibold text-green-700 mb-1 bg-green-50 w-max px-2 py-0.5 rounded">Tujuan: {req.type.includes('|') ? req.type.split('|')[0] : 'Umum'}</p>
                        <p className="text-xs text-gray-500 line-clamp-1 mb-2">{req.purpose}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {new Date(req.created_at).toLocaleDateString('id-ID')}
                          </span>
                          {req.status === 'selesai' && (
                            <Button variant="link" onClick={() => setPreviewLetter(req)}
                              className="h-auto p-0 text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Lihat Hasil
                            </Button>
                          )}
                          {req.status === 'ditolak' && req.rejection_reason && (
                            <span className="text-[9px] text-red-400 italic">{req.rejection_reason}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-none rounded-[2.5rem] p-8">
              <h3 className="font-black text-[#0f5132] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informasi
              </h3>
              <ul className="space-y-3 text-sm text-green-800 font-medium">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
                  Proses pengajuan maksimal 3 hari kerja.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
                  Admin akan menghubungi Anda via WhatsApp.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
                  Pastikan tujuan surat ditulis secara lengkap.
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {previewLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setPreviewLetter(null)}>
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between rounded-t-[2rem] z-10">
              <h3 className="font-black text-lg">Preview Surat</h3>
              <div className="flex gap-2">
                {previewLetter.status === 'selesai' && (
                  <>
                    <Button variant="outline" onClick={() => exportToPDF('letter-preview-container', `Surat_${previewLetter.user_name}.pdf`)} className="rounded-xl font-bold">
                      <Download className="w-4 h-4 mr-2" /> PDF
                    </Button>
                    <Button variant="outline" onClick={() => exportToWord('letter-preview-container', `Surat_${previewLetter.user_name}.doc`)} className="rounded-xl font-bold">
                      <Download className="w-4 h-4 mr-2" /> WORD
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setPreviewLetter(null)} className="rounded-xl font-bold">Tutup</Button>
              </div>
            </div>
            <div className="p-8 flex justify-center bg-gray-100">
              {(() => {
                let actualContent = previewLetter.content || '';
                let loadedHijri = "";
                let loadedMasehi = "";
                
                if (actualContent.startsWith("[HIJRI:")) {
                  const match = actualContent.match(/\[HIJRI:(.*?)\]\[MASEHI:(.*?)\]\n(.*)/s);
                  if (match) {
                    loadedHijri = match[1];
                    loadedMasehi = match[2];
                    actualContent = match[3];
                  }
                }
                
                return (
                  <LetterPreview
                    letterNumber={previewLetter.letter_number || ''}
                    content={actualContent}
                    issueDate={""}
                    type={previewLetter.type.includes('|') ? previewLetter.type.split('|')[1] : previewLetter.type}
                    userName={previewLetter.user_name || ''}
                    purpose={previewLetter.purpose}
                    org={previewLetter.type.includes('|') ? previewLetter.type.split('|')[0] : 'IPNU'}
                    sekretarisSignature={previewLetter.sekretaris_signature}
                    sekretarisStamp={previewLetter.sekretaris_stamp}
                    ketuaSignature={previewLetter.ketua_signature}
                    processedByName={previewLetter.processed_by_name}
                    approvedByName={previewLetter.approved_by_name}
                    hijriDate={loadedHijri}
                    masehiDate={loadedMasehi}
                  />
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
