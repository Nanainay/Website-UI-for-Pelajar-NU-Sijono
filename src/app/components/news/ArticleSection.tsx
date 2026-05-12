import { ReactNode } from "react";

interface ArticleSectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function ArticleSection({ title, children, icon }: ArticleSectionProps) {
  return (
    <section className="bg-white p-8 rounded-3xl border-l-8 border-[#0f5132] shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center gap-4 mb-6">
        {icon && (
          <div className="p-3 bg-green-50 rounded-2xl text-[#0f5132] group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
        <h3 className="text-2xl font-black font-poppins text-[#0f5132] uppercase tracking-tight">
          {title}
        </h3>
      </div>
      <div className="text-gray-700 leading-relaxed font-poppins text-lg space-y-4">
        {children}
      </div>
    </section>
  );
}
