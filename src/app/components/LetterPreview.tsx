import { MessageCircle, Mail } from "lucide-react";

interface LetterPreviewProps {
  letterNumber: string;
  content: string;
  issueDate: string;
  type: string;
  userName: string;
  purpose: string;
  org?: string;
  sekretarisSignature?: string;
  sekretarisStamp?: string;
  ketuaSignature?: string;
  processedByName?: string;
  approvedByName?: string;
  sekretarisName?: string;
  ketuaName?: string;
  hijriDate?: string;
  masehiDate?: string;
  recipientName?: string;
  recipientLocation?: string;
}

export function LetterPreview({
  letterNumber, content, issueDate, type, userName, purpose, org = "IPNU",
  sekretarisSignature, sekretarisStamp, ketuaSignature,
  processedByName, approvedByName,
  sekretarisName, ketuaName,
  hijriDate, masehiDate,
  recipientName, recipientLocation,
}: LetterPreviewProps) {
  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div id="letter-preview-container" className="w-full max-w-[816px] min-h-[1248px] bg-white shadow-2xl p-[15mm] font-serif text-[#1e293b] flex flex-col relative mx-auto">
      {org === 'IPNU' ? (
        <div className="flex justify-between items-center pb-4 mb-6 relative">
          {/* Garis Bawah Ganda Kop Surat */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black"></div>
          <div className="absolute -bottom-[3px] left-0 w-full h-[3px] bg-black"></div>
          
          <div className="w-32 flex-shrink-0">
            <img src="/images/IPNU.png" alt="IPNU Logo" className="w-full h-auto object-contain" />
          </div>
          <div className="text-right flex-1 ml-4 font-sans">
            <h2 className="text-[14px] font-bold text-[#00a651] leading-tight">PIMPINAN RANTING</h2>
            <h1 className="text-[14px] font-bold text-[#00a651] leading-tight mt-0.5">IKATAN PELAJAR NAHDLATUL ULAMA</h1>
            <h2 className="text-[14px] font-bold text-[#00a651] leading-tight">DESA SIJONO</h2>
            <p className="text-[12px] font-bold text-black mt-2">Masjid Jami' Baiturrahman, Jl. Kw. PLPBK, Ds. Sijono, Kec. Warungasem</p>
            <p className="text-[12px] font-bold text-black mt-0.5 flex items-center justify-end gap-1.5">
              081229985524 (Alwi) / 085225899060 (Daffa)
              <MessageCircle className="w-3.5 h-3.5 text-[#00a651]" />
            </p>
            <p className="text-[12px] font-bold text-blue-600 underline mt-0.5 flex items-center justify-end gap-1.5">
              pripnuippnusijonowarungasem@gmail.com
              <Mail className="w-3.5 h-3.5 text-[#00a651]" />
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center pb-4 mb-6 relative">
          {/* Garis Bawah Ganda Kop Surat */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black"></div>
          <div className="absolute -bottom-[3px] left-0 w-full h-[3px] bg-black"></div>
          
          <div className="w-32 flex-shrink-0">
            <img src="/images/IPPNU.png" alt="IPPNU Logo" className="w-full h-auto object-contain" />
          </div>
          <div className="text-right flex-1 ml-4 font-sans">
            <h2 className="text-[14px] font-bold text-[#00a651] leading-tight">PIMPINAN RANTING</h2>
            <h1 className="text-[14px] font-bold text-[#00a651] leading-tight mt-0.5">IKATAN PELAJAR PUTRI NAHDLATUL ULAMA</h1>
            <h2 className="text-[14px] font-bold text-[#00a651] leading-tight">DESA SIJONO</h2>
            <p className="text-[12px] font-bold text-black mt-2">Masjid Jami' Baiturrahman, Jl. Kw. PLPBK, Ds. Sijono, Kec. Warungasem</p>
            <p className="text-[12px] font-bold text-black mt-0.5 flex items-center justify-end gap-1.5">
              085225061238 (Fina) / 082328043380 (Anggi)
              <MessageCircle className="w-3.5 h-3.5 text-[#00a651]" />
            </p>
            <p className="text-[12px] font-bold text-blue-600 underline mt-0.5 flex items-center justify-end gap-1.5">
              pripnuippnusijonowarungasem@gmail.com
              <Mail className="w-3.5 h-3.5 text-[#00a651]" />
            </p>
          </div>
        </div>
      )}

      {type === 'Surat Keterangan Aktif' || type === 'Surat Rekomendasi' || type === 'Surat Tugas dan Mandat' ? (
        <>
          <div className="text-center mb-8">
            <h3 className="font-bold underline uppercase tracking-[0.2em] text-[14px]">
              {type === 'Surat Keterangan Aktif' ? 'SURAT KETERANGAN AKTIF' : type === 'Surat Rekomendasi' ? 'SURAT REKOMENDASI' : 'SURAT MANDAT'}
            </h3>
            <p className="text-[12px]">Nomor: {letterNumber || '...'}</p>
          </div>
          
          <div className="text-[12px] italic font-medium -mb-1">
            <p>Bissmillahirrohmanirrohim</p>
          </div>
          
          <div className="text-[12px] leading-[1.6] text-justify whitespace-pre-wrap">
            {content || 'Isi surat akan muncul di sini saat Anda mengetik...'}
          </div>

          <div className="text-[12px] italic font-medium -mt-1 mb-2">
            <p>Wallahul muwaffiq ilaa aqwamith-thorieq</p>
          </div>
        </>
      ) : type === 'Surat Dispensasi' ? (
        <>
          <div className="flex justify-between items-start mb-8 text-[12px]">
            <div className="space-y-0.5">
              <p>Nomor<span className="inline-block w-4"></span>: <span className="font-bold">{letterNumber || '...'}</span></p>
              <p>Lamp.<span className="inline-block w-4"></span>: -</p>
              <p>Hal<span className="inline-block w-8"></span>: <span className="font-bold uppercase">PERMOHONAN IZIN</span></p>
            </div>
          </div>

          <div className="mb-6 text-[12px] leading-[1.6]">
            <p>Kepada Yth :</p>
            <p className="font-bold">{recipientName || '................'}</p>
            <p>di -</p>
            <p className="pl-6 tracking-widest underline font-bold uppercase">{recipientLocation || 'T E M P A T'}</p>
          </div>

          <div className="text-[12px]">
            <p className="font-bold italic underline">Assalamu'alaikum Warahmatullahi Wabarakatuh</p>
            <p className="italic mb-4">Bissmillahirrahmanirrahim</p>
          </div>

          <div className="text-[12px] leading-[1.6] text-justify whitespace-pre-wrap mb-4">
            {content || 'Isi surat akan muncul di sini saat Anda mengetik...'}
          </div>

          <div className="text-[12px] mb-2">
            <p className="italic underline">Wallahulmuwafiq ila aqwamit thoriq</p>
            <p className="font-bold italic">Wassalamu'alaikum Warohmatullahi Wabarakatuh</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start mb-8 text-[12px]">
            <div className="space-y-0.5">
              <p>Nomor : <span className="font-bold">{letterNumber || '...'}</span></p>
              <p>Lamp : -</p>
              <p>Perihal : <span className="font-bold uppercase underline underline-offset-4">{type}</span></p>
            </div>
          </div>

          <div className="mb-4 text-[12px] italic font-medium">
            <p>Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
          </div>

          <div className="text-[12px] leading-[1.6] text-justify whitespace-pre-line mb-8">
            {content || 'Isi surat akan muncul di sini saat Anda mengetik...'}
          </div>

          <div className="mb-8 text-[12px] italic font-medium">
            <p>Wallahul Muwafiq Ila Aqwamit Thariq,</p>
            <p>Wassalamu'alaikum Warahmatullahi Wabarakatuh.</p>
          </div>
        </>
      )}

      <div className="mt-2 text-[14px]">
        {/* Tanggal */}
        <div className="flex justify-end mb-10">
          <div className="text-left">
            <p>Sijono, <span className={`inline-block text-center ${!hijriDate ? 'w-48 border-b border-black' : 'px-1'}`}>{hijriDate || ''}</span> H</p>
            <p className="pl-[42px]"><span className={`inline-block text-center ${!masehiDate ? 'w-48 border-b border-black' : 'px-1'}`}>{masehiDate || ''}</span> M</p>
          </div>
        </div>

        {/* PIMPINAN RANTING */}
        <div className="text-center font-bold mb-16 leading-tight">
          <p>PIMPINAN RANTING</p>
          <p>{org === 'IPNU' ? 'IKATAN PELAJAR NAHDLATUL ULAMA' : 'IKATAN PELAJAR PUTRI NAHDLATUL ULAMA'}</p>
          <p>DESA SIJONO</p>
        </div>

        {/* Tanda Tangan */}
        <div className="grid grid-cols-2 gap-8 text-center text-[14px]">
          {/* KIRI: KETUA */}
          <div className="relative flex flex-col items-center">
            {ketuaSignature && (
              <img
                src={ketuaSignature}
                alt="TTD Ketua"
                className="absolute left-1/2 bottom-[30px] -translate-x-1/2 h-20 object-contain z-50 pointer-events-none"
              />
            )}
            <p className="font-bold underline mt-12 relative z-10">
              {org === 'IPNU' ? 'MOH. ALWI ANDIANSYAH S.' : 'FINA INAYATUL MAULA'}
            </p>
            <p className="italic relative z-10">Ketua {org}</p>
          </div>

          {/* KANAN: SEKRETARIS */}
          <div className="relative flex flex-col items-center">
            {sekretarisSignature && (
              <img
                src={sekretarisSignature}
                alt="TTD Sekretaris"
                className="absolute left-1/2 bottom-[30px] -translate-x-1/2 h-20 object-contain z-50 pointer-events-none"
              />
            )}
            {sekretarisStamp && (
              <div className="absolute left-[20%] bottom-[10px] opacity-40 pointer-events-none z-0">
                <img src={sekretarisStamp} alt="Stempel" className="w-28 h-28 object-contain" />
              </div>
            )}
            <p className="font-bold underline mt-12 relative z-10">
              {org === 'IPNU' ? 'M. DAFFA DHIYAULHAQ' : 'AYU ANGGITA RISQIANI'}
            </p>
            <p className="italic relative z-10">Sekretaris {org}</p>
          </div>
        </div>
      </div>

      {/* Footer Slogan */}
      <div className="mt-auto text-left text-[14px] font-bold text-[#00a651] tracking-wide">
        BELAJAR, BERJUANG, BERTAQWA
      </div>
    </div>
  );
}
