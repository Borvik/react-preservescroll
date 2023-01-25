import { useCallback } from 'react';
import { update } from './immutable';

// DOES NOT CAUSE RERENDERS

function getCurrentStateObject(tableId: string) {
  const curPublicState = window?.history?.state ?? null;
  return (
    typeof curPublicState === 'object' && !Array.isArray(curPublicState)
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

const setHistoryState = debounce(function setHistoryState(tableId: string, data: any) {
  let actualState = window?.history?.state ?? {};
  if (typeof actualState !== 'object' || Array.isArray(actualState)) {
    actualState = {};
  }

  actualState = update(actualState, {
    [tableId]: { $set: data }
  });

  // there might be a limit 100 times per 30 seconds
  window?.history?.replaceState(actualState, '');
}, 300)


export function useHistoryState<State>(tableId: string): [State | null | undefined, (newState: (Partial<State> | ((state: State) => Partial<State>))) => void] {
  const curPublicState = getCurrentStateObject(tableId);

  const updater = useCallback(
    (newState: (Partial<State> | ((state: State) => Partial<State>))) => {
      const currentState = getCurrentStateObject(tableId);
      const publicState = typeof newState === 'function'
        ? (newState as any)(currentState)
        : newState;

      const fullNewState = {
        ...(currentState ?? {}),
        ...publicState
      };
      setHistoryState(tableId, fullNewState);
    }
  , [tableId]);

  return [ curPublicState, updater ];
}