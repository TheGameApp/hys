"use client";

import Image from "next/image";

interface QrCodeProps {
  dataUrl: string;
  alt?: string;
  size?: number;
}

export function QrCode({ dataUrl, alt = "QR code", size = 224 }: QrCodeProps) {
  return (
    <div
      className="inline-flex items-center justify-center rounded-xl border border-border bg-white p-3"
      style={{ width: size + 24, height: size + 24 }}
    >
      <Image
        src={dataUrl}
        alt={alt}
        width={size}
        height={size}
        unoptimized
        className="block"
      />
    </div>
  );
}
