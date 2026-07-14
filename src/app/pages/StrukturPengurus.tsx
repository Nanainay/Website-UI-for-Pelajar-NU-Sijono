import { useState } from "react";
import { useOrganization, Manager, Member } from "../context/OrganizationContext";
import { 
  Users, UserCheck, ShieldCheck, Mail, Phone, Calendar, Search, 
  Award, BookOpen, GraduationCap, ChevronRight, UserCircle, Briefcase, IdCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

export function StrukturPengurus() {
  const { managers, members } = useOrganization();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"IPNU" | "IPPNU">("IPNU");

  // Filter managers by type (IPNU / IPPNU)
  const ipnuManagers = managers.filter(m => m.type === "IPNU");
  const ippnuManagers = managers.filter(m => m.type === "IPPNU");

  // Filter members by organization (IPNU / IPPNU) and status "Aktif"
  const activeMembers = members.filter(m => 
    m.organization === activeTab && 
    m.status === "Aktif" &&
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to structure BPH (Badan Pengurus Harian)
  const getBphStructure = (mgrList: Manager[]) => {
    const ketua = mgrList.filter(m => m.position.toLowerCase() === "ketua");
    
    // Sort secretaries: "Sekretaris" first, then others like "Wakil Sekretaris"
    const sekretaris = mgrList.filter(m => m.position.toLowerCase().includes("sekretaris"))
      .sort((a, b) => {
        if (a.position.toLowerCase() === "sekretaris") return -1;
        if (b.position.toLowerCase() === "sekretaris") return 1;
        return 0;
      });

    // Sort treasurers: "Bendahara" first, then others like "Wakil Bendahara"
    const bendahara = mgrList.filter(m => m.position.toLowerCase().includes("bendahara"))
      .sort((a, b) => {
        if (a.position.toLowerCase() === "bendahara") return -1;
        if (b.position.toLowerCase() === "bendahara") return 1;
        return 0;
      });

    // Other roles
    const others = mgrList.filter(m => 
      m.position.toLowerCase() !== "ketua" && 
      !m.position.toLowerCase().includes("sekretaris") && 
      !m.position.toLowerCase().includes("bendahara")
    );

    return { ketua, sekretaris, bendahara, others };
  };

  const renderManagerCard = (manager: Manager, highlight = false) => (
    <Card 
      key={manager.id} 
      className={`bg-white border-none shadow-lg rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative ${
        highlight ? "ring-2 ring-amber-400" : ""
      }`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-amber-500/10 rounded-full -translate-y-12 translate-x-12 blur-xl pointer-events-none group-hover:scale-150 transition-all duration-700" />
      <CardContent className="p-8 text-center relative z-10 flex flex-col items-center">
        {/* Photo container */}
        <div className={`w-28 h-28 mb-6 rounded-[2rem] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-500 overflow-hidden ${
          highlight 
            ? "bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300" 
            : "bg-gradient-to-br from-green-50 to-green-100 border border-green-100"
        }`}>
          {manager.photo ? (
            <img src={manager.photo} alt={manager.name} className="w-full h-full object-cover" />
          ) : (
            <UserCheck className={`w-12 h-12 ${highlight ? "text-amber-600" : "text-[#0f5132]"}`} />
          )}
        </div>

        {/* Name */}
        <h3 className="font-black text-xl text-gray-900 mb-2 font-poppins line-clamp-1 group-hover:text-[#0f5132] transition-colors">{manager.name}</h3>
        
        {/* Position Badge */}
        <Badge className={`text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-4 ${
          highlight 
            ? "bg-amber-400 hover:bg-amber-500 text-green-950" 
            : "bg-green-50 hover:bg-green-100 text-[#0f5132]"
        }`}>
          {manager.position}
        </Badge>

        {/* Extra info */}
        <div className="space-y-1.5 w-full pt-4 border-t border-gray-100/80 text-left text-xs font-medium text-gray-500">
          {manager.nia && (
            <div className="flex items-center gap-2">
              <IdCard className="h-4.5 w-4.5 text-gray-400 shrink-0" />
              <span>NIA: <span className="font-bold text-gray-700">{manager.nia}</span></span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <ShieldCheck className={`h-4.5 w-4.5 shrink-0 ${highlight ? "text-amber-500" : "text-green-600"}`} />
            <span>Periode: <span className="font-bold text-gray-700">{manager.period}</span></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTabContent = (managersList: Manager[]) => {
    const { ketua, sekretaris, bendahara, others } = getBphStructure(managersList);

    return (
      <div className="space-y-16">
        {/* BPH Organization Tree visualization */}
        <div className="space-y-12">
          <div className="text-center">
            <h3 className="text-2xl font-black text-gray-800 uppercase tracking-wider mb-2 font-poppins">Badan Pengurus Harian</h3>
            <p className="text-sm text-gray-500 font-medium">Pimpinan utama organisasi tingkat ranting Desa Sijono</p>
          </div>

          {/* Level 1: Ketua */}
          {ketua.length > 0 && (
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                {renderManagerCard(ketua[0], true)}
              </div>
            </div>
          )}

          {/* Level 2: Sekretaris & Bendahara */}
          {(sekretaris.length > 0 || bendahara.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Sekretaris Column */}
              <div className="space-y-6">
                <div className="text-center font-bold text-sm text-gray-400 uppercase tracking-widest bg-gray-100/60 py-2 rounded-full mb-2">Sekretariat</div>
                {sekretaris.map(s => renderManagerCard(s))}
              </div>

              {/* Bendahara Column */}
              <div className="space-y-6">
                <div className="text-center font-bold text-sm text-gray-400 uppercase tracking-widest bg-gray-100/60 py-2 rounded-full mb-2">Kebendaharaan</div>
                {bendahara.map(b => renderManagerCard(b))}
              </div>
            </div>
          )}

          {/* Level 3: Others / Departemen / Divisi */}
          {others.length > 0 && (
            <div className="space-y-8 pt-8">
              <div className="text-center">
                <h4 className="text-lg font-black text-gray-800 uppercase tracking-wider mb-2 font-poppins">Anggota Pengurus / Departemen</h4>
                <div className="w-16 h-1 bg-[#0f5132]/20 mx-auto rounded-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {others.map(o => renderManagerCard(o))}
              </div>
            </div>
          )}
        </div>

        {/* Member Directory section */}
        <div className="pt-16 border-t border-gray-200/60 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-[#0f5132] uppercase tracking-wider mb-2 font-poppins">Daftar Anggota Aktif ({activeTab})</h3>
              <p className="text-sm text-gray-500 font-medium">Anggota resmi yang terdaftar dan terverifikasi oleh pengurus</p>
            </div>
            
            {/* Search member */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
              <Input
                type="text"
                placeholder="Cari nama anggota..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-11 h-11 bg-white border-gray-200/80 rounded-2xl text-sm font-medium focus-visible:ring-green-600 focus-visible:border-green-600"
              />
            </div>
          </div>

          {activeMembers.length === 0 ? (
            <Card className="bg-gray-50/50 border-dashed border-2 border-gray-200 rounded-[2.5rem] py-16 text-center">
              <CardContent className="flex flex-col items-center">
                <Users className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-400 font-bold text-lg">Tidak ada anggota aktif yang ditemukan</p>
                <p className="text-gray-400 text-sm font-medium max-w-sm mt-1 mx-auto">
                  Anggota baru yang mendaftar akan muncul di sini setelah disetujui oleh pengurus di panel admin.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeMembers.map(member => (
                <Card key={member.id} className="bg-white border-none shadow-md rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6 flex gap-4">
                    {/* Member Initials Avatar */}
                    <div className="w-14 h-14 bg-gradient-to-tr from-green-50 to-green-100 rounded-2xl flex items-center justify-center text-[#0f5132] font-black text-xl shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-300">
                      {member.name.charAt(0)}
                    </div>
                    {/* Member Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-black text-gray-900 group-hover:text-[#0f5132] transition-colors truncate">{member.name}</h4>
                        {member.nia ? (
                          <span className="text-[10px] text-green-700 font-black bg-green-100 px-2 py-0.5 rounded-md mt-1 inline-block">NIA: {member.nia}</span>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-medium mt-1 inline-block">Belum ada NIA</span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-gray-500 font-semibold mt-3 pt-3 border-t border-gray-50">
                        {member.age && (
                          <div className="flex items-center gap-1.5">
                            <UserCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{member.age} Tahun</span>
                          </div>
                        )}
                        {member.education && (
                          <div className="flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{member.education}</span>
                          </div>
                        )}
                        <div className="col-span-2 flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>Bergabung: <span className="text-gray-700">{new Date(member.joinDate).toLocaleDateString("id-ID", { year: 'numeric', month: 'short', day: 'numeric' })}</span></span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#0f5132] to-green-600 rounded-[2.5rem] mb-6 shadow-2xl rotate-6">
            <Users className="h-10 w-10 text-white -rotate-6" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#0f5132] mb-6 font-poppins tracking-tight uppercase">Struktur Pengurus</h1>
          <p className="text-xl text-green-700 max-w-3xl mx-auto font-medium leading-relaxed">
            Struktur kepengurusan ranting Desa Sijono dan daftar anggota aktif yang terintegrasi secara real-time.
          </p>
        </div>

        {/* Tabs for IPNU / IPPNU Selection */}
        <Tabs defaultValue="IPNU" onValueChange={val => { setActiveTab(val as "IPNU" | "IPPNU"); setSearchTerm(""); }} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-16 p-2 bg-green-50 rounded-[2rem] shadow-inner border border-green-100/50">
            <TabsTrigger 
              value="IPNU" 
              className="rounded-[1.5rem] h-12 font-black uppercase tracking-widest text-xs data-[state=active]:bg-[#0f5132] data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300"
            >
              Pengurus IPNU
            </TabsTrigger>
            <TabsTrigger 
              value="IPPNU" 
              className="rounded-[1.5rem] h-12 font-black uppercase tracking-widest text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300"
            >
              Pengurus IPPNU
            </TabsTrigger>
          </TabsList>

          <TabsContent value="IPNU" className="animate-in fade-in duration-500">
            {renderTabContent(ipnuManagers)}
          </TabsContent>

          <TabsContent value="IPPNU" className="animate-in fade-in duration-500">
            {renderTabContent(ippnuManagers)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
