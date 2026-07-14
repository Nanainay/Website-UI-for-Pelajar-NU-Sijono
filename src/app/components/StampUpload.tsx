import { useState, useRef } from "react";
import { Upload, X, Stamp } from "lucide-react";
import { Button } from "./ui/button";
import { api } from "../../services/api";
import { toast } from "sonner";

interface StampUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
}

export function StampUpload({ onUpload, currentUrl }: StampUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      toast.error('Hanya file PNG dan JPG yang diizinkan');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }

    setUploading(true);
    try {
      const result = await api.uploadFile(file, 'stempel');
      setPreview(result.url);
      onUpload(result.url);
      toast.success(`Stempel berhasil diupload (${(result.compressed_size / 1024).toFixed(1)}KB)`);
    } catch (err: any) {
      toast.error(err.message || 'Upload gagal');
    } finally {
      setUploading(false);
    }
  };

  const clearStamp = () => {
    setPreview(null);
    onUpload('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
        Stempel Organisasi
      </label>
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
          {preview ? (
            <img src={preview} alt="Stempel Preview" className="w-full h-full object-contain p-1" />
          ) : (
            <Stamp className="w-8 h-8 text-gray-300" />
          )}
        </div>
        <label className="flex-1 cursor-pointer">
          <div className="h-12 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-green-700">
            {uploading ? (
              <span className="animate-pulse">Mengupload...</span>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                {preview ? 'Ganti Stempel' : 'Upload Gambar Stempel'}
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
        </label>
        {preview && (
          <button type="button" onClick={clearStamp} className="p-2 rounded-xl hover:bg-red-50 text-red-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-[10px] text-gray-400 font-medium">Format: PNG (disarankan dengan transparansi) / JPG. Maks 2MB.</p>
    </div>
  );
}
