export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6">
      <div className="mx-auto max-w-[980px] text-center">
        
        <h1 className="animate-fade-in-up mb-4 text-6xl font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f] sm:text-7xl lg:text-[80px]">
          Anıları sonsuza dek yaşat
        </h1>

        <p className="animate-fade-in-up animate-delay-100 mx-auto mb-8 max-w-[640px] text-xl leading-[1.47] tracking-[-0.01em] text-[#6e6e73] sm:text-2xl sm:leading-[1.42]">
          Sevdiğin dostun için özel bir anı sayfası oluştur. Mezarında QR kod ile sonsuza kadar ulaşılabilir olsun.
        </p>

        <div className="animate-fade-in-up animate-delay-200 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#"
            className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#0071e3] px-8 text-[17px] font-normal leading-[1.23] text-white transition-all duration-200 hover:bg-[#0077ed]"
          >
            Anı sayfası oluştur
          </a>

          <a
            href="/nasil-calisir"
            className="text-[17px] font-normal leading-[1.23] text-[#06c] transition-colors duration-200 hover:underline"
          >
            Nasıl çalışır?
          </a>
        </div>

      </div>
    </main>
  );
}
