import type React from 'react';
import { useState, useEffect } from 'react';

export default (ref: React.MutableRefObject<HTMLElement | null>) => {
  const [contentRect, setContentRect] = useState<IntersectionObserverEntry>();

  const intersectionObserver = new IntersectionObserver((entries) => {
    console.log('entries', entries);
    setContentRect(entries?.[0]);
  });

  useEffect(() => {
    intersectionObserver.observe(ref?.current as HTMLElement);
    return () => {
      intersectionObserver.disconnect();
    };
  }, [ref]);

  return contentRect;
};
