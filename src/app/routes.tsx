import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { LetterServices } from "./pages/LetterServices";
import { News } from "./pages/News";
import { NewsDetail } from "./pages/NewsDetail";
import { MemberRegistration } from "./pages/MemberRegistration";
import { Inventory } from "./pages/Inventory";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { StrukturPengurus } from "./pages/StrukturPengurus";
import { AdminNews } from "./pages/AdminNews";
import { AdminNewsDetail } from "./pages/AdminNewsDetail";
import { AdminNewsForm } from "./pages/AdminNewsForm";
import { AdminLetters } from "./pages/AdminLetters";
import { Administration } from "./pages/Administration";
import { AdminInventory } from "./pages/AdminInventory";
import { AdminSettings } from "./pages/AdminSettings";
import { AnggotaDashboard } from "./pages/AnggotaDashboard";
import { SekretarisDashboard } from "./pages/SekretarisDashboard";
import { KetuaDashboard } from "./pages/KetuaDashboard";
import { SuperAdminDashboard } from "./pages/SuperAdminDashboard";
import { AdminLoginLog } from "./pages/AdminLoginLog";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Login />;
  return <>{children}</>;
}

function RoleRoute({ children, roles }: { children: React.ReactNode; roles: string[] }) {
  const { isAuthenticated, hasRole } = useAuth();
  if (!isAuthenticated) return <Login />;
  if (!hasRole(...roles)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Home },
      { path: "tentang-kita", Component: About },
      { path: "struktur-pengurus", Component: StrukturPengurus },
      { path: "layanan-surat", Component: LetterServices },
      { path: "berita", Component: News },
      { path: "berita/:id", Component: NewsDetail },
      { path: "gabung-anggota", Component: MemberRegistration },
      { path: "inventaris", Component: Inventory },

      // Role-based Dashboards
      {
        path: "dashboard/anggota",
        element: <RoleRoute roles={['anggota', 'super_admin']}><AnggotaDashboard /></RoleRoute>,
      },
      {
        path: "dashboard/sekretaris",
        element: <RoleRoute roles={['sekretaris', 'super_admin']}><SekretarisDashboard /></RoleRoute>,
      },
      {
        path: "dashboard/ketua",
        element: <RoleRoute roles={['ketua', 'super_admin']}><KetuaDashboard /></RoleRoute>,
      },

      // Admin routes
      {
        path: "admin",
        element: <RoleRoute roles={['super_admin']}><SuperAdminDashboard /></RoleRoute>,
      },
      {
        path: "admin/berita",
        element: <RoleRoute roles={['super_admin', 'sekretaris']}><AdminNews /></RoleRoute>,
      },
      {
        path: "admin/berita/tambah",
        element: <RoleRoute roles={['super_admin', 'sekretaris']}><AdminNewsForm /></RoleRoute>,
      },
      {
        path: "admin/berita/edit/:id",
        element: <RoleRoute roles={['super_admin', 'sekretaris']}><AdminNewsForm /></RoleRoute>,
      },
      {
        path: "admin/berita/:id",
        element: <RoleRoute roles={['super_admin', 'sekretaris']}><AdminNewsDetail /></RoleRoute>,
      },
      {
        path: "admin/surat",
        element: <RoleRoute roles={['super_admin', 'sekretaris', 'ketua']}><AdminLetters /></RoleRoute>,
      },
      {
        path: "admin/anggota",
        element: <RoleRoute roles={['super_admin']}><Administration /></RoleRoute>,
      },
      {
        path: "admin/inventaris",
        element: <RoleRoute roles={['super_admin', 'sekretaris']}><AdminInventory /></RoleRoute>,
      },
      {
        path: "admin/log-akses",
        element: <RoleRoute roles={['super_admin']}><AdminLoginLog /></RoleRoute>,
      },
      {
        path: "admin/pengaturan",
        element: <RoleRoute roles={['super_admin']}><AdminSettings /></RoleRoute>,
      },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
]);
