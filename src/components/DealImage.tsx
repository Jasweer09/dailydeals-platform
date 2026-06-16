"use client";

import { useState } from "react";

/**
 * Product image with a graceful fallback. External deal thumbnails (Slickdeals,
 * Reddit, marketplace CDNs) are inconsistent — some fail to load or return 1x1
 * placeholders. When that happens we show a clean "No image" box instead of a
 * blank space, so cards never look broken.
 */
export function DealImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 text-xs text-gray-400 dark:bg-gray-900 ${className ?? ""}`}
      >
        No image
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
      onLoad={(e) => {
        // Treat 1x1 tracking/placeholder pixels as a failure.
        const img = e.currentTarget;
        if (img.naturalWidth <= 1 && img.naturalHeight <= 1) setFailed(true);
      }}
    />
  );
}
