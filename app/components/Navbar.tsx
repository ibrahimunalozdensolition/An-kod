"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/nasil-calisir", label: "Nasıl Çalışır?" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" },
  ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#d2d2d7]/30 bg-[#fbfbfd]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[48px] max-w-[980px] items-center justify-between px-6">
        
        <Link 
          href="/" 
          className="text-[21px] font-semibold tracking-[-0.01em] text-[#1d1d1f] transition-opacity hover:opacity-70"
        >
          ANIKOD
        </Link>

        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[14px] font-normal leading-[1.43] transition-colors ${
                pathname === item.href
                  ? "text-[#1d1d1f]"
                  : "text-[#6e6e73] hover:text-[#1d1d1f]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="#"
          className="inline-flex h-[32px] items-center justify-center rounded-full bg-[#0071e3] px-4 text-[12px] font-normal text-white transition-all duration-200 hover:bg-[#0077ed]"
        >
          Giriş Yap
        </Link>

      </div>
    </nav>
  );
}
