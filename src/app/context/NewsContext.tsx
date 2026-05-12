import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface ArticleSection {
  title: string;
  content: string;
}

export interface Article {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  content: string;
  status: "Published" | "Draft";
  image: string;
  sections: ArticleSection[];
  gallery: string[];
}

interface NewsContextType {
  articles: Article[];
  loading: boolean;
  addArticle: (article: Omit<Article, "id">) => Promise<void>;
  updateArticle: (id: string, article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  getArticle: (id: string) => Article | undefined;
  refreshArticles: () => Promise<void>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

const STORAGE_KEY = "nu_articles";

const DUMMY_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Pelatihan Kepemimpinan Dasar (PKD) IPNU IPPNU Sijono 2024",
    date: "2024-04-24",
    author: "Admin Cabang",
    category: "Kaderisasi",
    status: "Published",
    image: "https://images.unsplash.com/photo-1523240715630-1a1bb4a1eebe?q=80&w=800&auto=format&fit=crop",
    content: "Pelatihan Kepemimpinan Dasar (PKD) merupakan jenjang kaderisasi pertama dalam organisasi IPNU IPPNU. Kegiatan ini bertujuan untuk membentuk kader-kader muda yang militan, berkarakter, dan memiliki jiwa kepemimpinan yang kuat dalam bingkai Ahlussunnah wal Jamaah An-Nahdliyah.",
    sections: [
      { title: "Tujuan Kegiatan", content: "Memberikan pemahaman mendasar tentang keorganisasian, memperkuat ideologi Aswaja." },
      { title: "Materi dan Narasumber", content: "Materi Ke-NU-an, Ke-IPNU IPPNU-an, dan Kepemimpinan." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1523240715630-1a1bb4a1eebe?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524178232363-1fb28f74b0cd?q=80&w=800&auto=format&fit=crop",
    ],
  },
];

export function NewsProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DUMMY_ARTICLES;
    } catch {
      return DUMMY_ARTICLES;
    }
  });

  const [loading, setLoading] = useState(false);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }, [articles]);

  const refreshArticles = async () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setArticles(JSON.parse(saved));
    } catch {}
  };

  const addArticle = async (article: Omit<Article, "id">) => {
    const newArticle: Article = { ...article, id: Date.now().toString() };
    setArticles(prev => [newArticle, ...prev]);
  };

  const updateArticle = async (id: string, updatedFields: Partial<Article>) => {
    setArticles(prev =>
      prev.map(art => (art.id === id ? { ...art, ...updatedFields } : art))
    );
  };

  const deleteArticle = async (id: string) => {
    setArticles(prev => prev.filter(art => art.id !== id));
  };

  const getArticle = (id: string) => articles.find(art => art.id === id);

  return (
    <NewsContext.Provider value={{ articles, loading, addArticle, updateArticle, deleteArticle, getArticle, refreshArticles }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (!context) throw new Error("useNews must be used within a NewsProvider");
  return context;
}
