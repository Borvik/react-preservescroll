export function getCurrentScrollState<State>(instanceId: string) {
  const curPublicState = window?.history?.state ?? null;
  return (
    curPublicState &&
    typeof curPublicState === 'object' &&
    !Array.isArray(curPublicState)
  ) ? curPublicState.scrollState?.[instanceId] as (State | undefined) : null;
}