"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
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
  const [imgSrc, setImgSrc] = useState<string>(LOCAL_PRODUCT_PLACEHOLDER);

  useEffect(() => {
    try {
      const resolved = resolveProductImageSrc(src, productId);
      if (resolved && (resolved.startsWith("http") || resolved.startsWith("/"))) {
        setImgSrc(resolved);
      } else {
        setImgSrc(LOCAL_PRODUCT_PLACEHOLDER);
      }
    } catch {
      setImgSrc(LOCAL_PRODUCT_PLACEHOLDER);
    }
  }, [src, productId]);

  const isRemote = imgSrc.startsWith("http");
  const imageClass = cn(className);

  const handleError = () => {
    setImgSrc(LOCAL_PRODUCT_PLACEHOLDER);
  };

  if (fill) {
    return (
      <Image
        src={imgSrc}
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
      src={imgSrc}
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