"use client";

import Image from "next/image";
import { useState } from "react";

const supportedImageHosts = new Set([
  "drive.google.com",
  "res.cloudinary.com",
  "lh3.googleusercontent.com",
]);

function isSupportedImageSource(src: string) {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && (
      supportedImageHosts.has(url.hostname)
      || url.hostname === "googleusercontent.com"
      || url.hostname.endsWith(".googleusercontent.com")
    );
  } catch {
    return false;
  }
}

type ProductImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export function ProductImage({ src, alt, sizes, className = "", priority = false }: ProductImageProps) {
  const [failed, setFailed] = useState(!src);
  const [prevSrc, setPrevSrc] = useState(src);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setFailed(!src);
  }

  if (failed || !isSupportedImageSource(src)) {
    return <div role="img" aria-label={`${alt} — image unavailable`} className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#29251d_0%,#151619_50%,#0d0e11_100%)] text-center">
      <span className="font-display text-xl font-bold tracking-[.28em] text-[#d0b273]">COYILO</span>
      <span className="mt-2 max-w-[80%] truncate text-[10px] uppercase tracking-[.16em] text-white/45">{alt.replace(/ perfume bottle$/i, "")}</span>
    </div>;
  }

  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} onError={() => setFailed(true)} className={className} />;
}
