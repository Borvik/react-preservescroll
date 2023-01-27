import React, { useCallback, useEffect, useRef } from 'react';
import { ScrollPos } from './types';
import { getCurrentScrollState } from './getCurrentScrollState';
import { useHistoryUnload } from './useHistoryUnload';

interface PreserveScrollProps extends React.HTMLProps<HTMLDivElement> {
  id: string
}

export const PreserveScroll: React.FC<PreserveScrollProps> = function PreserveScroll({ children, id, ...props }) {
  const divRef = useRef<HTMLDivElement>(null);

  const unload = useCallback(() => {
    if (!divRef.current) {
      return;
    }
    return {
      [divRef.current.id]: {
        x: divRef.current.scrollLeft,
        y: divRef.current.scrollTop
      }
    }
  }, []);
  useHistoryUnload(unload);

  useEffect(() => {
    if (!divRef.current) return;
    let scrollState = getCurrentScrollState<ScrollPos>(divRef.current.id);
    if (scrollState) {
      divRef.current.scrollTo(scrollState.x, scrollState.y);
    }
  }, []);

  return <div ref={divRef} id={id} {...props}>{children}</div>
}