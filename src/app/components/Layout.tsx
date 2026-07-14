import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { 
  Menu, 
  LogOut, 
  User, 
  Home, 
  Info, 
  Users, 
  Mail, 
  Newspaper, 
  UserPlus, 
  Package, 
  Settings, 
  LayoutDashboard, 
  ChevronDown, 
  ChevronRight,
  Shield,
  Crown,
  ShieldCheck,
  LogIn,
  FileText,
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  ArrowUp
} from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useAuth } from "../context/AuthContext";
import { useOrganization } from "../context/OrganizationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className={className}>
    <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
  </svg>
);

interface MenuItem {
  path: string;
  label: string;
  icon: any;
  submenu?: MenuItem[];
}

function getRoleConfig(role: string) {
  switch (role) {
    case "super_admin":
      return {
        label: "Super Admin",
        badgeClass: "bg-red-500/20 text-red-300 border border-red-500/30",
        menuColor: "orange",
        dashboardPath: "/admin",
      };
    case "ketua":
      return {
        label: "Ketua",
        badgeClass: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
        menuColor: "amber",
        dashboardPath: "/dashboard/ketua",
      };
    case "sekretaris":
      return {
        label: "Sekretaris",
        badgeClass: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
        menuColor: "blue",
        dashboardPath: "/dashboard/sekretaris",
      };
    default:
      return {
        label: "Anggota",
        badgeClass: "bg-green-500/20 text-green-300 border border-green-500/30",
        menuColor: "green",
        dashboardPath: "/dashboard/anggota",
      };
  }
}

