import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("Selamat Malam");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) setGreeting("Selamat Pagi");
    else if (hour >= 11 && hour < 15) setGreeting("Selamat Siang");
    else if (hour >= 15 && hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");
  }, []);

  const getDashboardPath = (role?: string) => {
    switch (role) {
      case 'super_admin': return '/admin';
      case 'ketua': return '/dashboard/ketua';
      case 'sekretaris': return '/dashboard/sekretaris';
      case 'anggota': return '/dashboard/anggota';
      default: return '/';
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Mohon lengkapi email dan password!");
      return;
    }

    setLoading(true);
    try {
      const loggedInUser = await login(formData.email, formData.password);
      toast.success("Login berhasil!");
      navigate(getDashboardPath(loggedInUser.role));
    } catch (err: any) {
      toast.error(err.message || "Email atau password salah!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-5 font-poppins">
      <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white flex flex-col justify-between p-8 lg:p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18) 0%, transparent 30%),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(180deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '120px 120px, 24px 24px, 24px 24px'
          }} />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">{greeting}</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full mb-6" />
          <p className="text-lg lg:text-xl font-medium mb-4 opacity-95">
            Pimpinan Ranting IPNU IPPNU Desa Sijono
          </p>
          <p className="text-xl lg:text-2xl font-bold italic text-yellow-300 font-playfair">
            Belajar, Berjuang, Bertaqwa
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3 text-sm opacity-90">
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-green-900 text-xs">✓</span>
          </div>
          <span>Masuk sekarang untuk akses anggota dan pengurus.</span>
        </div>
      </div>

      <div className="lg:col-span-3 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src="/images/IPNU.png" alt="IPNU Logo" className="w-12 h-12 object-contain" />
              <img src="/images/IPPNU.png" alt="IPPNU Logo" className="w-12 h-12 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl px-4"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl px-4 pr-12"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                {loading ? "Memproses..." : "Masuk Sekarang"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
              <p className="font-bold text-gray-700">Akun Demo:</p>
              <p>Admin: <span className="font-mono font-bold">admin@example.com / password</span></p>
              <p>Ketua: <span className="font-mono font-bold">ketua@example.com / password</span></p>
              <p>Sekretaris: <span className="font-mono font-bold">sekretaris@example.com / password</span></p>
              <p>Anggota: <span className="font-mono font-bold">anggota@example.com / password</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
