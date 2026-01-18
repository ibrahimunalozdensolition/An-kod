import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fbfbfd] px-6">
      <div className="text-center">
        <h1 className="text-[80px] font-semibold leading-[1.05] tracking-[-0.015em] text-[#1d1d1f] sm:text-[96px]">
          404
        </h1>
        <p className="mt-4 text-[28px] font-semibold leading-[1.14] tracking-[-0.015em] text-[#1d1d1f]">
          Sayfa bulunamadı
        </p>
        <p className="mt-2 text-[17px] leading-[1.47] text-[#6e6e73]">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-[56px] items-center justify-center rounded-full bg-[#0071e3] px-8 text-[17px] font-normal text-white transition-all hover:bg-[#0077ed]"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
