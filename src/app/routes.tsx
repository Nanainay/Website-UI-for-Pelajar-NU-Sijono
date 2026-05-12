import React from "react";
import { createBrowserRouter } from "react-router";
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
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminNews } from "./pages/AdminNews";
import { AdminNewsDetail } from "./pages/AdminNewsDetail";
import { AdminNewsForm } from "./pages/AdminNewsForm";
import { AdminLetters } from "./pages/AdminLetters";
import { Administration } from "./pages/Administration";
import { AdminInventory } from "./pages/AdminInventory";
import { AdminSettings } from "./pages/AdminSettings";
import { useAuth } from "./context/AuthContext";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

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
      { path: "layanan-surat", Component: LetterServices },
      { path: "berita", Component: News },
      { path: "berita/:id", Component: NewsDetail },

      { path: "gabung-anggota", Component: MemberRegistration },
      { path: "inventaris", Component: Inventory },
      { path: "admin", Component: AdminDashboard },
      { path: "admin/berita", Component: AdminNews },
      { path: "admin/berita/tambah", Component: AdminNewsForm },
      { path: "admin/berita/edit/:id", Component: AdminNewsForm },
      { path: "admin/berita/:id", Component: AdminNewsDetail },
      { path: "admin/surat", Component: AdminLetters },
      { path: "admin/anggota", Component: Administration },
      { path: "admin/inventaris", Component: AdminInventory },
      { path: "admin/pengaturan", Component: AdminSettings },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
]);

