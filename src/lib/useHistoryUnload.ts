import { useEffect } from 'react';

const HistoryFunctions = ['back', 'forward', 'go', 'pushState'] as const;
type HistoryKeys = typeof HistoryFunctions[number];
type HistoryCallbackFn = () => Promise<void>;

type Map = {
  [Property in HistoryKeys]?: typeof window.history[Property]
}

let HistoryCallbacks: HistoryCallbackFn[] = [];

function wrapFn<Params extends any[], R>(
  historyFuntion: HistoryKeys,
  func: (...args: Params) => R
): (...args: Params) => Promise<R> {
  return async (...args: Params) => {
    console.log(`Running history.${historyFuntion}():`, args);
    let fnPromises = HistoryCallbacks.map(fn => fn());
    await Promise.all(fnPromises);
    console.log('Ran the before functions');
    return func.apply(history, args); // eslint-disable-line no-restricted-globals
  }
}

const OriginalHistoryFunctions: Map = {};
if (window?.history) {
  for (let k of HistoryFunctions) {
    // @ts-ignore
    OriginalHistoryFunctions[k] = window.history[k];
    // @ts-ignore
    window.history[k] = wrapFn(k, OriginalHistoryFunctions[k])
  }
}

export function useHistoryUnload(cb: HistoryCallbackFn) {
  useEffect(() => {
    function handleBeforeUnload(_evt: BeforeUnloadEvent) {
      console.log('Running beforeunload');
      cb();
    }

    if (window) {
      window.addEventListener('beforeunload', handleBeforeUnload)
      HistoryCallbacks.push(cb);
    }

    return () => {
      if (window) {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        HistoryCallbacks = HistoryCallbacks.filter(c => c !== cb);
      }
    };
  }, [cb]);
  return;
}