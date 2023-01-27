import { useCallback } from 'react';
import { update } from './immutable';

// SHOULD NOT CAUSE RERENDERS

function getCurrentStateObject(tableId: string) {
  const curPublicState = window?.history?.state ?? null;
  return (
    curPublicState && typeof curPublicState === 'object' && !Array.isArray(curPublicState)
  ) ? curPublicState[tableId] : null;
}

function debounce<Params extends any[]>(func: (...args: Params) => void, timeout: number): (...args: Params) => void {
  let timer: string | number | NodeJS.Timeout | undefined;
  return (...args: Params) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  }
}
function finalReplaceState<T extends object>(data: T) {
  console.log(`replacing history state:`, data);
  // there might be a limit 100 times per 30 seconds
  window?.history?.replaceState(data, '');
  console.log(`  state replaced`);
}

type MergePromiseResolver = (value: void | PromiseLike<void>) => void
function mergedDebounce(callback: <T extends object>(data: T) => void, timeout: number): <T extends object>(data: T) => Promise<void> {
  let mergedData: any = null;
  let promiseResolvers: MergePromiseResolver[] = [];

  const debounced = debounce(() => {
    console.log('debounce timeout complete');
    callback(mergedData);
    console.log('resolve promises');
    for (let r of promiseResolvers) {
      r();
    }
    console.log('reset merges');
    mergedData = null;
    promiseResolvers = [];
  }, timeout);

  return async <T extends object>(data: T) => {
    let mergePromise = new Promise<void>((resolve) => { promiseResolvers.push(resolve) });
    console.log('merge data');
    if (mergedData === null) {
      mergedData = window?.history?.state ?? {};
      if (typeof mergedData !== 'object' || Array.isArray(mergedData)) {
        mergedData = {};
      }
    }
    mergedData = { ...mergedData, ...data };
    console.log('merged data:', mergedData);
    debounced();
    console.log('waiting...');
    await mergePromise;
    console.log('done');
  };
}

const replaceState = mergedDebounce(finalReplaceState, 300);

async function setHistoryState<T extends object>(instanceId: string, data: T) {
  await replaceState({ [instanceId]: data });
}

export function useHistoryState<State>(tableId: string): [State | null | undefined, (newState: (Partial<State> | ((state: State) => Partial<State>))) => Promise<void>] {
  const curPublicState = getCurrentStateObject(tableId);

  const updater = useCallback(
    async (newState: (Partial<State> | ((state: State) => Partial<State>))) => {
      const currentState = getCurrentStateObject(tableId);
      const publicState = typeof newState === 'function'
        ? (newState as any)(currentState)
        : newState;

      const fullNewState = {
        ...(currentState ?? {}),
        ...publicState
      };
      console.log('calling table set history', { tableId: fullNewState });
      await setHistoryState(tableId, fullNewState);
    }
  , [tableId]);

  return [ curPublicState, updater ];
}