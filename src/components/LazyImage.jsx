import { useState, useRef, useEffect } from 'react';

export default function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  onLoad = () => {},
  onError = () => {},
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px' // Start loading 50px before the image comes into view
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  const handleError = () => {
    setHasError(true);
    onError();
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} {...props}>
      {!isLoaded && !hasError && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          {placeholder}
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
}

// Loading skeleton component for consistent placeholders
export function ImageSkeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-200 ${className}`}>
      <div className="flex items-center justify-center h-full">
        <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}