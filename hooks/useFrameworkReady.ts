import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    if (typeof window !== 'undefined' && window.frameworkReady) {
      // Ensure we're mounted and window.frameworkReady exists
      const timeoutId = setTimeout(() => {
        if (isMounted.current) {
          window.frameworkReady();
        }
      }, 0);

      return () => {
        isMounted.current = false;
        clearTimeout(timeoutId);
      };
    }
  }, []);
}