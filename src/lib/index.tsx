import React, { useCallback, useEffect, useRef } from 'react';
import { useHistoryState } from './useHistoryState';
import { useHistoryUnload } from './useHistoryUnload';

interface PreserveScrollProps extends React.HTMLProps<HTMLDivElement> {
  id: string
}

interface ScrollPos {
  x: number
  y: number
}

export const PreserveScroll: React.FC<PreserveScrollProps> = function PreserveScroll({ children, id, ...props }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useHistoryState<ScrollPos>(id);

  const unload = useCallback(() => {
    if (!divRef.current) return;
    setScrollState({
      x: divRef.current.scrollLeft,
      y: divRef.current.scrollTop
    });
  }, [setScrollState]);
  useHistoryUnload(unload);

  useEffect(() => {
    if (!divRef.current) return;
    if (scrollState) {
      divRef.current.scrollTo(scrollState.x, scrollState.y);
    }
  }, []);

  return <div ref={divRef} id={id} {...props}>{children}</div>
}