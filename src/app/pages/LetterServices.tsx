import { useState } from "react";
import { FileText, Send, CheckCircle, Clock, CheckCircle2, Loader2, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { useLetters } from "../context/LettersContext";
import { useAuth } from "../context/AuthContext";

export function LetterServices() {
  const { addRequest, getRequestsByUser } = useLetters();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    letterType: "",
    description: "",
    phoneNumber: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const myRequests = getRequestsByUser(user?.id || "member-1");

  const services = [
    {
      title: "Surat Rekomendasi",
      description: "Surat rekomendasi untuk berbagai keperluan kegiatan organisasi atau pendidikan",
      icon: "📄",
      color: "green",
    },
    {
      title: "Surat Tugas dan Mandat",
      description: "Surat tugas dan mandat untuk kegiatan atau acara yang memerlukan persetujuan organisasi",
      icon: "📋",
      color: "blue",
    },
    {
      title: "Surat Keterangan Aktif",
      description: "Surat keterangan status keaktifan sebagai anggota IPNU/IPPNU",
      icon: "✅",
      color: "amber",
    },
    {
      title: "Surat Dispensasi",
      description: "Surat dispensasi untuk keperluan izin kegiatan atau acara tertentu",
      icon: "📝",
      color: "purple",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.letterType || !formData.description || !formData.phoneNumber) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    addRequest({
      userId: user?.id || "member-1",
      userName: formData.name,
      type: formData.letterType,
      purpose: formData.description,
    });

    toast.success("Pengajuan surat berhasil dikirim! Tim kami akan segera memprosesnya.");
    setFormData({ ...formData, letterType: "", description: "" });
    setIsOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Menunggu":
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Menunggu</span>;
      case "Diproses":
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Diproses</span>;
      case "Selesai":
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Selesai</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <Card key={service.title} className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border-none bg-white rounded-[2rem] overflow-hidden group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0 transition-transform group-hover:scale-110 duration-500 ${
                        service.color === "green" ? "bg-green-100" :
                        service.color === "blue" ? "bg-blue-100" :
                        service.color === "amber" ? "bg-amber-100" :
                        "bg-purple-100"
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

            {/* CTA Card */}
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
                        <Input
                          placeholder="Masukkan nama lengkap"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all"
                        />
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
                        <Textarea
                          placeholder="Contoh: Mengajukan beasiswa ke Pimpinan Cabang..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="min-h-[100px] rounded-xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="font-bold text-gray-700">Nomor WhatsApp</Label>
                        <Input
                          placeholder="08xxxxxxxxxx"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all"
                        />
                      </div>

                      <Button type="submit" className="w-full bg-[#0f5132] hover:bg-green-900 text-white h-14 rounded-2xl font-black shadow-lg shadow-green-900/20 mt-4 transition-all hover:scale-[1.02] active:scale-95">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        KIRIM PENGAJUAN
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* History Section */}
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
                          <h4 className="font-bold text-gray-800 text-sm">{req.type}</h4>
                          {getStatusBadge(req.status)}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1 mb-3">{req.purpose}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {new Date(req.requestDate).toLocaleDateString('id-ID')}
                            </span>
                            {req.status === "Selesai" && (
                                <Button variant="link" className="h-auto p-0 text-[10px] font-black text-green-600 uppercase tracking-widest">Lihat Hasil</Button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help Card */}
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
    </div>
  );
}