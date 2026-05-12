import { Calendar, User, Tag } from "lucide-react";

interface ArticleHeaderProps {
  title: string;
  date: string;
  author: string;
  category: string;
}

export function ArticleHeader({ title, date, author, category }: ArticleHeaderProps) {
  return (
    <header className="bg-[#0f5132] text-white p-8 md:p-16 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-wrap gap-4 items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="px-4 py-1.5 bg-amber-400 text-green-950 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
            {category}
          </span>
          <div className="flex items-center gap-2 text-green-100/80 text-sm font-medium">
            <Calendar className="w-4 h-4 text-amber-400" />
            {new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-2 text-green-100/80 text-sm font-medium">
            <User className="w-4 h-4 text-amber-400" />
            {author}
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black font-poppins leading-[1.1] mb-6 drop-shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {title}
        </h1>
        
        <div className="w-24 h-1.5 bg-amber-400 rounded-full" />
      </div>
    </header>
  );
}
