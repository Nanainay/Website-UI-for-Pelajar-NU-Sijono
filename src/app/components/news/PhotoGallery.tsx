import { ImageIcon } from "lucide-react";

interface PhotoGalleryProps {
  images: string[];
}

export function PhotoGallery({ images }: PhotoGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 border-b-2 border-green-100 pb-4">
        <ImageIcon className="w-8 h-8 text-[#0f5132]" />
        <h2 className="text-3xl font-black font-poppins text-gray-900">Galeri Foto Kegiatan</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, index) => (
          <div 
            key={index} 
            className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 bg-gray-100"
          >
            <img 
              src={img} 
              alt={`Gallery image ${index + 1}`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f5132]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                    Foto {index + 1}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
