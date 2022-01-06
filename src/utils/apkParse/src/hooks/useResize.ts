import React, { useState, useEffect } from 'react';

export default (ref: React.MutableRefObject<HTMLElement | null>) => {
  const [contentRect, setContentRect] =
    useState<ResizeObserverEntry['contentRect']>();

  const resizeObserver = new ResizeObserver((entries) => {
    setContentRect(entries?.[0]?.contentRect);
  });

  useEffect(() => {
    resizeObserver.observe(ref?.current as HTMLElement);
    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return contentRect;
};
