import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-amber-50 px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-green-600 mb-4">404</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-amber-500 mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">Halaman Tidak Ditemukan</h2>
          <p className="text-lg text-green-600 leading-relaxed">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman mungkin telah dipindahkan atau tidak tersedia.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Kembali ke Beranda
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
            <Link to="/berita">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Lihat Berita
            </Link>
          </Button>
        </div>

        <div className="mt-12 p-6 bg-green-50 rounded-xl border-2 border-green-200">
          <p className="text-sm text-green-700">
            Butuh bantuan? Hubungi kami di{" "}
            <a href="mailto:ipnu.ippnu.sijono@gmail.com" className="font-semibold text-green-800 hover:underline">
              ipnu.ippnu.sijono@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
