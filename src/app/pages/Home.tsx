import { Link } from "react-router";
import { ArrowRight, Users, Zap, Heart, BookOpen, Award } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import IPNULogo from "../../assets/images/IPNU.png";
import IPPNULogo from "../../assets/images/IPPNU.png";

export function Home() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Watermark Background */}
      <div
        className="fixed inset-0 opacity-3 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 48%, rgba(0,0,0,.03) 49%, rgba(0,0,0,.03) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(0,0,0,.03) 49%, rgba(0,0,0,.03) 51%, transparent 52%)
          `,
          backgroundSize: "400px 400px",
          backgroundPosition: "0 0",
          backgroundRepeat: "repeat",
          backgroundAttachment: "fixed",
          zIndex: 0
        }}
      >
        {/* Logo Watermarks */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dy=".3em" font-size="40" font-weight="bold" fill="rgba(22,163,74,0.3)">IPNU</text></svg>'), url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dy=".3em" font-size="35" fill="rgba(217,119,6,0.3)">IPPNU</text></svg>')`,
            backgroundSize: "300px 300px, 300px 300px",
            backgroundPosition: "0 0, 150px 150px",
            backgroundRepeat: "repeat",
            backgroundAttachment: "fixed"
          }}
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10">
        {/* Navigation Spacing */}
        <div className="h-20" />

        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-12 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mx-auto lg:mx-0">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    <span className="text-sm font-medium text-green-700">Pelajar NU</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Selamat Datang di <span className="text-green-600">IPNU IPPNU</span> Desa Sijono
                  </h1>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto lg:mx-0">
                  Organisasi pelajar Nahdlatul ulama yaitu IPNU-IPPNU yang berkomitmen mencetak generasi muda yang berakhlakul karimah, berilmu, serta aktif berkontribusi dalam kehidupan masyarakat, berbangsa, bernegara, dan senantiasa berkhidmat.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                  <Link to="/gabung-anggota">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      Gabung Anggota
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/tentang-kita">
                    <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      Pelajari Lebih Lanjut
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-sm">
                  <div className="absolute inset-0 bg-gradient-to-b from-green-200 to-amber-200 rounded-2xl blur-2xl opacity-50"></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                    <div className="space-y-6">
                      <img src={IPNULogo} alt="IPNU" className="w-full h-40 object-contain" />
                      <img src={IPPNULogo} alt="IPPNU" className="w-full h-40 object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-green-50/50 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Program Unggulan Kami
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Berbagai program dirancang untuk mengembangkan potensi anggota dan berkontribusi kepada masyarakat
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 - IPNU IPPNU Creative Hub */}
              <Card className="border-2 border-green-100 hover:border-green-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-900">IPNU IPPNU Creative Hub</CardTitle>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Program pengembangan keterampilan pelajar di bidang desain, konten digital, dan public speaking untuk meningkatkan kreativitas dan kesiapan menghadapi dunia kerja.
                  </p>
                </CardContent>
              </Card>

              {/* Card 2 - Gerakan Pelajar Produktif (GPP) */}
              <Card className="border-2 border-amber-100 hover:border-amber-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-900">Gerakan Pelajar Produktif (GPP)</CardTitle>
                    </div>
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Zap className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Kegiatan rutin yang dikemas produktif melalui diskusi, ngaji, dan project bersama untuk membangun wawasan serta kekompakan anggota.
                  </p>
                </CardContent>
              </Card>

              {/* Card 3 - Pelajar Peduli */}
              <Card className="border-2 border-red-100 hover:border-red-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-900">Pelajar Peduli</CardTitle>
                    </div>
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Heart className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Program kepedulian sosial melalui kegiatan berbagi, santunan, dan aksi kemanusiaan sebagai bentuk kontribusi nyata kepada masyarakat.
                  </p>
                </CardContent>
              </Card>

              {/* Card 4 - IPNU IPPNU Award */}
              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-900">IPNU IPPNU Award</CardTitle>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Bentuk apresiasi bagi anggota berprestasi dan aktif yang telah memberikan kontribusi positif bagi organisasi.
                  </p>
                </CardContent>
              </Card>

              {/* Card 5 - Media Dakwah Digital */}
              <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-900">Media Dakwah Digital</CardTitle>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Wadah penyebaran dakwah kreatif melalui media sosial dengan konten islami yang menarik dan relevan bagi generasi muda.
                  </p>
                </CardContent>
              </Card>

              {/* Card 6 - Kelas Kepemimpinan (Leadership Class) */}
              <Card className="border-2 border-cyan-100 hover:border-cyan-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-900">Kelas Kepemimpinan (Leadership Class)</CardTitle>
                    </div>
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <Users className="h-5 w-5 text-cyan-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Program pembinaan untuk mencetak kader yang memiliki jiwa kepemimpinan, tanggung jawab, dan kemampuan manajerial yang baik.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Siap Bergabung dengan Kami?
            </h2>
            <p className="text-lg text-green-50 max-w-2xl mx-auto">
              Jadilah bagian dari gerakan pelajar NU yang mengabdi, belajar, dan berkembang bersama. Mari bersama membangun masa depan yang lebih baik.
            </p>
            <div className="flex justify-center pt-4">
              <Link to="/gabung-anggota">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  Daftar Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}