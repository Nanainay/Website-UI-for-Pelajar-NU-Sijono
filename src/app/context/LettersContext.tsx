import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface LetterRequest {
  id: string;
  userId: string;
  userName: string;
  type: string;
  purpose: string;
  requestDate: string;
  status: "Menunggu" | "Diproses" | "Selesai";
  processedData?: {
    letterNumber: string;
    content: string;
    issueDate: string;
    signer: string;
  };
}

interface LettersContextType {
  requests: LetterRequest[];
  addRequest: (request: Omit<LetterRequest, "id" | "status" | "requestDate">) => void;
  updateStatus: (id: string, status: LetterRequest["status"]) => void;
  processLetter: (id: string, data: LetterRequest["processedData"]) => void;
  getRequestsByUser: (userId: string) => LetterRequest[];
  getRequestById: (id: string) => LetterRequest | undefined;
}

const LettersContext = createContext<LettersContextType | undefined>(undefined);

export function LettersProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<LetterRequest[]>(() => {
    const saved = localStorage.getItem("nu_letter_requests");
    return saved ? JSON.parse(saved) : [
      {
        id: "1",
        userId: "member-1",
        userName: "Ahmad Fauzi",
        type: "Surat Keterangan Aktif",
        purpose: "Beasiswa Pendidikan",
        requestDate: new Date().toISOString(),
        status: "Menunggu"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("nu_letter_requests", JSON.stringify(requests));
  }, [requests]);

  const addRequest = (data: Omit<LetterRequest, "id" | "status" | "requestDate">) => {
    const newRequest: LetterRequest = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: "Menunggu",
      requestDate: new Date().toISOString()
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const updateStatus = (id: string, status: LetterRequest["status"]) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  const processLetter = (id: string, data: LetterRequest["processedData"]) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, processedData: data, status: "Selesai" } : req));
  };

  const getRequestsByUser = (userId: string) => requests.filter(req => req.userId === userId);
  const getRequestById = (id: string) => requests.find(req => req.id === id);

  return (
    <LettersContext.Provider value={{ requests, addRequest, updateStatus, processLetter, getRequestsByUser, getRequestById }}>
      {children}
    </LettersContext.Provider>
  );
}

export function useLetters() {
  const context = useContext(LettersContext);
  if (!context) throw new Error("useLetters must be used within a LettersProvider");
  return context;
}
