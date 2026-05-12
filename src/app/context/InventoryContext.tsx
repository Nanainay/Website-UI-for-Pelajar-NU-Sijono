import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  location: string;
  condition: "Baik" | "Rusak Ringan" | "Rusak Berat";
  qty: number;
  lastCheck: string;
  notes?: string;
}

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, "id">) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const INITIAL_ITEMS: InventoryItem[] = [
  { id: "1", name: "Speaker Aktif Polytron", category: "Elektronik", location: "Gudang Masjid", condition: "Baik", qty: 2, lastCheck: "2024-03-01", notes: "Lengkap dengan kabel" },
  { id: "2", name: "Bendera IPNU IPPNU", category: "Atribut", location: "Lemari Sekretariat", condition: "Baik", qty: 10, lastCheck: "2024-02-15" },
  { id: "3", name: "Meja Lipat", category: "Mebel", location: "Gudang Masjid", condition: "Rusak Ringan", qty: 5, lastCheck: "2024-03-05", notes: "3 kaki meja longgar" },
  { id: "4", name: "Proyektor Epson", category: "Elektronik", location: "Kantor Sekretariat", condition: "Baik", qty: 1, lastCheck: "2024-04-10" },
  { id: "5", name: "Kursi Lipat", category: "Mebel", location: "Gudang Masjid", condition: "Baik", qty: 30, lastCheck: "2024-04-01" },
  { id: "6", name: "Tenda 4x6m", category: "Perlengkapan", location: "Gudang Masjid", condition: "Rusak Ringan", qty: 2, lastCheck: "2024-03-20", notes: "Terpal ada robekan kecil" },
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("nu_inventory");
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem("nu_inventory", JSON.stringify(items));
  }, [items]);

  const addItem = (data: Omit<InventoryItem, "id">) => {
    const newItem: InventoryItem = { ...data, id: Date.now().toString() };
    setItems(prev => [newItem, ...prev]);
  };

  const updateItem = (id: string, data: Partial<InventoryItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <InventoryContext.Provider value={{ items, addItem, updateItem, deleteItem }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}
