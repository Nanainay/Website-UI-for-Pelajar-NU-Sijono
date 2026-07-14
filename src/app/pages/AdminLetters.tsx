import React, { useState, useEffect } from "react";
import {
  Search, Clock, CheckCircle2, Loader2, ChevronRight,
  Mail, FileText, Save, X, AlertTriangle, User,
  Inbox, MousePointer2, LogOut, Eye, ThumbsUp, Download
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLetters, LetterRequest } from "../context/LettersContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { SignatureUpload } from "../components/SignatureUpload";
import { StampUpload } from "../components/StampUpload";
import { LetterPreview } from "../components/LetterPreview";
import { RoleBadge } from "../components/RoleBadge";
import { exportToPDF, exportToWord } from "../../utils/exportUtils";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  menunggu: { label: 'Menunggu', color: 'bg-amber-100 text-amber-600', icon: <Clock className="w-3 h-3" /> },
  dicek_sekretaris: { label: 'Diproses Sekretaris', color: 'bg-blue-100 text-blue-600', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  menunggu_ttd_ketua: { label: 'Menunggu TTD Ketua', color: 'bg-purple-100 text-purple-600', icon: <Clock className="w-3 h-3" /> },
  selesai: { label: 'Selesai', color: 'bg-green-100 text-green-600', icon: <CheckCircle2 className="w-3 h-3" /> },
  ditolak: { label: 'Ditolak', color: 'bg-red-100 text-red-600', icon: <X className="w-3 h-3" /> },
};

