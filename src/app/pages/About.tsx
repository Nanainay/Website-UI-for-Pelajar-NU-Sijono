import { useOrganization } from "../context/OrganizationContext";
import { Users, Target, Eye, Award, ShieldCheck, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export function About() {
  const { managers } = useOrganization();
  
  const ipnuManagers = managers.filter(m => m.type === "IPNU");
  const ippnuManagers = managers.filter(m => m.type === "IPPNU");

  return (
    <div className="min-h-screen py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#0f5132] to-green-600 rounded-[2.5rem] mb-6 shadow-2xl rotate-6">
            <Users className="h-10 w-10 text-white -rotate-6" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#0f5132] mb-6 font-poppins tracking-tight uppercase">Tentang Kita</h1>
          <p className="text-xl text-green-700 max-w-3xl mx-auto font-medium leading-relaxed">
            Mengenal lebih dekat IPNU IPPNU Desa Sijono, visi misi, dan struktur kepengurusan yang berdedikasi.
          </p>
        </div>

        {/* Profile Section */}
        <section className="mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          <Card className="bg-white border-none shadow-2xl rounded-[3.5rem] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 md:p-16 bg-[#0f5132] text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                    <h2 className="text-3xl font-black mb-8 flex items-center gap-4 font-poppins uppercase tracking-wider">
                        <ShieldCheck className="h-10 w-10 text-amber-400" />
                        Profil IPNU IPPNU
                    </h2>
                    <div className="space-y-10">
                        <div>
                            <h3 className="font-black text-amber-400 text-lg mb-3 uppercase tracking-widest">IPNU</h3>
                            <p className="text-green-50 leading-relaxed text-lg">
                                Ikatan Pelajar Nahdlatul Ulama adalah wadah kaderisasi pelajar NU yang berfokus pada pendidikan, 
                                sosial, dan keagamaan untuk mencetak generasi berakhlak mulia dan berwawasan kebangsaan.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-black text-amber-400 text-lg mb-3 uppercase tracking-widest">IPPNU</h3>
                            <p className="text-green-50 leading-relaxed text-lg">
                                Ikatan Pelajar Putri Nahdlatul Ulama berdedikasi dalam pemberdayaan pelajar putri muslimah 
                                yang tangguh, berprestasi, dan memiliki kepedulian sosial tinggi di masyarakat.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-12 md:p-16 flex flex-col justify-center">
                    <div className="grid grid-cols-1 gap-8">
                        <div className="flex gap-6 group">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-[#0f5132] flex-shrink-0 group-hover:bg-[#0f5132] group-hover:text-white transition-all duration-500 shadow-sm">
                                <Target className="h-8 w-8" />
                            </div>
                            <div>
                                <h4 className="font-black text-[#0f5132] text-xl mb-2 font-poppins uppercase">Visi Utama</h4>
                                <p className="text-gray-500 font-medium leading-relaxed">Mewujudkan pelajar NU yang beriman, berilmu, dan berakhlakul karimah melalui pengabdian tulus.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 group">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-[#0f5132] flex-shrink-0 group-hover:bg-[#0f5132] group-hover:text-white transition-all duration-500 shadow-sm">
                                <Award className="h-8 w-8" />
                            </div>
                            <div>
                                <h4 className="font-black text-[#0f5132] text-xl mb-2 font-poppins uppercase">Misi Mulia</h4>
                                <p className="text-gray-500 font-medium leading-relaxed">Membina potensi kader melalui pendidikan berkualitas dan kegiatan sosial yang berdampak nyata.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 group">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-[#0f5132] flex-shrink-0 group-hover:bg-[#0f5132] group-hover:text-white transition-all duration-500 shadow-sm">
                                <Eye className="h-8 w-8" />
                            </div>
                            <div>
                                <h4 className="font-black text-[#0f5132] text-xl mb-2 font-poppins uppercase">Nilai Dasar</h4>
                                <p className="text-gray-500 font-medium leading-relaxed">Aswaja, Tawassuth, Tasamuh, Tawazun, dan semangat Amar Ma'ruf Nahi Munkar dalam setiap langkah.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </Card>
        </section>

        {/* Organizational Structure */}
        <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-400">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#0f5132] mb-4 font-poppins uppercase tracking-tight">Struktur Pengurus</h2>
            <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full" />
          </div>
          
          <Tabs defaultValue="ipnu" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-16 p-2 bg-green-50 rounded-[2rem] shadow-sm">
              <TabsTrigger value="ipnu" className="rounded-[1.5rem] h-12 font-black uppercase tracking-widest text-xs data-[state=active]:bg-[#0f5132] data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                Pengurus IPNU
              </TabsTrigger>
              <TabsTrigger value="ippnu" className="rounded-[1.5rem] h-12 font-black uppercase tracking-widest text-xs data-[state=active]:bg-[#0f5132] data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                Pengurus IPPNU
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ipnu">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {ipnuManagers.map((manager) => (
                  <Card key={manager.id} className="bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                    <CardContent className="p-8 text-center">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-50 to-green-100 rounded-[2rem] flex items-center justify-center text-4xl shadow-md group-hover:scale-110 transition-transform duration-500 overflow-hidden text-[#0f5132]">
                        {manager.photo ? (
                            <img src={manager.photo} alt={manager.name} className="w-full h-full object-cover" />
                        ) : (
                            <UserCheck className="w-10 h-10" />
                        )}
                      </div>
                      <h3 className="font-black text-xl text-gray-900 mb-1 font-poppins">{manager.name}</h3>
                      <p className="text-[#0f5132] text-xs font-black uppercase tracking-widest bg-green-50 py-2 rounded-full mb-4">{manager.position}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{manager.period}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="ippnu">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {ippnuManagers.map((manager) => (
                  <Card key={manager.id} className="bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                    <CardContent className="p-8 text-center">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-50 to-green-100 rounded-[2rem] flex items-center justify-center text-4xl shadow-md group-hover:scale-110 transition-transform duration-500 overflow-hidden text-[#0f5132]">
                        {manager.photo ? (
                            <img src={manager.photo} alt={manager.name} className="w-full h-full object-cover" />
                        ) : (
                            <UserCheck className="w-10 h-10" />
                        )}
                      </div>
                      <h3 className="font-black text-xl text-gray-900 mb-1 font-poppins">{manager.name}</h3>
                      <p className="text-[#0f5132] text-xs font-black uppercase tracking-widest bg-green-50 py-2 rounded-full mb-4">{manager.position}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{manager.period}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}

