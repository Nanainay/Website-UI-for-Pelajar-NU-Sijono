import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  username: string;
  role: "anggota" | "pengurus";
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: "anggota" | "pengurus") => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Kredensial tetap untuk demo
const CREDENTIALS = {
  anggota: {
    username: "anggota",
    password: "anggota123",
    name: "Anggota",
  },
  pengurus: {
    username: "admin",
    password: "admin123",
    name: "Administrator",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string, role: "anggota" | "pengurus"): boolean => {
    const credential = CREDENTIALS[role];
    
    if (!credential) return false;
    
    if (username === credential.username && password === credential.password) {
      setUser({
        username: credential.username,
        role,
        name: credential.name,
      });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
