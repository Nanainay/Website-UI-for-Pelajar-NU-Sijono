import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Menu, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: "/tentang-kita", label: "Tentang Kita" },
    { path: "/layanan-surat", label: "Layanan Surat" },
    { path: "/berita", label: "Berita / Artikel" },
    { path: "/gabung-anggota", label: "Gabung Anggota" },
    { path: "/inventaris", label: "Daftar Inventaris" },
  ];

  const adminMenuItems = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/berita", label: "Kelola Berita" },
    { path: "/admin/surat", label: "Kelola Surat" },
    { path: "/admin/anggota", label: "Kelola Anggota" },
    { path: "/admin/inventaris", label: "Kelola Inventaris" },
    { path: "/admin/pengaturan", label: "Pengaturan" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      {/* Unified Green Header */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-green-800 to-green-900 shadow-2xl border-b-2 border-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center h-20">
              {/* Logo and Title */}
              <Link to="/" className="flex items-center gap-3 group mr-2 lg:mr-4">
                <div className="flex items-center">
                  <img 
                    src="/images/logo IPNU IPPNU.PNG" 
                    alt="IPNU IPPNU Logo" 
                    className="h-12 w-auto drop-shadow-lg group-hover:scale-105 transition-all duration-300 object-contain" 
                  />
                </div>
                <h1 className="font-bold text-white text-xl hidden sm:block">Pelajar NU Sijono</h1>
              </Link>

             {/* Desktop Navigation */}
             <div className="hidden lg:flex items-center gap-2">
               {/* Regular Menu Items (hidden for admin) */}
               {user?.role !== "pengurus" && (
                 <div className="flex items-center gap-1 xl:gap-2">
                   <Link
                     to="/"
                     className={`flex items-center gap-1.5 px-2 py-2 rounded-xl transition-all text-white/90 hover:bg-white/10 font-medium whitespace-nowrap text-sm xl:text-base ${isActive('/') ? "bg-white/20" : ""}`}
                   >
                     <span className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0" />
                     <span className="hidden md:inline">Beranda</span>
                   </Link>
                   
                   <div className="relative group">
                     <Link
                       to="/tentang-kita"
                       className={`flex items-center gap-1.5 px-2 py-2 rounded-xl transition-all text-white/90 hover:bg-white/10 font-medium whitespace-nowrap text-sm xl:text-base ${isActive('/tentang-kita') ? "bg-white/20" : ""}`}
                     >
                       <span className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0" />
                       <span className="hidden md:inline">Tentang Kita</span>
                     </Link>
                     <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50">
                       <Link to="/struktur-pengurus" className="block px-4 py-2 text-gray-800 hover:bg-green-50 hover:text-green-700 font-medium text-sm">
                         Struktur Pengurus
                       </Link>
                     </div>
                   </div>

                   {menuItems.slice(1).map((item) => (
                     <Link
                       key={item.path}
                       to={item.path}
                       className={`flex items-center gap-1.5 px-2 py-2 rounded-xl transition-all text-white/90 hover:bg-white/10 font-medium whitespace-nowrap text-sm xl:text-base ${isActive(item.path) ? "bg-white/20" : ""}`}
                     >
                       <span className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0" />
                       <span className="hidden md:inline">{item.label}</span>
                     </Link>
                   ))}
                 </div>
               )}

               {/* Admin Menu Items (only for pengurus role) */}
               {user?.role === "pengurus" && (
                 <div className="flex items-center gap-1 xl:gap-2">
                   {adminMenuItems.map((item) => (
                     <Link
                       key={item.path}
                       to={item.path}
                       className={`flex items-center gap-1.5 px-2 py-2 rounded-xl transition-all text-orange-100 hover:bg-orange-500/20 font-medium whitespace-nowrap text-sm xl:text-base ${isActive(item.path) ? "bg-orange-500/30" : ""}`}
                     >
                       <span className="w-1.5 h-1.5 bg-orange-400 rounded-full shrink-0" />
                       <span className="hidden md:inline">{item.label}</span>
                     </Link>
                   ))}
                 </div>
               )}

             </div>

             {/* Desktop User/Logout */}
             <div className="hidden lg:flex items-center gap-3">
               {user && (
                 <>
                   <div className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl whitespace-nowrap">
                     <span className="text-white text-sm font-medium flex items-center gap-2">
                       <User className="h-4 w-4 shrink-0" />
                       {user.name} ({user.role === "pengurus" ? "Admin" : "Anggota"})
                     </span>
                   </div>
                   <Button
                     onClick={logout}
                     className="bg-red-600 hover:bg-red-700 text-white shadow-md font-semibold px-4 whitespace-nowrap border border-red-500"
                   >
                     <LogOut className="h-4 w-4 mr-2" />
                     Logout
                   </Button>
                 </>
               )}
             </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/20">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gradient-to-br from-green-800 to-green-900 border-l-green-700 text-white w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="text-center pb-4 border-b border-white/20">
                    <h2 className="font-bold text-xl text-white">Pelajar NU Sijono</h2>
                    {user && (
                      <div className="mt-2 px-4 py-2 bg-white/10 rounded-lg">
                        <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs opacity-90">{user?.role === "pengurus" ? "Admin" : "Anggota"}</p>
                    </div>
                  )}
                </div>

                   <div className="flex flex-col gap-2">
                    {user?.role !== "pengurus" && (
                      <>
                        <Link
                          to="/"
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-white/90 hover:bg-white/10 font-medium ${
                            isActive('/') ? "bg-white/20 shadow-md" : ""
                          }`}
                        >
                          <span className="w-2 h-2 bg-amber-400 rounded-full" />
                          <span>Beranda</span>
                        </Link>
                        <Link
                          to="/tentang-kita"
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-white/90 hover:bg-white/10 font-medium ${
                            isActive('/tentang-kita') ? "bg-white/20 shadow-md" : ""
                          }`}
                        >
                          <span className="w-2 h-2 bg-amber-400 rounded-full" />
                          <span>Tentang Kita</span>
                        </Link>
                        <Link
                          to="/struktur-pengurus"
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2 ml-4 rounded-xl transition-all text-white/70 hover:text-white hover:bg-white/5 font-medium text-sm ${
                            isActive('/struktur-pengurus') ? "bg-white/10" : ""
                          }`}
                        >
                          <span>↳ Struktur Pengurus</span>
                        </Link>
                        {menuItems.slice(1).map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-white/90 hover:bg-white/10 font-medium ${
                              isActive(item.path) ? "bg-white/20 shadow-md" : ""
                            }`}
                          >
                            <span className="w-2 h-2 bg-amber-400 rounded-full" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </>
                    )}
                    {user?.role === "pengurus" && (
                      <>
                        <div className="mt-4 pt-4 border-t border-white/20"></div>
                        {adminMenuItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-orange-100 hover:bg-orange-500/20 font-medium ${
                              isActive(item.path) ? "bg-orange-500/30 shadow-md border-r-4 border-orange-400" : ""
                            }`}
                          >
                            <span className="w-2 h-2 bg-orange-400 rounded-full" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </>
                    )}
                  </div>

                   {user && (
                     <Button
                       onClick={() => {
                         logout();
                         setIsOpen(false);
                       }}
                       className="w-full bg-red-600 hover:bg-red-700 text-white mt-4 font-medium"
                     >
                       <LogOut className="h-4 w-4 mr-2" />
                       Logout
                     </Button>
                   )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4 text-amber-400">IPNU IPPNU Desa Sijono</h3>
              <p className="text-green-100 text-sm leading-relaxed">
                Organisasi kepelajaran dan kemahasiswaan Nahdlatul Ulama yang bergerak dalam pembinaan dan pengembangan pelajar.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-amber-400">Kontak</h3>
              <div className="space-y-2 text-sm text-green-100">
                <p>📍 Desa Sijono, Indonesia</p>
                <p>📞 +62 xxx-xxxx-xxxx</p>
                <p>✉️ ipnu.ippnu.sijono@gmail.com</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-amber-400">Jam Pelayanan</h3>
              <div className="space-y-2 text-sm text-green-100">
                <p>Senin - Jumat: 14.00 - 17.00 WIB</p>
                <p>Sabtu: 13.00 - 16.00 WIB</p>
                <p>Minggu & Libur: Tutup</p>
              </div>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-8 text-center text-sm text-green-200">
            <p>&copy; 2026 IPNU IPPNU Desa Sijono. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

