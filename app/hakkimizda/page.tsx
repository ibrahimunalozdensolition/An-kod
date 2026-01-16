import Navbar from "../components/Navbar";

export default function Hakkimizda() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-20 pt-[88px]">
        <div className="mx-auto max-w-[980px]">
          
          <div className="mb-16 text-center">
            <h1 className="animate-fade-in-up mb-4 text-5xl font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f] sm:text-6xl lg:text-[72px]">
              Hakkımızda
            </h1>
            <p className="animate-fade-in-up animate-delay-100 mx-auto max-w-[640px] text-xl leading-[1.47] tracking-[-0.01em] text-[#6e6e73] sm:text-2xl">
              Anılar kaybolmaz, bizimle sonsuza dek yaşar.
            </p>
          </div>

          <div className="space-y-12">
            
            <div className="animate-fade-in-up animate-delay-200">
              <h2 className="mb-4 text-3xl font-semibold leading-[1.12] tracking-[-0.015em] text-[#1d1d1f] sm:text-4xl">
                Misyonumuz
              </h2>
              <p className="text-lg leading-[1.6] tracking-[-0.01em] text-[#6e6e73] sm:text-xl">
                Sevdiklerinizin anılarını dijital dünyada sonsuza dek yaşatmak için yola çıktık. 
                Kaybettiğimiz dostlarımızın hatıralarını, onları seven herkesin kolayca ulaşabileceği 
                bir platformda topluyoruz. Her QR kod, bir hayatın hikayesini anlatıyor.
              </p>
            </div>

            <div className="animate-fade-in-up animate-delay-300">
              <h2 className="mb-4 text-3xl font-semibold leading-[1.12] tracking-[-0.015em] text-[#1d1d1f] sm:text-4xl">
                Neden ANIKOD?
              </h2>
              <p className="mb-4 text-lg leading-[1.6] tracking-[-0.01em] text-[#6e6e73] sm:text-xl">
                Geleneksel anma yöntemleri zamanla solabilir, kaybolabilir. Bizim sistemimiz 
                dijitalin gücünü fiziksel dünya ile birleştirerek kalıcı bir çözüm sunar.
              </p>
              <ul className="space-y-3 text-lg leading-[1.6] tracking-[-0.01em] text-[#6e6e73] sm:text-xl">
                <li className="flex items-start">
                  <span className="mr-3 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#0071e3]"></span>
                  <span>Fotoğraflar, videolar ve anılarla zengin içerik</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#0071e3]"></span>
                  <span>Mezarda QR kod ile kolay erişim</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#0071e3]"></span>
                  <span>İstediğiniz zaman güncelleyebileceğiniz içerik</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#0071e3]"></span>
                  <span>Sevdiklerinizin anma mesajlarını kabul edebilme</span>
                </li>
              </ul>
            </div>

            <div className="animate-fade-in-up animate-delay-300 rounded-2xl bg-[#f5f5f7] p-8 sm:p-12">
              <h2 className="mb-4 text-3xl font-semibold leading-[1.12] tracking-[-0.015em] text-[#1d1d1f] sm:text-4xl">
                Vizyonumuz
              </h2>
              <p className="text-lg leading-[1.6] tracking-[-0.01em] text-[#6e6e73] sm:text-xl">
                Türkiye'nin ve dünyanın her köşesinde, her mezarda bir ANIKOD görmek istiyoruz. 
                Anıların kaybolmadığı, sevginin dijital dünyada da yaşamaya devam ettiği bir 
                gelecek hayal ediyoruz. Her QR kod, bir yaşamın iz bıraktığının kanıtıdır.
              </p>
            </div>

          </div>

          <div className="mt-16 text-center">
            <a
              href="/iletisim"
              className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#0071e3] px-8 text-[17px] font-normal leading-[1.23] text-white transition-all duration-200 hover:bg-[#0077ed]"
            >
              Bizimle iletişime geçin
            </a>
          </div>

        </div>
      </main>
    </>
  );
}
