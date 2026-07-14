import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { api } from "../../services/api";

export interface LetterRequest {
  id: number;
  user_id: number;
  user_name: string;
  type: string;
  purpose: string;
  phone: string;
  status: 'menunggu' | 'dicek_sekretaris' | 'menunggu_ttd_ketua' | 'selesai' | 'ditolak';
  status_label: string;
  status_color: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  letter_number?: string;
  content?: string;
  issue_date?: string;
  sekretaris_signature?: string;
  sekretaris_stamp?: string;
  ketua_signature?: string;
  processed_by_name?: string;
  approved_by_name?: string;
}

interface LettersContextType {
  requests: LetterRequest[];
  addRequest: (type: string, purpose: string, phone: string, requestedName?: string) => Promise<void>;
  prosesLetter: (id: number, data: {
    letterNumber: string; content: string; issueDate: string;
    sekretarisSignature: string; sekretarisStamp: string;
  }) => Promise<void>;
  ttdKetuaLetter: (id: number, ketuaSignature: string) => Promise<void>;
  tolakLetter: (id: number, reason: string) => Promise<void>;
  selesaiLetter: (id: number, letterNumber: string) => Promise<void>;
  getMyLetters: () => Promise<LetterRequest[]>;
  getLetterById: (id: number) => Promise<LetterRequest>;
  refreshLetters: (status?: string) => Promise<void>;
}

const LettersContext = createContext<LettersContextType | undefined>(undefined);

export function LettersProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<LetterRequest[]>([]);

  const refreshLetters = useCallback(async (status?: string) => {
    try {
      const data = await api.getLetters(status);
      setRequests(data as LetterRequest[]);
    } catch (e) {
      console.error('Failed to load letters', e);
    }
  }, []);

  const addRequest = useCallback(async (type: string, purpose: string, phone: string, requestedName?: string) => {
    await api.submitLetter({ type, purpose, phone, requestedName });
    await refreshLetters();
  }, [refreshLetters]);

  const prosesLetter = useCallback(async (id: number, data: {
    letterNumber: string; content: string; issueDate: string;
    sekretarisSignature: string; sekretarisStamp: string;
  }) => {
    await api.prosesLetter(id, data);
    await refreshLetters();
  }, [refreshLetters]);

  const ttdKetuaLetter = useCallback(async (id: number, ketuaSignature: string) => {
    await api.ttdKetuaLetter(id, { ketuaSignature });
    await refreshLetters();
  }, [refreshLetters]);

  const tolakLetter = useCallback(async (id: number, reason: string) => {
    await api.tolakLetter(id, reason);
    await refreshLetters();
  }, [refreshLetters]);

  const selesaiLetter = useCallback(async (id: number, letterNumber: string) => {
    await api.selesaiLetter(id, { letterNumber });
    await refreshLetters();
  }, [refreshLetters]);

  const getMyLetters = useCallback(async () => {
    return api.getMyLetters() as Promise<LetterRequest[]>;
  }, []);

  const getLetterById = useCallback(async (id: number) => {
    return api.getLetterById(id) as Promise<LetterRequest>;
  }, []);

  return (
    <LettersContext.Provider value={{
      requests, addRequest,
      prosesLetter, ttdKetuaLetter, tolakLetter, selesaiLetter,
      getMyLetters, getLetterById, refreshLetters,
    }}>
      {children}
    </LettersContext.Provider>
  );
}

export function useLetters() {
  const context = useContext(LettersContext);
  if (!context) throw new Error("useLetters must be used within a LettersProvider");
  return context;
}
