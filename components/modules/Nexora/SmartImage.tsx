"use client";

import { useState } from "react";
import Image from "next/image";

const FALLBACK_IMG = "/imges/nexora-img-2.jpg";

interface Props {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  fallback?: string;
}

export default function SmartImage({
  src,
  alt,
  fill,
  priority,
  sizes,
  className,
  fallback = FALLBACK_IMG,
}: Props) {
  const [current, setCurrent] = useState(src || fallback);
  return (
    <Image
      src={current}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
