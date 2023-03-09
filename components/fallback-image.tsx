import { includes, isUndefined, startsWith } from 'lodash';
import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';

interface FallBackImageProps {
  alt?: string;
  className?: string;
  src?: string;
  onClick?: () => void;
  resolution?: number;
  quality?: number;
  customFallback?: string;
  disableFallbackBW?: boolean;
}

const FallBackImage: FC<FallBackImageProps> = ({
  src,
  className,
  alt,
  quality,
  onClick,
  resolution,
  customFallback,
  disableFallbackBW,
}) => {
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    setFallback(false);
  }, [src]);

  return (
    <>
      {isUndefined(src) || includes(src, `www.no.com`) || fallback ? (
        <Image
          width={resolution || 1024}
          height={0}
          src={customFallback || '/images/fallback.gif'}
          alt={alt || `gugugaga`}
          className={`${className} ${disableFallbackBW ? `` : `grayscale`}`}
          quality={quality || 50}
        />
      ) : (
        <Image
          onClick={onClick}
          src={
            startsWith(src, `http://`) || startsWith(src, `https://`)
              ? `${process.env.BACKEND_DOMAIN}/internal/imagetunnel?url=${src}`
              : src
          }
          className={className}
          onError={() => {
            setFallback(true);
          }}
          alt={alt || `gugugaga`}
          width={resolution || 1024}
          height={0}
          quality={quality || 50}
        />
      )}
    </>
  );
};

export default FallBackImage;
