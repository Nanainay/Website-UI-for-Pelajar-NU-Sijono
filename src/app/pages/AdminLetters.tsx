import React, { useState, useEffect } from "react";
import { 
  Search, Clock, CheckCircle2, Loader2, ChevronRight, 
  Mail, User, Calendar, FileText, Printer, Save, 
  Info, Layout as LayoutIcon, Inbox, MousePointer2 
} from "lucide-react";
import { useLetters, LetterRequest } from "../context/LettersContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";

export function AdminLetters() {
  const { requests, updateStatus, processLetter } = useLetters();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  
  // Local state for the editor
  const [letterData, setLetterData] = useState({
    letterNumber: "",
    content: "",
    issueDate: new Date().toISOString().split('T')[0],
    signer: "Ketua Pimpinan Anak Cabang",
  });

  const selectedRequest = requests.find(r => r.id === selectedRequestId);

  // Sync editor with selected request
  useEffect(() => {
    if (selectedRequest) {
      if (selectedRequest.status === "Selesai" && selectedRequest.processedData) {
        setLetterData(selectedRequest.processedData);
      } else {
        setLetterData({
          letterNumber: "001/PC/A/X/2026",
          content: `Diberikan kepada:\n\nNama: ${selectedRequest.userName}\nKeperluan: ${selectedRequest.purpose}\n\nDemikian surat ini dibuat untuk dapat dipergunakan sebagaimana mestinya.`,
          issueDate: new Date().toISOString().split('T')[0],
          signer: "Ketua Pimpinan Anak Cabang",
        });
      }
    }
  }, [selectedRequestId]);

  const filteredRequests = requests.filter(req => 
    req.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (selectedRequestId) {
      processLetter(selectedRequestId, letterData);
      toast.success("Surat berhasil diselesaikan!");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Menunggu": return <Clock className="w-4 h-4 text-amber-500" />;
      case "Diproses": return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "Selesai": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#f8fafc] overflow-hidden font-poppins">
      {/* LEFT COLUMN: 30% - Request List */}
      <div className="w-[30%] border-r border-gray-200 bg-white flex flex-col shadow-sm z-20">
        <div className="p-6 border-b border-gray-100 bg-[#0f5132]/5">
            <h2 className="text-xl font-black text-[#0f5132] flex items-center gap-2 mb-4">
                <Inbox className="w-6 h-6" />
                PENGAJUAN MASUK
            </h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Cari pengaju..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 h-11 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-100 text-sm font-medium transition-all"
                />
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {filteredRequests.map((req) => (
                <div 
                    key={req.id}
                    onClick={() => setSelectedRequestId(req.id)}
                    className={`p-5 rounded-[1.5rem] cursor-pointer transition-all duration-300 border-2 ${
                        selectedRequestId === req.id 
                        ? "bg-green-50 border-green-200 shadow-md scale-[1.02]" 
                        : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-black text-gray-900 text-sm leading-tight line-clamp-1">{req.userName}</h3>
                        <span className="text-[10px] font-black text-gray-400">{new Date(req.requestDate).toLocaleDateString('id-ID')}</span>
                    </div>
                    <p className="text-xs font-bold text-[#0f5132] mb-3 line-clamp-1">{req.type}</p>
                    <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${
                            req.status === "Menunggu" ? "bg-amber-100 text-amber-600" :
                            req.status === "Diproses" ? "bg-blue-100 text-blue-600" :
                            "bg-green-100 text-green-600"
                        }`}>
                            {getStatusIcon(req.status)}
                            {req.status}
                        </span>
                        {selectedRequestId === req.id && <ChevronRight className="w-4 h-4 text-[#0f5132]" />}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* RIGHT COLUMN: 70% - Editor & Preview */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {!selectedRequest ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20 animate-in fade-in duration-700">
                <div className="w-32 h-32 bg-green-50 rounded-[3rem] flex items-center justify-center mb-8 rotate-12 shadow-xl border-4 border-white">
                    <MousePointer2 className="w-12 h-12 text-[#0f5132] -rotate-12" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4 font-poppins">Pilih Pengajuan</h2>
                <p className="text-gray-400 max-w-md leading-relaxed font-medium">
                    Silakan klik salah satu pengajuan di panel kiri untuk mulai memproses dan membuat surat digital.
                </p>
            </div>
        ) : (
            <div className="flex-1 flex flex-col h-full">
                {/* Editor Header */}
                <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="w-5 h-5 text-[#0f5132]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Memproses Surat</p>
                            <h3 className="text-sm font-black text-gray-900">{selectedRequest.type} - {selectedRequest.userName}</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-10 px-4 rounded-xl font-bold border-gray-200 text-xs">
                            <Printer className="w-4 h-4 mr-2" /> CETAK
                        </Button>
                        <Button onClick={handleSave} className="h-10 px-6 rounded-xl font-black bg-[#0f5132] hover:bg-green-900 text-white shadow-lg shadow-green-900/20 text-xs">
                            <Save className="w-4 h-4 mr-2" /> SIMPAN SELESAI
                        </Button>
                    </div>
                </div>

                {/* Split Screen: Form & Preview */}
                <div className="flex-1 flex overflow-hidden">
                    {/* SUB-COLUMN: Editor (40% of right area) */}
                    <div className="w-[40%] bg-white border-r border-gray-100 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nomor Surat</label>
                                <Input 
                                    value={letterData.letterNumber}
                                    onChange={e => setLetterData({...letterData, letterNumber: e.target.value})}
                                    className="h-12 border-gray-100 bg-gray-50 focus:bg-white rounded-xl font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tanggal Terbit</label>
                                <Input 
                                    type="date"
                                    value={letterData.issueDate}
                                    onChange={e => setLetterData({...letterData, issueDate: e.target.value})}
                                    className="h-12 border-gray-100 bg-gray-50 focus:bg-white rounded-xl font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Isi Surat</label>
                                <Textarea 
                                    value={letterData.content}
                                    onChange={e => setLetterData({...letterData, content: e.target.value})}
                                    className="min-h-[250px] border-gray-100 bg-gray-50 focus:bg-white rounded-xl font-medium leading-relaxed p-4"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Penandatangan</label>
                                <Input 
                                    value={letterData.signer}
                                    onChange={e => setLetterData({...letterData, signer: e.target.value})}
                                    className="h-12 border-gray-100 bg-gray-50 focus:bg-white rounded-xl font-bold"
                                />
                            </div>
                        </div>

                        <Card className="bg-blue-50 border-none rounded-2xl p-5">
                            <div className="flex gap-4">
                                <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-blue-900 text-xs mb-1">Tujuan Pengajuan</h4>
                                    <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                                        {selectedRequest.purpose}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* SUB-COLUMN: Preview (60% of right area) */}
                    <div className="flex-1 bg-gray-200 overflow-y-auto p-12 flex justify-center scrollbar-hide">
                        {/* A4 Paper Container */}
                        <div className="w-[100%] max-w-[800px] min-h-[1100px] bg-white shadow-2xl p-[15mm] font-serif text-[#1e293b] flex flex-col relative scale-[0.95] origin-top">
                            {/* Letter Header */}
                            <div className="border-b-4 border-double border-gray-900 pb-4 mb-6 text-center">
                                <h3 className="text-lg font-bold uppercase tracking-widest leading-tight">Ikatan Pelajar Nahdlatul Ulama</h3>
                                <h3 className="text-lg font-bold uppercase tracking-widest leading-tight">Ikatan Pelajar Putri Nahdlatul Ulama</h3>
                                <p className="text-[10px] font-bold uppercase mt-1">Pimpinan Anak Cabang Sijono</p>
                                <p className="text-[8px] font-medium mt-1">Sekretariat: Jl. Raya Sijono No. 123, Kab. Batang, Jawa Tengah</p>
                            </div>

                            {/* Letter Meta */}
                            <div className="flex justify-between items-start mb-8 text-[12px]">
                                <div className="space-y-0.5">
                                    <p>Nomor : <span className="font-bold">{letterData.letterNumber || "..."}</span></p>
                                    <p>Lamp : -</p>
                                    <p>Perihal : <span className="font-bold uppercase underline underline-offset-4">{selectedRequest.type}</span></p>
                                </div>
                                <div className="text-right">
                                    <p>Sijono, {new Date(letterData.issueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mb-4 text-[12px] italic font-medium">
                                <p>Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
                            </div>

                            <div className="flex-1 text-[12px] leading-[1.6] text-justify whitespace-pre-line mb-8">
                                {letterData.content || "Isi surat akan muncul di sini saat Anda mengetik..."}
                            </div>

                            <div className="mb-8 text-[12px] italic font-medium">
                                <p>Wallahul Muwafiq Ila Aqwamit Thariq,</p>
                                <p>Wassalamu'alaikum Warahmatullahi Wabarakatuh.</p>
                            </div>

                            {/* Signatures */}
                            <div className="grid grid-cols-2 gap-8 text-[12px]">
                                <div className="text-center">
                                    <p className="mb-16">Pimpinan Anak Cabang,</p>
                                    <p className="font-bold underline underline-offset-4">MUHAMMAD WILDAN</p>
                                    <p className="text-[10px]">Ketua PAC IPNU</p>
                                </div>
                                <div className="text-center">
                                    <p className="mb-16">Dikeluarkan Oleh,</p>
                                    <p className="font-bold underline underline-offset-4">{letterData.signer.toUpperCase() || "..."}</p>
                                    <p className="text-[10px]">Administrasi Digital</p>
                                </div>
                            </div>

                            {/* Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none rotate-45">
                                <h1 className="text-8xl font-black border-8 border-gray-900 p-8 uppercase tracking-widest">LIVE PREVIEW</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
