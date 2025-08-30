import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = '/images/placeholder.webp',
  className = '',
  width,
  height,
  loading = 'lazy',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded && !hasError) {
            setCurrentSrc(src);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, isLoaded, hasError]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setCurrentSrc(placeholder);
    onError?.();
  };

  return (
    <div className={`lazy-image-container ${className}`} style={{ width, height }}>
      <motion.img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`lazy-image ${isLoaded ? 'loaded' : ''} ${hasError ? 'error' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: currentSrc === src && isLoaded ? 1 : 0.7 }}
        transition={{ duration: 0.3 }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: currentSrc === placeholder ? 'blur(5px)' : 'none'
        }}
      />
      
      {!isLoaded && currentSrc === src && (
        <div className="lazy-image-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {hasError && (
        <div className="lazy-image-error">
          <span>Failed to load image</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;