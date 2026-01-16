import Navbar from "../components/Navbar";

export default function Iletisim() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-20 pt-[88px]">
        <div className="mx-auto max-w-[980px]">
          
          <div className="mb-16 text-center">
            <h1 className="animate-fade-in-up mb-4 text-5xl font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f] sm:text-6xl lg:text-[72px]">
              İletişim
            </h1>
            <p className="animate-fade-in-up animate-delay-100 mx-auto max-w-[640px] text-xl leading-[1.47] tracking-[-0.01em] text-[#6e6e73] sm:text-2xl">
              Size yardımcı olmak için buradayız.
            </p>
          </div>

          <div className="mx-auto max-w-[640px]">
            
            <form className="space-y-6">
              
              <div className="animate-fade-in-up animate-delay-200">
                <label htmlFor="name" className="mb-2 block text-[17px] font-normal text-[#1d1d1f]">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="h-[48px] w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[17px] text-[#1d1d1f] transition-all duration-200 focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
                  placeholder="Adınız ve soyadınız"
                />
              </div>

              <div className="animate-fade-in-up animate-delay-300">
                <label htmlFor="email" className="mb-2 block text-[17px] font-normal text-[#1d1d1f]">
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="h-[48px] w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[17px] text-[#1d1d1f] transition-all duration-200 focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
                  placeholder="ornek@mail.com"
                />
              </div>

              <div className="animate-fade-in-up animate-delay-300">
                <label htmlFor="phone" className="mb-2 block text-[17px] font-normal text-[#1d1d1f]">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="h-[48px] w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[17px] text-[#1d1d1f] transition-all duration-200 focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
                  placeholder="0555 123 45 67"
                />
              </div>

              <div className="animate-fade-in-up animate-delay-300">
                <label htmlFor="subject" className="mb-2 block text-[17px] font-normal text-[#1d1d1f]">
                  Konu
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="h-[48px] w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[17px] text-[#1d1d1f] transition-all duration-200 focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
                  placeholder="Mesajınızın konusu"
                />
              </div>

              <div className="animate-fade-in-up animate-delay-300">
                <label htmlFor="message" className="mb-2 block text-[17px] font-normal text-[#1d1d1f]">
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full rounded-xl border border-[#d2d2d7] bg-white px-4 py-3 text-[17px] text-[#1d1d1f] transition-all duration-200 focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
                  placeholder="Mesajınızı buraya yazın..."
                ></textarea>
              </div>

              <div className="animate-fade-in-up animate-delay-300">
                <button
                  type="submit"
                  className="h-[48px] w-full rounded-full bg-[#0071e3] text-[17px] font-normal text-white transition-all duration-200 hover:bg-[#0077ed]"
                >
                  Gönder
                </button>
              </div>

            </form>

            <div className="mt-12 space-y-6 border-t border-[#d2d2d7] pt-12">
              
              <div className="text-center">
                <h3 className="mb-2 text-[21px] font-semibold text-[#1d1d1f]">
                  Destek
                </h3>
                <p className="text-[17px] text-[#6e6e73]">
                  destek@anikod.com
                </p>
              </div>

              <div className="text-center">
                <h3 className="mb-2 text-[21px] font-semibold text-[#1d1d1f]">
                  Genel
                </h3>
                <p className="text-[17px] text-[#6e6e73]">
                  info@anikod.com
                </p>
              </div>

            </div>

          </div>

        </div>
      </main>
    </>
  );
}
