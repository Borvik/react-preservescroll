export function getCurrentScrollState<State>(instanceId: string) {
  const curPublicState = typeof window !== 'undefined' ? window.history?.state ?? null : null;
  return (
    curPublicState &&
    typeof curPublicState === 'object' &&
    !Array.isArray(curPublicState)
  ) ? curPublicState.scrollState?.[instanceId] as (State | undefined) : null;
}