export function AdminLetters() {
  const { user, hasRole, selectedOrg } = useAuth();
  const { requests, prosesLetter, ttdKetuaLetter, tolakLetter, selesaiLetter, refreshLetters } = useLetters();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'menunggu' | 'dicek_sekretaris' | 'menunggu_ttd_ketua' | 'selesai' | 'ditolak'>('all');
  const [loading, setLoading] = useState(false);

  const [letterData, setLetterData] = useState({
    letterNumber: "",
    content: "",
    hijriDate: "",
    masehiDate: "",
    recipientName: "",
    recipientLocation: "",
    sekretarisSignature: "",
    sekretarisStamp: "",
    ketuaSignature: "",
  });

  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    refreshLetters(activeTab === 'all' ? undefined : activeTab);
  }, [activeTab]);

  const selectedRequest = requests.find(r => r.id === selectedRequestId);

  useEffect(() => {
    if (selectedRequest) {
      let letterType = selectedRequest.type.includes('|') ? selectedRequest.type.split('|')[1] : selectedRequest.type;
      let defaultContent = `Diberikan kepada:\n\nNama: ${selectedRequest.user_name}\nKeperluan: ${selectedRequest.purpose}\n\nDemikian surat ini dibuat untuk dapat dipergunakan sebagaimana mestinya.`;
      const org = selectedOrg || (selectedRequest.type.includes('|') ? selectedRequest.type.split('|')[0] : 'IPNU');
      
      if (letterType === 'Surat Keterangan Aktif') {
        if (org === 'IPPNU') {
          defaultContent = `Yang bertanda tangan di bawah ini
      Nama             : Fina Inayatul Maula
      Jabatan          : Ketua PR IPPNU Desa Sijono
      Alamat           : Desa Sijono, RT. 04, RW. 01

Dengan ini menerangkan bahwa
      Nama             : ${selectedRequest.user_name}
      Jabatan          : Anggota
      Alamat           : Sijono

Adalah benar-benar anggota aktif Pimpinan Ranting IPPNU Desa Sijono Kecamatan Warungasem Masa Bakti 2025-2027.
Demikian surat keterangan aktif ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.`;
        } else {
          defaultContent = `Yang bertanda tangan di bawah ini
      Nama             : Moh. Alwi Andiansyah Saputra
      Jabatan          : Ketua PR IPNU Desa Sijono
      Alamat           : Desa Sijono, RT. 02, RW. 01

Dengan ini menerangkan bahwa
      Nama             : ${selectedRequest.user_name}
      Jabatan          : Anggota
      Alamat           : Sijono

Adalah benar-benar anggota aktif Pimpinan Ranting IPNU Desa Sijono Kecamatan Warungasem Masa Bakti 2025-2027.
Demikian surat keterangan aktif ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.`;
        }
      } else if (letterType === 'Surat Dispensasi') {
        defaultContent = `Salam silaturahmi kami sampaikan, semoga Allah SWT, senantiasa memberikan rahmat-Nya kepada kita dalam menjalankan aktifitas sehari-hari, Aamiin.

Berkenaan dengan kegiatan Jalan Sehat yang diselenggarakan oleh ....................... Dengan adanya surat permohonan ini, kami menyampaikan bahwa .................. dengan Identitas, sebagai berikut:

Nama        : ${selectedRequest.user_name}
Jabatan     : Anggota

Dengan ini mengajukan Permohonan Izin tidak masuk kerja pada hari .................... dikarenakan menjadi Panitia Jalan Sehat yang diselenggarakan oleh ......................
Demikian surat permohonan ini kami sampaikan. Atas perhatian dan kerjasamanya kami ucapkan terima kasih.`;
      } else if (letterType === 'Surat Rekomendasi') {
        if (org === 'IPNU') {
          defaultContent = `Yang bertanda tangan di bawah ini:
      1. Nama                  : Moh. Alwi Andiansyah Saputra
         Jabatan               : Ketua PR IPNU Desa Sijono
      2. Nama                  : M Daffa Dhiyaulhaq
         Jabatan               : Sekretaris PR IPNU Desa Sijono

Dengan ini merekomendasikan:
      Nama                  : ${selectedRequest.user_name}
      Tempat, Tanggal Lahir : 
      Alamat                : 

Untuk mengikuti kegiatan ............................ yang dilaksanakan pada hari ....... s.d ........, tanggal ............... di ............

Demikian surat rekomendasi ini dibuat dengan sebenar-benarnya, dan dapat digunakan sebagaimana mestinya.`;
        } else if (org === 'IPPNU') {
          defaultContent = `Yang bertanda tangan di bawah ini:
      1. Nama                  : Fina Inayatul Maula
         Jabatan               : Ketua PR IPPNU Desa Sijono
      2. Nama                  : Anggi Dwi Pratiwi
         Jabatan               : Sekretaris PR IPPNU Desa Sijono

Dengan ini merekomendasikan:
      Nama                  : ${selectedRequest.user_name}
      Tempat, Tanggal Lahir : 
      Alamat                : 

Untuk mengikuti kegiatan ............................ yang dilaksanakan pada hari ....... s.d ........, tanggal ............... di ............

Demikian surat rekomendasi ini dibuat dengan sebenar-benarnya, dan dapat digunakan sebagaimana mestinya.`;
        }
      } else if (letterType === 'Surat Tugas dan Mandat') {
        if (org === 'IPNU') {
          defaultContent = `Yang bertanda tangan di bawah ini:
      1. Nama                  : Moh. Alwi Andiansyah Saputra
         Jabatan               : Ketua
      2. Nama                  : M.Daffa Dhiyaulhaq
         Jabatan               : Sekretaris

Dengan ini menugaskan kepada :
      1. Nama                  : ${selectedRequest.user_name}
         Jabatan               : 
      2. Nama                  : 
         Jabatan               : 

Untuk mengikuti Kegiatan ............. yang dilaksanakan pada hari ...., tanggal ..........

Demikian surat mandat ini dibuat dengan sebenar-benarnya, dan dapat digunakan sebagaimana mestinya.`;
        } else if (org === 'IPPNU') {
          defaultContent = `Yang bertanda tangan di bawah ini:
      1. Nama                  : Fina Inayatul Maula
         Jabatan               : Ketua
      2. Nama                  : Anggi Dwi Pratiwi
         Jabatan               : Sekretaris

Dengan ini menugaskan kepada :
      1. Nama                  : ${selectedRequest.user_name}
         Jabatan               : 
      2. Nama                  : 
         Jabatan               : 

Untuk mengikuti Kegiatan ............. yang dilaksanakan pada hari ...., tanggal ..........

Demikian surat mandat ini dibuat dengan sebenar-benarnya, dan dapat digunakan sebagaimana mestinya.`;
        }
      }

      let actualContent = selectedRequest.content || defaultContent;
      let loadedHijri = "";
      let loadedMasehi = "";
      let loadedKepada = "";
      let loadedTempat = "";
      
      let parsedContent = actualContent;
      const hijriMatch = parsedContent.match(/\[HIJRI:(.*?)\]/);
      if (hijriMatch) { loadedHijri = hijriMatch[1]; parsedContent = parsedContent.replace(/\[HIJRI:.*?\]/, ''); }
      
      const masehiMatch = parsedContent.match(/\[MASEHI:(.*?)\]/);
      if (masehiMatch) { loadedMasehi = masehiMatch[1]; parsedContent = parsedContent.replace(/\[MASEHI:.*?\]/, ''); }
      
      const kepadaMatch = parsedContent.match(/\[KEPADA:(.*?)\]/);
      if (kepadaMatch) { loadedKepada = kepadaMatch[1]; parsedContent = parsedContent.replace(/\[KEPADA:.*?\]/, ''); }
      
      const tempatMatch = parsedContent.match(/\[TEMPAT:(.*?)\]/);
      if (tempatMatch) { loadedTempat = tempatMatch[1]; parsedContent = parsedContent.replace(/\[TEMPAT:.*?\]/, ''); }
      
      if (parsedContent.startsWith('\n')) { parsedContent = parsedContent.substring(1); }
      actualContent = parsedContent;

      setLetterData({
        letterNumber: selectedRequest.letter_number || `001/PC/A/${new Date().getMonth()+1}/2026`,
        content: actualContent,
        hijriDate: loadedHijri,
        masehiDate: loadedMasehi,
        recipientName: loadedKepada,
        recipientLocation: loadedTempat,
        sekretarisSignature: selectedRequest.sekretaris_signature || "",
        sekretarisStamp: selectedRequest.sekretaris_stamp || "",
        ketuaSignature: selectedRequest.ketua_signature || "",
      });
    }
  }, [selectedRequestId]);

  const filteredRequests = requests.filter(req => {
    const isMatchingOrg = !selectedOrg || hasRole('super_admin') || (req.type && req.type.startsWith(selectedOrg + '|'));
    if (!isMatchingOrg) return false;
    
    return req.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           req.type?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleProses = async () => {
    if (!selectedRequestId) return;
    if (!letterData.letterNumber || !letterData.content) {
      toast.error("Nomor surat dan isi surat wajib diisi");
      return;
    }
    if (!letterData.sekretarisSignature) {
      toast.error("TTD Sekretaris wajib diupload");
      return;
    }
    setLoading(true);
    try {
      const finalContent = `[HIJRI:${letterData.hijriDate}][MASEHI:${letterData.masehiDate}][KEPADA:${letterData.recipientName}][TEMPAT:${letterData.recipientLocation}]\n${letterData.content}`;
      await prosesLetter(selectedRequestId, { ...letterData, content: finalContent, issueDate: "" });
      toast.success("Surat diproses dan dikirim ke ketua!");
      setSelectedRequestId(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal memproses surat");
    } finally {
      setLoading(false);
    }
  };

  const handleTtdKetua = async () => {
    if (!selectedRequestId) return;
    if (!letterData.ketuaSignature) {
      toast.error("TTD Ketua wajib diupload");
      return;
    }
    setLoading(true);
    try {
      await ttdKetuaLetter(selectedRequestId, letterData.ketuaSignature);
      toast.success("TTD berhasil diupload dan surat telah disetujui (Selesai)!");
    } catch (err: any) {
      toast.error(err.message || "Gagal upload TTD");
    } finally {
      setLoading(false);
    }
  };

  const handleSelesai = async () => {
    if (!selectedRequestId) return;
    if (!letterData.letterNumber) {
      toast.error("Nomor surat wajib diisi");
      return;
    }
    setLoading(true);
    try {
      await selesaiLetter(selectedRequestId, letterData.letterNumber);
      toast.success("Surat selesai!");
      setSelectedRequestId(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal finalisasi surat");
    } finally {
      setLoading(false);
    }
  };

  const handleTolak = async () => {
    if (!selectedRequestId || !rejectReason) {
      toast.error("Alasan penolakan wajib diisi");
      return;
    }
    setLoading(true);
    try {
      await tolakLetter(selectedRequestId, rejectReason);
      toast.success("Surat ditolak");
      setShowRejectDialog(false);
      setRejectReason("");
      setSelectedRequestId(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal menolak surat");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'all', label: 'Semua' },
    { key: 'menunggu', label: 'Menunggu' },
    { key: 'dicek_sekretaris', label: 'Diproses' },
    { key: 'menunggu_ttd_ketua', label: 'Menunggu TTD' },
    { key: 'selesai', label: 'Selesai' },
  ];

  const canProses = hasRole('sekretaris');
  const canTtdKetua = hasRole('ketua');
  const canSelesai = hasRole('ketua');
  const canTolak = hasRole('sekretaris', 'ketua');

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#f8fafc] overflow-hidden font-poppins">
      <div className="w-[30%] border-r border-gray-200 bg-white flex flex-col shadow-sm z-20">
        <div className="p-6 border-b border-gray-100 bg-[#0f5132]/5">
          <h2 className="text-xl font-black text-[#0f5132] flex items-center gap-2 mb-4">
            <Inbox className="w-6 h-6" />
            PENGAJUAN MASUK
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Cari pengaju..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 h-11 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-100 text-sm font-medium transition-all" />
          </div>
          <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => { setActiveTab(tab.key as any); setSelectedRequestId(null); }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeTab === tab.key ? 'bg-[#0f5132] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
          {filteredRequests.map((req) => (
            <div key={req.id} onClick={() => setSelectedRequestId(req.id)}
              className={`p-5 rounded-[1.5rem] cursor-pointer transition-all duration-300 border-2 ${
                selectedRequestId === req.id
                  ? "bg-green-50 border-green-200 shadow-md scale-[1.02]"
                  : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
              }`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-black text-gray-900 text-sm leading-tight line-clamp-1">{req.user_name}</h3>
                <span className="text-[10px] font-black text-gray-400">{new Date(req.created_at).toLocaleDateString('id-ID')}</span>
              </div>
              <p className="text-xs font-bold text-[#0f5132] mb-1 line-clamp-1">{req.type.includes('|') ? req.type.split('|')[1] : req.type}</p>
              <p className="text-[9px] font-semibold text-green-700 mb-2 bg-green-50 w-max px-2 py-0.5 rounded">Tujuan: {req.type.includes('|') ? req.type.split('|')[0] : 'Umum'}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${statusConfig[req.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                  {statusConfig[req.status]?.icon}
                  {statusConfig[req.status]?.label || req.status}
                </span>
                {selectedRequestId === req.id && <ChevronRight className="w-4 h-4 text-[#0f5132]" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {!selectedRequest ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
            <div className="w-32 h-32 bg-green-50 rounded-[3rem] flex items-center justify-center mb-8 rotate-12 shadow-xl border-4 border-white">
              <MousePointer2 className="w-12 h-12 text-[#0f5132] -rotate-12" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 font-poppins">Pilih Pengajuan</h2>
            <p className="text-gray-400 max-w-md leading-relaxed font-medium">
              Silakan klik salah satu pengajuan di panel kiri untuk mulai memproses.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full">
            <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-5 h-5 text-[#0f5132]" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {selectedRequest.status === 'menunggu' && 'Menunggu Diproses'}
                    {selectedRequest.status === 'dicek_sekretaris' && 'Menunggu TTD Ketua'}
                    {selectedRequest.status === 'menunggu_ttd_ketua' && 'Menunggu Finalisasi'}
                    {selectedRequest.status === 'selesai' && 'Selesai'}
                    {selectedRequest.status === 'ditolak' && 'Ditolak'}
                  </p>
                  <h3 className="text-sm font-black text-gray-900">{selectedRequest.type.includes('|') ? selectedRequest.type.split('|')[1] : selectedRequest.type} - {selectedRequest.user_name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="h-10 px-4 rounded-xl font-bold border-gray-200 text-xs">
                  <Eye className="w-4 h-4 mr-2" /> {showPreview ? 'EDITOR' : 'PREVIEW'}
                </Button>
                {canProses && selectedRequest.status === 'menunggu' && (
                  <Button onClick={handleProses} disabled={loading} className="h-10 px-6 rounded-xl font-black bg-[#0f5132] hover:bg-green-900 text-white text-xs">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    PROSES & KIRIM
                  </Button>
                )}
                {canTtdKetua && selectedRequest.status === 'menunggu_ttd_ketua' && (
                  <Button onClick={handleTtdKetua} disabled={loading} className="h-10 px-6 rounded-xl font-black bg-blue-600 hover:bg-blue-700 text-white text-xs">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ThumbsUp className="w-4 h-4 mr-2" />}
                    SETUJUI & FINALISASI
                  </Button>
                )}
                {selectedRequest.status === 'selesai' && (
                  <>
                    <Button variant="outline" onClick={() => exportToPDF('letter-preview-container', `Surat_${selectedRequest.user_name}.pdf`)} className="h-10 px-4 rounded-xl font-bold border-gray-200 text-xs">
                      <Download className="w-4 h-4 mr-2" /> UNDUH PDF
                    </Button>
                    <Button variant="outline" onClick={() => exportToWord('letter-preview-container', `Surat_${selectedRequest.user_name}.doc`)} className="h-10 px-4 rounded-xl font-bold border-gray-200 text-xs">
                      <Download className="w-4 h-4 mr-2" /> UNDUH WORD
                    </Button>
                  </>
                )}
                {canTolak && !['selesai', 'ditolak'].includes(selectedRequest.status) && (
                  <Button variant="outline" onClick={() => setShowRejectDialog(true)} className="h-10 px-4 rounded-xl font-bold border-red-200 text-red-600 hover:bg-red-50 text-xs">
                    <X className="w-4 h-4 mr-2" /> TOLAK
                  </Button>
                )}
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {!showPreview ? (
                <div className="w-[40%] bg-white border-r border-gray-100 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nomor Surat</label>
                      <Input value={letterData.letterNumber}
                        onChange={e => setLetterData({ ...letterData, letterNumber: e.target.value })}
                        disabled={!canProses || selectedRequest.status !== 'menunggu'}
                        className="h-12 border-gray-100 bg-gray-50 focus:bg-white rounded-xl font-bold disabled:opacity-70 disabled:cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tanggal Hijriyah</label>
                      <Input type="text" value={letterData.hijriDate} placeholder="Misal: 14 Rajab 1447"
                        onChange={e => setLetterData({ ...letterData, hijriDate: e.target.value })}
                        disabled={!canProses || selectedRequest.status !== 'menunggu'}
                        className="h-12 border-gray-100 bg-gray-50 focus:bg-white rounded-xl font-bold disabled:opacity-70 disabled:cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tanggal Masehi</label>
                      <Input type="text" value={letterData.masehiDate} placeholder="Misal: 25 Februari 2026"
                        onChange={e => setLetterData({ ...letterData, masehiDate: e.target.value })}
                        disabled={!canProses || selectedRequest.status !== 'menunggu'}
                        className="h-12 border-gray-100 bg-gray-50 focus:bg-white rounded-xl font-bold disabled:opacity-70 disabled:cursor-not-allowed" />
                    </div>
                    {selectedRequest.type.includes('Surat Dispensasi') && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kepada Yth</label>
                          <Input type="text" value={letterData.recipientName} placeholder="Misal: Bapak Kepala Sekolah"
                            onChange={e => setLetterData({ ...letterData, recipientName: e.target.value })}
                            disabled={!canProses || selectedRequest.status !== 'menunggu'}
                            className="h-12 border-gray-100 bg-gray-50 focus:bg-white rounded-xl font-bold disabled:opacity-70 disabled:cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Di (Tempat)</label>
                          <Input type="text" value={letterData.recipientLocation} placeholder="Misal: TEMPAT atau SEMARANG"
                            onChange={e => setLetterData({ ...letterData, recipientLocation: e.target.value })}
                            disabled={!canProses || selectedRequest.status !== 'menunggu'}
                            className="h-12 border-gray-100 bg-gray-50 focus:bg-white rounded-xl font-bold disabled:opacity-70 disabled:cursor-not-allowed" />
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Isi Surat</label>
                      <Textarea value={letterData.content}
                        onChange={e => setLetterData({ ...letterData, content: e.target.value })}
                        disabled={!canProses || selectedRequest.status !== 'menunggu'}
                        className="min-h-[250px] border-gray-100 bg-gray-50 focus:bg-white rounded-xl font-medium leading-relaxed p-4 disabled:opacity-70 disabled:cursor-not-allowed" />
                    </div>

                    {canProses && selectedRequest.status === 'menunggu' ? (
                      <>
                        <SignatureUpload type="sekretaris" onUpload={(url) => setLetterData({ ...letterData, sekretarisSignature: url })}
                          currentUrl={letterData.sekretarisSignature} />
                        <StampUpload onUpload={(url) => setLetterData({ ...letterData, sekretarisStamp: url })}
                          currentUrl={letterData.sekretarisStamp} />
                      </>
                    ) : (
                      (letterData.sekretarisSignature || letterData.sekretarisStamp) && (
                        <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex gap-4">
                          {letterData.sekretarisSignature && (
                            <div className="flex-1 space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">TTD Sekretaris (Tersimpan)</label>
                              <div className="h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                                <img src={letterData.sekretarisSignature} alt="TTD Sekretaris" className="h-full object-contain p-2" />
                              </div>
                            </div>
                          )}
                          {letterData.sekretarisStamp && (
                            <div className="flex-1 space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Stempel (Tersimpan)</label>
                              <div className="h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                                <img src={letterData.sekretarisStamp} alt="Stempel" className="h-full object-contain p-2" />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )}

                    {canTtdKetua && selectedRequest.status === 'menunggu_ttd_ketua' && (
                      <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-5 mt-4">
                        <h4 className="font-black text-blue-900 text-sm mb-3">Tanda Tangan Ketua</h4>
                        <SignatureUpload type="ketua" onUpload={(url) => setLetterData({ ...letterData, ketuaSignature: url })}
                          currentUrl={letterData.ketuaSignature} />
                      </div>
                    )}
                  </div>

                  <Card className="bg-blue-50 border-none rounded-2xl p-5">
                    <div className="flex gap-4">
                      <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-blue-900 text-xs mb-1">Tujuan Pengajuan</h4>
                        <p className="text-[11px] text-blue-700 leading-relaxed font-medium">{selectedRequest.purpose}</p>
                      </div>
                    </div>
                  </Card>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <User className="w-3 h-3" />
                    <span>Pengaju: {selectedRequest.user_name}</span>
                  </div>
                </div>
              ) : null}

              <div className={`${showPreview ? 'w-full' : 'flex-1'} bg-gray-200 overflow-y-auto p-12 flex justify-center scrollbar-hide`}>
                <LinkifyContent>
                  <LetterPreview
                    letterNumber={letterData.letterNumber}
                    content={letterData.content}
                    issueDate={""}
                    type={selectedRequest.type.includes('|') ? selectedRequest.type.split('|')[1] : selectedRequest.type}
                    userName={selectedRequest.user_name}
                    purpose={selectedRequest.purpose}
                    org={selectedOrg || (selectedRequest.type.includes('|') ? selectedRequest.type.split('|')[0] : 'IPNU')}
                    sekretarisSignature={letterData.sekretarisSignature}
                    sekretarisStamp={letterData.sekretarisStamp}
                    ketuaSignature={letterData.ketuaSignature}
                    processedByName={selectedRequest.processed_by_name}
                    approvedByName={selectedRequest.approved_by_name}
                    hijriDate={letterData.hijriDate}
                    masehiDate={letterData.masehiDate}
                    recipientName={letterData.recipientName}
                    recipientLocation={letterData.recipientLocation}
                  />
                </LinkifyContent>
              </div>
            </div>
          </div>
        )}
      </div>

      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowRejectDialog(false)}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Tolak Surat</h3>
            <p className="text-gray-500 font-medium mb-4">Berikan alasan penolakan untuk pengaju.</p>
            <Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="Alasan penolakan..."
              className="min-h-[120px] border-gray-100 bg-gray-50 rounded-xl mb-4" />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="flex-1 h-12 rounded-2xl font-bold">Batal</Button>
              <Button onClick={handleTolak} disabled={loading || !rejectReason}
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

function LinkifyContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
