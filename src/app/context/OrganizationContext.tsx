import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Manager {
  id: string;
  name: string;
  position: string;
  period: string;
  photo?: string;
  type: "IPNU" | "IPPNU";
  nia?: string;
}

export interface Member {
  id: string;
  name: string;
  address: string;
  phone: string;
  joinDate: string;
  status: "Aktif" | "Cuti" | "Keluar" | "Pending" | "Ditolak";
  rejectionReason?: string;
  email?: string;
  age?: string;
  gender?: string;
  education?: string;
  organization?: string;
  nia?: string;
}

interface OrganizationContextType {
  managers: Manager[];
  members: Member[];
  addManager: (manager: Omit<Manager, "id">) => void;
  updateManager: (id: string, manager: Partial<Manager>) => void;
  deleteManager: (id: string) => void;
  addMember: (member: Omit<Member, "id" | "joinDate">) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

const DATA_VERSION = "v4";

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [managers, setManagers] = useState<Manager[]>(() => {
    const version = localStorage.getItem("nu_data_version");
    if (version !== DATA_VERSION) {
      // Clear old data and reset
      localStorage.removeItem("nu_managers");
      localStorage.removeItem("nu_members");
      localStorage.setItem("nu_data_version", DATA_VERSION);
    }
    const saved = localStorage.getItem("nu_managers");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Muhammad Wildan", position: "Ketua", period: "2024-2026", type: "IPNU", photo: "", nia: "11111" },
      { id: "2", name: "Ahmad Fauzi", position: "Sekretaris", period: "2024-2026", type: "IPNU", photo: "", nia: "22222" },
      { id: "3", name: "Siti Aminah", position: "Ketua", period: "2024-2026", type: "IPPNU", photo: "", nia: "33333" },
      { id: "4", name: "Lailatul Fitri", position: "Sekretaris", period: "2024-2026", type: "IPPNU", photo: "", nia: "44444" },
    ];
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem("nu_members");
    return saved ? JSON.parse(saved) : [
      { id: "m1", name: "Budi Santoso", address: "Sijono RT 01/02", phone: "08123456789", joinDate: "2024-01-10", status: "Aktif", nia: "12345" },
      { id: "m2", name: "Rina Wijaya", address: "Sijono RT 03/01", phone: "08987654321", joinDate: "2024-02-15", status: "Aktif", nia: "67890" },
    ];
  });

  useEffect(() => {
    localStorage.setItem("nu_managers", JSON.stringify(managers));
  }, [managers]);

  useEffect(() => {
    localStorage.setItem("nu_members", JSON.stringify(members));
  }, [members]);

  const addManager = (data: Omit<Manager, "id">) => {
    const newManager = { ...data, id: Math.random().toString(36).substr(2, 9) };
    setManagers(prev => [...prev, newManager]);
  };

  const updateManager = (id: string, data: Partial<Manager>) => {
    setManagers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  };

  const deleteManager = (id: string) => {
    setManagers(prev => prev.filter(m => m.id !== id));
  };

  const addMember = (data: Omit<Member, "id" | "joinDate">) => {
    const newMember: Member = { 
        ...data, 
        id: Math.random().toString(36).substr(2, 9),
        joinDate: new Date().toISOString().split('T')[0]
    };
    setMembers(prev => [...prev, newMember]);
  };

  const updateMember = (id: string, data: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <OrganizationContext.Provider value={{ 
      managers, members, 
      addManager, updateManager, deleteManager,
      addMember, updateMember, deleteMember
    }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) throw new Error("useOrganization must be used within an OrganizationProvider");
  return context;
}
