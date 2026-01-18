"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeDisplayProps {
  url: string;
  size?: number;
  className?: string;
}

export default function QRCodeDisplay({ url, size = 200, className = "" }: QRCodeDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const generateQR = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(url, {
          width: size,
          margin: 2,
          color: {
            dark: '#1d1d1f',
            light: '#ffffff',
          },
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error("QR oluşturma hatası:", err);
      }
    };

    generateQR();
  }, [url, size]);

  if (!qrDataUrl) {
    return (
      <div 
        className={`flex items-center justify-center bg-[#f5f5f7] ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#d2d2d7] border-t-[#0071e3]"></div>
      </div>
    );
  }

  return (
    <img 
      src={qrDataUrl} 
      alt="QR Kod" 
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
