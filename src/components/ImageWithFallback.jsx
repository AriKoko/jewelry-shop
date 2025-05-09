'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageWithFallback({
  src,
  fallbackSrc = '/images/placeholders/product-placeholder.jpg',
  alt,
  ...props
}) {
  // ודא שנתיב התמונה תקין ובדוק אם זה 'no-image.svg' או 'no-image.jpg'
  let normalizedSrc = src && typeof src === 'string' 
    ? (src.startsWith('/') || src.startsWith('http') ? src : `/${src}`) 
    : fallbackSrc;
  
  // טיפול במקרה של no-image
  if (normalizedSrc && (normalizedSrc.includes('no-image.svg') || normalizedSrc.includes('no-image.jpg'))) {
    normalizedSrc = fallbackSrc;
  }
  
  const [imgSrc, setImgSrc] = useState(normalizedSrc);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || 'תמונת מוצר'}
      onError={() => {
        console.log(`שגיאה בטעינת תמונה: ${imgSrc}, מטעין תמונה חלופית`);
        setImgSrc(fallbackSrc);
      }}
    />
  );
} 