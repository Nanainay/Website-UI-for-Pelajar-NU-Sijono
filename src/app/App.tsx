import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { NewsProvider } from "./context/NewsContext";
import { LettersProvider } from "./context/LettersContext";
import { OrganizationProvider } from "./context/OrganizationContext";
import { InventoryProvider } from "./context/InventoryContext";

export default function App() {
  return (
    <AuthProvider>
      <NewsProvider>
        <LettersProvider>
          <OrganizationProvider>
            <InventoryProvider>
              <RouterProvider router={router} />
              <Toaster position="top-right" />
            </InventoryProvider>
          </OrganizationProvider>
        </LettersProvider>
      </NewsProvider>
    </AuthProvider>
  );
}