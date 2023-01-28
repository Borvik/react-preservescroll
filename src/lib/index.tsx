import React, { ForwardedRef, useCallback, useEffect, useRef } from 'react';
import { ScrollPos } from './types';
import { getCurrentScrollState } from './getCurrentScrollState';
import { useHistoryUnload } from './useHistoryUnload';

interface PreserveScrollProps extends React.HTMLProps<HTMLDivElement> {
  id: string
  children?: React.ReactNode
}

export const PreserveScroll = React.forwardRef(({ children, id, ...props }: PreserveScrollProps, ref: ForwardedRef<HTMLDivElement>) => {
  const divRef = useRef<HTMLDivElement | null>(null);

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

  return <div ref={(e) => {
    divRef.current = e;
    if (typeof ref === 'function') {
      ref(e);
    } else if (ref) {
      ref.current = e;
    }
  }} id={id} {...props}>{children}</div>
});
PreserveScroll.displayName = 'PreserveScroll';