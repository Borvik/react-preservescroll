import { useEffect } from 'react';

const HistoryFunctions = ['back', 'forward', 'go', 'pushState'] as const;
type HistoryKeys = typeof HistoryFunctions[number];

type Map = {
  [Property in HistoryKeys]?: typeof window.history[Property]
}

function wrapFn<Params extends any[], R>(
  before: () => void,
  func: (...args: Params) => R
): (...args: Params) => R {
  return (...args: Params) => {
    before();
    return func(...args);
  }
}

export function useHistoryUnload(cb: Function) {
  useEffect(() => {
    let origMap: Map = {};
    function handleBeforeUnload(_evt: BeforeUnloadEvent) {
      cb();
    }

    if (window) {
      window.addEventListener('beforeunload', handleBeforeUnload)
      if (window.history) {
        for (let k of HistoryFunctions) {
          // @ts-ignore
          origMap[k] = window.history[k];
          // @ts-ignore
          window.history[k] = wrapFn(cb, origMap[k])
        }
      }
    }


    return () => {
      if (window) {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        if (window.history) {
          for (let k of HistoryFunctions) {
            // @ts-ignore
            window.history[k] = origMap[k];
          }
        }
      }
    };
  }, [cb]);
  return;
}