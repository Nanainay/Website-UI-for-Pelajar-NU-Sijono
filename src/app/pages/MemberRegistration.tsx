import { useState } from "react";
import { UserPlus, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { toast } from "sonner";

import { useOrganization } from "../context/OrganizationContext";

export function MemberRegistration() {
  const { addMember } = useOrganization();
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    noHp: "",
    jenisKelamin: "",
    organisasi: "",
    email: "",
    usia: "",
    pendidikan: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.alamat || !formData.noHp || !formData.jenisKelamin || !formData.organisasi || !formData.usia || !formData.pendidikan) {
      toast.error("Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    // Save to OrganizationContext
    addMember({
      name: formData.nama,
      address: formData.alamat,
      phone: formData.noHp,
      status: "Pending", // Set to pending for admin approval
      email: formData.email,
      age: formData.usia,
      gender: formData.jenisKelamin,
      education: formData.pendidikan,
      organization: formData.organisasi.toUpperCase(),
    });

    toast.success("Pendaftaran berhasil! Data Anda telah terkirim ke sistem admin.");
    setFormData({ nama: "", alamat: "", noHp: "", jenisKelamin: "", organisasi: "", email: "", usia: "", pendidikan: "" });
  };

  const contactPersons = [
    {
      name: "Moh. Alwi Andiansyah S.",
      position: "Ketua IPNU",
      organization: "IPNU",
      phone: "+62 812-2998-5524",
      bgColor: "bg-gradient-to-br from-green-100 to-green-200",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      subtextColor: "text-green-600",
      phoneColor: "text-green-700",
    },
    {
      name: "Fina Inayatul Maula",
      position: "Ketua IPPNU",
      organization: "IPPNU",
      phone: "+62 852-2506-1238",
      bgColor: "bg-gradient-to-br from-amber-100 to-amber-200",
      borderColor: "border-amber-200",
      textColor: "text-amber-800",
      subtextColor: "text-amber-600",
      phoneColor: "text-amber-700",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4 shadow-lg">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">Gabung Anggota</h1>
          <p className="text-lg text-green-600 max-w-3xl mx-auto">
            Mari bergabung bersama kami untuk bersama membangun generasi pelajar NU yang berkualitas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-2 border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                <CardTitle className="text-2xl text-green-800">Formulir Pendaftaran</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nama" className="text-green-800 font-semibold">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nama"
                      placeholder="Masukkan nama lengkap"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="border-green-200 focus:border-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alamat" className="text-green-800 font-semibold">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="alamat"
                      placeholder="Masukkan alamat lengkap"
                      value={formData.alamat}
                      onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                      className="border-green-200 focus:border-green-500 min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="usia" className="text-green-800 font-semibold">
                        Usia <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="usia"
                        type="number"
                        placeholder="Masukkan usia"
                        value={formData.usia}
                        onChange={(e) => setFormData({ ...formData, usia: e.target.value })}
                        className="border-green-200 focus:border-green-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pendidikan" className="text-green-800 font-semibold">
                        Pendidikan Terakhir <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="pendidikan"
                        placeholder="SD/SMP/SMA/Kuliah"
                        value={formData.pendidikan}
                        onChange={(e) => setFormData({ ...formData, pendidikan: e.target.value })}
                        className="border-green-200 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="noHp" className="text-green-800 font-semibold">
                        Nomor HP / WhatsApp <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="noHp"
                        type="tel"
                        placeholder="+62 xxx-xxxx-xxxx"
                        value={formData.noHp}
                        onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                        className="border-green-200 focus:border-green-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-green-800 font-semibold">
                        Email (Opsional)
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border-green-200 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-green-800 font-semibold">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup value={formData.jenisKelamin} onValueChange={(value) => setFormData({ ...formData, jenisKelamin: value })}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="laki-laki" id="laki-laki" className="border-green-500 text-green-600" />
                        <Label htmlFor="laki-laki" className="text-green-700 cursor-pointer">Laki-laki</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="perempuan" id="perempuan" className="border-green-500 text-green-600" />
                        <Label htmlFor="perempuan" className="text-green-700 cursor-pointer">Perempuan</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-green-800 font-semibold">
                      Pilih Organisasi <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup value={formData.organisasi} onValueChange={(value) => setFormData({ ...formData, organisasi: value })}>
                      <div className="flex items-center space-x-2 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                        <RadioGroupItem value="ipnu" id="ipnu" className="border-green-500 text-green-600" />
                        <Label htmlFor="ipnu" className="text-green-700 cursor-pointer flex-1">
                          <span className="font-bold">IPNU</span>
                          <span className="block text-sm text-green-600">Ikatan Pelajar Nahdlatul Ulama (Putra)</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border-2 border-amber-200 rounded-lg hover:bg-amber-50 transition-colors">
                        <RadioGroupItem value="ippnu" id="ippnu" className="border-amber-500 text-amber-600" />
                        <Label htmlFor="ippnu" className="text-amber-700 cursor-pointer flex-1">
                          <span className="font-bold">IPPNU</span>
                          <span className="block text-sm text-amber-600">Ikatan Pelajar Putri Nahdlatul Ulama (Putri)</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all">
                      <UserPlus className="mr-2 h-5 w-5" />
                      Daftar Sekarang
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Persons */}
          <div className="space-y-6">
            <Card className="shadow-lg border-2 border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                <CardTitle className="text-xl text-green-800">Contact Person</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {contactPersons.map((person, index) => (
                  <Card key={index} className={`border-2 ${person.borderColor} hover:shadow-md transition-shadow`}>
                    <CardContent className="p-4">
                      <div className={`w-12 h-12 ${person.bgColor} rounded-full flex items-center justify-center text-2xl mb-3`}>
                        👤
                      </div>
                      <h3 className={`font-bold text-lg ${person.textColor} mb-1`}>{person.name}</h3>
                      <p className={`text-sm ${person.subtextColor} mb-3`}>{person.position}</p>
                      <div className={`flex items-center gap-2 ${person.phoneColor}`}>
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{person.phone}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200 shadow-lg">
              <CardContent className="p-6 space-y-3 text-blue-700">
                <h3 className="font-bold text-blue-800 mb-3">Informasi Pendaftaran</h3>
                <p className="text-sm">✓ Pendaftaran gratis tanpa biaya</p>
                <p className="text-sm">✓ Terbuka untuk pelajar di Desa Sijono</p>
                <p className="text-sm">✓ Dapatkan berbagai program pelatihan</p>
                <p className="text-sm">✓ Jaringan luas di seluruh Indonesia</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}