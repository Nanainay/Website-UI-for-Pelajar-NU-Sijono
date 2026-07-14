import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { api, setToken, getToken } from "../../services/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (...roles: string[]) => boolean;
  selectedOrg: 'IPNU' | 'IPPNU' | null;
  setSelectedOrg: (org: 'IPNU' | 'IPPNU' | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrg, setSelectedOrgState] = useState<'IPNU' | 'IPPNU' | null>(() => {
    const saved = localStorage.getItem("nu_selected_org");
    return (saved === 'IPNU' || saved === 'IPPNU') ? saved : null;
  });

  const setSelectedOrg = useCallback((org: 'IPNU' | 'IPPNU' | null) => {
    setSelectedOrgState(org);
    if (org) {
      localStorage.setItem("nu_selected_org", org);
    } else {
      localStorage.removeItem("nu_selected_org");
    }
  }, []);

  useEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      api.me()
        .then(data => setUser(data.user))
        .catch(() => setToken(null))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.login(email, password);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSelectedOrg(null);
    api.logout();
  }, [setSelectedOrg]);

  const hasRole = useCallback((...roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user, login, logout,
      isAuthenticated: !!user,
      isLoading,
      hasRole,
      selectedOrg,
      setSelectedOrg,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
