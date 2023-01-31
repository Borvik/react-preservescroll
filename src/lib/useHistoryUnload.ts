import { useEffect } from 'react';
import { ScrollPos } from './types';

interface InstanceType {
  [x: string]: ScrollPos
}

const HistoryFunctions = ['back', 'forward', 'go', 'pushState'] as const;
type HistoryKeys = typeof HistoryFunctions[number];
type HistoryCallbackFn = () => InstanceType | void;

type Map = {
  [Property in HistoryKeys]?: typeof window.history[Property]
}

let HistoryCallbacks: HistoryCallbackFn[] = [];

function runHistoryCallbacks() {
  if (HistoryCallbacks.length) {
    let result = HistoryCallbacks.reduce((acc, fn) => {
      let fnResult = fn();
      if (fnResult) {
        acc = { ...acc, ...fnResult };
      }
      return acc;
    }, {});
  
    if (Object.keys(result).length) {
      let initialData = window?.history?.state ?? {};
      if (typeof initialData !== 'object' || Array.isArray(initialData)) {
        initialData = {};
      }
      initialData = {...initialData, scrollState: result };
      window?.history?.replaceState(initialData, '');
    }
  }
}

function wrapFn<Params extends any[], R>(
  func: (...args: Params) => R
): (...args: Params) => Promise<R> {
  return async (...args: Params) => {
    runHistoryCallbacks();
    return func.apply(history, args); // eslint-disable-line no-restricted-globals
  }
}

const OriginalHistoryFunctions: Map = {};
if (typeof window !== 'undefined' && window.history) {
  for (let k of HistoryFunctions) {
    // @ts-ignore
    OriginalHistoryFunctions[k] = window.history[k];
    // @ts-ignore
    window.history[k] = wrapFn(OriginalHistoryFunctions[k])
  }
}

export function useHistoryUnload(cb: HistoryCallbackFn) {
  useEffect(() => {
    function handleBeforeUnload(_evt: BeforeUnloadEvent) {
      runHistoryCallbacks();
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload)
      HistoryCallbacks.push(cb);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        HistoryCallbacks = HistoryCallbacks.filter(c => c !== cb);
      }
    };
  }, [cb]);
  return;
}