export default function NasilCalisir() {
  const steps = [
    {
      number: "01",
      title: "Kayıt ol",
      description: "E-posta ve telefon numaranla hesap oluştur. Telefon numaranı SMS ile doğrula."
    },
    {
      number: "02",
      title: "Anı sayfası oluştur",
      description: "Sevdiğin dostun için özel bir sayfa tasarla. Şablon seç, fotoğraflar ve videolar ekle, anılarını paylaş."
    },
    {
      number: "03",
      title: "Önizle ve düzenle",
      description: "Sayfanı istediğin gibi kişiselleştir. Arka plan, yerleşim ve efektler ile benzersiz bir anı sayfası yarat."
    },
    {
      number: "04",
      title: "Yayınla",
      description: "Ödeme yap ve sayfanı yayınla. Benzersiz bir link oluşturulur ve herkes erişebilir hale gelir."
    },
    {
      number: "05",
      title: "QR kod üretimi",
      description: "Sayfana özel QR kod üretilir. Üretim süreci panelinden takip edilir."
    },
    {
      number: "06",
      title: "Teslim",
      description: "QR kodun kargoya verilir ve adresine teslim edilir. Mezara yerleştir, anılar sonsuza dek ulaşılabilir olsun."
    }
  ];

  return (
    <main className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-[980px]">
        
        <div className="mb-20 text-center">
          <h1 className="animate-fade-in-up mb-4 text-5xl font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f] sm:text-6xl lg:text-[72px]">
            Nasıl çalışır?
          </h1>
          <p className="animate-fade-in-up animate-delay-100 mx-auto max-w-[640px] text-xl leading-[1.47] tracking-[-0.01em] text-[#6e6e73] sm:text-2xl">
            Altı basit adımda anı sayfanı oluştur ve sonsuza dek paylaş.
          </p>
        </div>

        <div className="space-y-16 sm:space-y-20">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="animate-fade-in-up flex flex-col gap-6 border-b border-[#d2d2d7] pb-16 last:border-b-0 sm:flex-row sm:gap-12 sm:pb-20"
              style={{ animationDelay: `${(index + 2) * 0.1}s`, opacity: 0 }}
            >
              <div className="flex-shrink-0">
                <span className="text-6xl font-semibold leading-none tracking-[-0.02em] text-[#0071e3] sm:text-7xl">
                  {step.number}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="mb-3 text-3xl font-semibold leading-[1.12] tracking-[-0.015em] text-[#1d1d1f] sm:text-4xl">
                  {step.title}
                </h2>
                <p className="text-lg leading-[1.47] tracking-[-0.01em] text-[#6e6e73] sm:text-xl">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <a
            href="/"
            className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#0071e3] px-8 text-[17px] font-normal leading-[1.23] text-white transition-all duration-200 hover:bg-[#0077ed]"
          >
            Anı sayfası oluştur
          </a>
        </div>

      </div>
    </main>
  );
}