function getMenuItems(role: string): { publicMenu: MenuItem[]; roleMenu: MenuItem[] } {
  const publicMenu: MenuItem[] = [
    { path: "/", label: "Beranda", icon: Home },
    { 
      path: "/tentang-kita", 
      label: "Tentang Kita", 
      icon: Info, 
      submenu: [
        { path: "/struktur-pengurus", label: "Struktur Pengurus", icon: Users }
      ]
    },
    { path: "/layanan-surat", label: "Layanan Surat", icon: Mail },
    { path: "/berita", label: "Berita / Artikel", icon: Newspaper },
    { path: "/gabung-anggota", label: "Gabung Anggota", icon: UserPlus },
    { path: "/inventaris", label: "Daftar Inventaris", icon: Package },
  ];

  let roleMenu: MenuItem[] = [];

  switch (role) {
    case "super_admin":
      roleMenu = [
        { path: "/admin", label: "Dashboard Admin", icon: LayoutDashboard },
        { path: "/admin/anggota", label: "Kelola Anggota", icon: Users },
        { path: "/admin/surat", label: "Kelola Surat", icon: Mail },
        { path: "/admin/berita", label: "Kelola Berita", icon: Newspaper },
        { path: "/admin/inventaris", label: "Kelola Inventaris", icon: Package },
        { path: "/admin/log-akses", label: "Log Akses Login", icon: LogIn },
        { path: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
      ];
      break;
    case "ketua":
      roleMenu = [
        { path: "/dashboard/ketua", label: "Dashboard Ketua", icon: Crown },
        { path: "/admin/surat", label: "Kelola Surat", icon: Mail },
      ];
      break;
    case "sekretaris":
      roleMenu = [
        { path: "/dashboard/sekretaris", label: "Dashboard Sekretaris", icon: ShieldCheck },
        { path: "/admin/surat", label: "Kelola Surat", icon: Mail },
        { path: "/admin/berita", label: "Kelola Berita", icon: Newspaper },
        { path: "/admin/inventaris", label: "Kelola Inventaris", icon: Package },
      ];
      break;
    case "anggota":
    default:
      roleMenu = [
        { path: "/dashboard/anggota", label: "Dashboard Saya", icon: LayoutDashboard },
      ];
      break;
  }

  return { publicMenu, roleMenu };
}

// Color classes by role
function getRoleMenuColors(role: string) {
  switch (role) {
    case "super_admin":
      return {
        activeGradient: "bg-gradient-to-r from-red-500/20 to-red-600/5",
        activeText: "text-red-300",
        activeBorder: "border-l-4 border-red-400",
        activeIcon: "text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]",
        hoverBg: "hover:bg-red-500/10",
        hoverText: "hover:text-red-200",
        inactiveIcon: "text-red-300/60 group-hover:text-red-300",
        sectionLabel: "text-red-400/80",
      };
    case "ketua":
      return {
        activeGradient: "bg-gradient-to-r from-amber-500/20 to-amber-600/5",
        activeText: "text-amber-300",
        activeBorder: "border-l-4 border-amber-400",
        activeIcon: "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]",
        hoverBg: "hover:bg-amber-500/10",
        hoverText: "hover:text-amber-200",
        inactiveIcon: "text-amber-300/60 group-hover:text-amber-300",
        sectionLabel: "text-amber-400/80",
      };
    case "sekretaris":
      return {
        activeGradient: "bg-gradient-to-r from-blue-500/20 to-blue-600/5",
        activeText: "text-blue-300",
        activeBorder: "border-l-4 border-blue-400",
        activeIcon: "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]",
        hoverBg: "hover:bg-blue-500/10",
        hoverText: "hover:text-blue-200",
        inactiveIcon: "text-blue-300/60 group-hover:text-blue-300",
        sectionLabel: "text-blue-400/80",
      };
    default:
      return {
        activeGradient: "bg-gradient-to-r from-amber-500/20 to-amber-600/5",
        activeText: "text-amber-300",
        activeBorder: "border-l-4 border-amber-400",
        activeIcon: "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]",
        hoverBg: "hover:bg-white/5",
        hoverText: "hover:text-white",
        inactiveIcon: "text-white/60 group-hover:text-amber-300",
        sectionLabel: "text-amber-400/80",
      };
  }
}

export function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTentangKitaOpen, setIsTentangKitaOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();
  const { user, logout, selectedOrg, setSelectedOrg } = useAuth();
  const { managers } = useOrganization();

  const userRole = user?.role || "anggota";
  const roleConfig = getRoleConfig(userRole);
  const { publicMenu, roleMenu } = getMenuItems(userRole);
  const roleColors = getRoleMenuColors(userRole);

  const getDisplayName = () => {
    if (!user) return "";
    if ((userRole === 'ketua' || userRole === 'sekretaris') && selectedOrg) {
      const manager = managers.find(m => m.type === selectedOrg && m.position.toLowerCase() === userRole);
      if (manager) return manager.name;
    }
    return user.name;
  };
  const displayName = getDisplayName();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const renderMenuItem = (item: MenuItem, onClick?: () => void) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    if (item.submenu) {
      return (
        <div key={item.path} className="space-y-1">
          <button
            onClick={() => setIsTentangKitaOpen(!isTentangKitaOpen)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group cursor-pointer ${active ? "bg-white/10 text-white font-semibold" : "text-white/80 hover:bg-white/5 hover:text-white"}`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`h-5 w-5 transition duration-300 shrink-0 ${active ? "text-amber-400" : "text-white/60 group-hover:text-amber-300"}`} />
              <span>{item.label}</span>
            </div>
            {isTentangKitaOpen ? (
              <ChevronDown className="h-4 w-4 text-white/50 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-white/50 shrink-0" />
            )}
          </button>
          {isTentangKitaOpen && (
            <div className="pl-9 pr-2 space-y-1 animate-in slide-in-from-top-1 duration-200">
              {item.submenu.map((sub) => {
                const SubIcon = sub.icon;
                const subActive = isActive(sub.path);
                return (
                  <Link
                    key={sub.path}
                    to={sub.path}
                    onClick={onClick}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${subActive ? "bg-amber-500/20 text-amber-300 border-l-2 border-amber-400 font-semibold" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                  >
                    <SubIcon className="h-4 w-4 shrink-0" />
                    <span>{sub.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${active ? "bg-gradient-to-r from-amber-500/20 to-amber-600/5 text-amber-300 border-l-4 border-amber-400 font-semibold shadow-sm" : "text-white/80 hover:bg-white/5 hover:text-white"}`}
      >
        <Icon className={`h-5 w-5 transition duration-300 shrink-0 ${active ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "text-white/60 group-hover:text-amber-300"}`} />
        <span>{item.label}</span>
      </Link>
    );
  };

  const renderRoleMenuItem = (item: MenuItem, onClick?: () => void) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${active ? `${roleColors.activeGradient} ${roleColors.activeText} ${roleColors.activeBorder} font-semibold shadow-sm` : `text-white/80 ${roleColors.hoverBg} ${roleColors.hoverText}`}`}
      >
        <Icon className={`h-5 w-5 transition duration-300 shrink-0 ${active ? roleColors.activeIcon : roleColors.inactiveIcon}`} />
        <span>{item.label}</span>
      </Link>
    );
  };

  const roleSectionLabel = userRole === "super_admin" ? "Panel Admin" : 
    userRole === "ketua" ? "Menu Ketua" : 
    userRole === "sekretaris" ? "Menu Sekretaris" : "Menu Saya";

  const showOrgSelection = (userRole === "ketua" || userRole === "sekretaris") && !selectedOrg;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex flex-col lg:flex-row">
      <Dialog open={showOrgSelection}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border-none shadow-2xl [&>button]:hidden">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-black text-[#0f5132] font-poppins text-center">Pilih Akses Organisasi</DialogTitle>
            <DialogDescription className="text-center">
              Pilih sebagai pengurus IPNU atau IPPNU untuk melanjutkan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button onClick={() => setSelectedOrg('IPNU')}
              className="flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-2xl border-2 border-green-200 hover:border-green-400 transition-all group">
              <img src="/images/IPNU.png" alt="IPNU" className="w-16 h-16 object-contain mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-green-900">IPNU</span>
            </button>
            <button onClick={() => setSelectedOrg('IPPNU')}
              className="flex flex-col items-center justify-center p-6 bg-amber-50 hover:bg-amber-100 rounded-2xl border-2 border-amber-200 hover:border-amber-400 transition-all group">
              <img src="/images/IPPNU.png" alt="IPPNU" className="w-16 h-16 object-contain mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-amber-900">IPPNU</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-gradient-to-b from-green-800 to-green-950 border-r border-green-700/50 text-white z-40 justify-between shadow-2xl">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo & Header */}
          <div className="p-6 border-b border-green-700/50">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-amber-400/30 blur-sm group-hover:bg-amber-400/50 transition duration-300"></div>
                <img 
                  src="/images/logo IPNU IPPNU.PNG" 
                  alt="IPNU IPPNU Logo" 
                  className="relative h-12 w-auto drop-shadow-lg group-hover:scale-105 transition-all duration-300 object-contain" 
                />
              </div>
              <div>
                <h1 className="font-bold text-white text-lg tracking-wide group-hover:text-amber-300 transition duration-300">Pelajar NU Sijono</h1>
              </div>
            </Link>
          </div>

          {/* User Profile Card */}
          {user && (
            <div className="px-4 py-3 mx-4 my-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col gap-2 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-green-950 font-bold shadow-md shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-white leading-tight">{displayName}</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 mt-1 rounded-full ${roleConfig.badgeClass}`}>
                    {roleConfig.label} {selectedOrg ? ` ${selectedOrg}` : ''}
                  </span>
                </div>
              </div>
              {(userRole === 'sekretaris' || userRole === 'ketua') && (
                <button onClick={() => setSelectedOrg(null)} className="mt-1 w-full text-[10px] py-1 bg-white/10 hover:bg-white/20 rounded font-semibold text-center transition-colors">
                  Ganti Organisasi
                </button>
              )}
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-green-700">
            {/* Role-specific Menu Items */}
            {roleMenu.length > 0 && (
              <>
                <div className={`px-3 py-2 text-[10px] font-bold ${roleColors.sectionLabel} uppercase tracking-wider`}>
                  {roleSectionLabel}
                </div>
                {roleMenu.map((item) => renderRoleMenuItem(item))}
                <div className="h-4"></div>
              </>
            )}

            {/* Public Menu Items */}
            {publicMenu.map((item) => renderMenuItem(item))}
          </div>
        </div>

        {/* Desktop Logout Footer */}
        <div className="p-4 border-t border-green-700/50">
          <Button
            onClick={logout}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md font-semibold px-4 py-2.5 rounded-xl border border-red-500/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between h-16 px-4 bg-gradient-to-r from-green-800 to-green-900 shadow-lg border-b border-green-700">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img 
            src="/images/logo IPNU IPPNU.PNG" 
            alt="IPNU IPPNU Logo" 
            className="h-10 w-auto drop-shadow-md object-contain" 
          />
          <span className="font-bold text-white text-lg tracking-wide group-hover:text-amber-300 transition duration-300">Pelajar NU Sijono</span>
        </Link>

        {/* Drawer Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-xl">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-gradient-to-br from-green-800 to-green-950 border-r border-green-700 text-white w-[280px] p-0 flex flex-col justify-between">
            <div className="flex flex-col h-full justify-between">
              <div className="flex flex-col flex-1 min-h-0">
                {/* Mobile Drawer Header */}
                <div className="p-5 border-b border-green-700/50 flex items-center gap-3">
                  <img 
                    src="/images/logo IPNU IPPNU.PNG" 
                    alt="IPNU IPPNU Logo" 
                    className="h-10 w-auto drop-shadow-md object-contain" 
                  />
                  <span className="font-bold text-white text-lg tracking-wide group-hover:text-amber-300 transition duration-300">Pelajar NU Sijono</span>
                </div>

                {/* Mobile User Profile Card */}
                {user && (
                  <div className="px-4 py-2.5 mx-3 my-3 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-green-950 font-bold shadow-md shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate text-white leading-tight">{displayName}</p>
                        <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 mt-1 rounded-full ${roleConfig.badgeClass}`}>
                          {roleConfig.label} {selectedOrg ? ` ${selectedOrg}` : ''}
                        </span>
                      </div>
                    </div>
                    {(userRole === 'sekretaris' || userRole === 'ketua') && (
                      <button onClick={() => setSelectedOrg(null)} className="w-full text-[10px] py-1 bg-white/10 hover:bg-white/20 rounded font-semibold text-center transition-colors">
                        Ganti Organisasi
                      </button>
                    )}
                  </div>
                )}

                {/* Mobile Drawer Nav links */}
                <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                  {/* Role-specific Menu Items */}
                  {roleMenu.length > 0 && (
                    <>
                      <div className={`px-3 py-2 text-[10px] font-bold ${roleColors.sectionLabel} uppercase tracking-wider`}>
                        {roleSectionLabel}
                      </div>
                      {roleMenu.map((item) => renderRoleMenuItem(item, () => setIsOpen(false)))}
                      <div className="h-4"></div>
                    </>
                  )}

                  {/* Public Menu Items */}
                  {publicMenu.map((item) => renderMenuItem(item, () => setIsOpen(false)))}
                </div>
              </div>

              {/* Mobile Drawer Logout Footer */}
              {user && (
                <div className="p-4 border-t border-green-700/50">
                  <Button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md font-semibold px-4 py-2.5 rounded-xl border border-red-500/20 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span>Logout</span>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* RIGHT SIDE CONTAINER FOR MAIN CONTENT & FOOTER */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Main Content Area */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* NEW MODERN FOOTER */}
        <footer className="bg-[#0b3f27] text-white mt-auto relative overflow-hidden">
          {/* Subtle Background Pattern/Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f5132] to-[#0b3f27] opacity-90 z-0"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              
              {/* Kolom 1: Tentang Organisasi */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-6 text-white border-b-2 border-amber-400 pb-2 inline-block uppercase tracking-wider">
                    IPNU IPPNU Desa Sijono
                  </h3>
                  <p className="text-green-100/80 text-sm leading-relaxed font-medium">
                    Organisasi kepelajaran dan kemahasiswaan Nahdlatul Ulama yang bergerak dalam pembinaan dan pengembangan pelajar.
                  </p>
                </div>
                <div className="pt-4 border-t border-green-700/50">
                  <p className="font-black text-amber-400 italic text-sm tracking-wide">
                    "Belajar • Berjuang • Bertaqwa"
                  </p>
                </div>
              </div>

              {/* Kolom 2: Menu Cepat */}
              <div>
                <h3 className="font-bold text-lg mb-6 text-white border-b-2 border-amber-400 pb-2 inline-block">Menu Cepat</h3>
                <nav className="flex flex-col space-y-4">
                  {publicMenu.slice(0, 5).map((item) => (
                    <Link 
                      key={item.path} 
                      to={item.path}
                      className="text-green-100/80 hover:text-amber-400 text-sm font-medium transition-all duration-300 flex items-center gap-2 group"
                    >
                      <ChevronRight className="h-4 w-4 text-amber-400/50 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Kolom 3: Kontak */}
              <div>
                <h3 className="font-bold text-lg mb-6 text-white border-b-2 border-amber-400 pb-2 inline-block">Hubungi Kami</h3>
                <address className="not-italic space-y-4">
                  <div className="flex items-start gap-3 group">
                    <div className="p-2 bg-green-800/50 rounded-lg group-hover:bg-amber-400/20 transition-colors">
                      <MapPin className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">Alamat</p>
                      <p className="text-sm text-green-100/80 leading-relaxed font-medium">
                        Desa Sijono<br />
                        Kecamatan Warungasem<br />
                        Kabupaten Batang
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-green-800/50 rounded-lg group-hover:bg-amber-400/20 transition-colors">
                      <Phone className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">Telepon</p>
                      <p className="text-sm text-green-100/80 font-medium">+6285225061238</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-green-800/50 rounded-lg group-hover:bg-amber-400/20 transition-colors">
                      <Mail className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">Email</p>
                      <p className="text-sm text-green-100/80 font-medium">pripnuippnusijonowarungasem@gmail.com</p>
                    </div>
                  </div>
                </address>
              </div>

              {/* Kolom 4: Media Sosial */}
              <div>
                <h3 className="font-bold text-lg mb-6 text-white border-b-2 border-amber-400 pb-2 inline-block">Ikuti Kami</h3>
                <p className="text-sm text-green-100/80 font-medium mb-6 leading-relaxed">
                  Dapatkan informasi terbaru mengenai kegiatan dan program kami melalui media sosial.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://www.tiktok.com/@media.nu.sijono?_r=1&_t=ZS-97sjpUSJuR2" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-green-800/80 flex items-center justify-center text-white hover:bg-amber-400 hover:text-[#0b3f27] hover:scale-110 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all duration-300">
                    <TiktokIcon className="h-4 w-4" />
                  </a>
                  <a href="https://www.instagram.com/pelajarnusijono?igsh=MXJmYTJuMTh3ZnMzbQ==" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-green-800/80 flex items-center justify-center text-white hover:bg-amber-400 hover:text-[#0b3f27] hover:scale-110 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all duration-300">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="https://youtube.com/@pripnu-ippnusijonowarungasem?si=4OD-KmNNkJGaJOYs" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-green-800/80 flex items-center justify-center text-white hover:bg-amber-400 hover:text-[#0b3f27] hover:scale-110 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all duration-300">
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Footer */}
          <div className="relative z-10 border-t border-green-700/50 bg-[#08301d]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-green-200/80 font-medium text-center md:text-left">
                &copy; {new Date().getFullYear()} <span className="text-amber-400 font-bold">IPNU IPPNU Desa Sijono</span>. All rights reserved.
              </p>
              <p className="text-xs text-green-300/60 font-medium text-center md:text-right flex items-center gap-1">
                Developed by Bidang Teknologi Informasi
              </p>
            </div>
          </div>
        </footer>

        {/* Back to Top Button */}
        <button 
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-3 rounded-full bg-amber-400 text-[#0b3f27] shadow-lg hover:bg-amber-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(251,191,36,0.6)] transition-all duration-500 z-50 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}
          aria-label="Kembali ke atas"
        >
          <ArrowUp className="h-6 w-6 font-bold" />
        </button>
      </div>
    </div>
  );
}
