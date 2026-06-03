"use client";

import Image from "next/image";
import { useState } from "react";
import {
  LOCAL_PRODUCT_PLACEHOLDER,
  resolveProductImageSrc,
} from "@/lib/product-images";
import { cn } from "@/lib/utils";

type ProductImageProps = {
  src?: string | null;
  alt: string;
  productId?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function ProductImage({
  src,
  alt,
  productId,
  fill = true,
  width,
  height,
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority,
  className = "object-cover rounded-none",
}: ProductImageProps) {
  const [useLocalFallback, setUseLocalFallback] = useState(false);

  const resolved = useLocalFallback
    ? LOCAL_PRODUCT_PLACEHOLDER
    : resolveProductImageSrc(src, productId);

  const isRemote = resolved.startsWith("http");
  const imageClass = cn(className);

  const handleError = () => {
    if (!useLocalFallback) setUseLocalFallback(true);
  };

  if (fill) {
    return (
      <Image
        src={resolved}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={imageClass}
        unoptimized={isRemote}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      width={width ?? 80}
      height={height ?? 80}
      sizes={sizes}
      priority={priority}
      className={imageClass}
      unoptimized={isRemote}
      onError={handleError}
    />
  );
}
