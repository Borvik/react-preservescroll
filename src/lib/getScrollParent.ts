interface Options {
  includeHidden?: boolean
  overflowProperty?: 'both' | 'overflowY' | 'overflowX'
}

export function getScrollParent(el: HTMLElement, { includeHidden = false, overflowProperty = 'both' }: Options = {}) {
  let style = window.getComputedStyle(el);
  let excludeStaticParent = style.position === "absolute";
  let overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
  let checkOverflowY = (overflowProperty === 'both' || overflowProperty === 'overflowY');
  let checkOverflowX = (overflowProperty === 'both' || overflowProperty === 'overflowX');

  if (style.position === "fixed") return document.scrollingElement as HTMLElement || document.documentElement;
  for (let parent: HTMLElement | null = el; (parent = parent.parentElement);) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === "static") {
      continue;
    }

    let overflowStyle = (
      style.overflow +
      (checkOverflowY ? style.overflowY : '') +
      (checkOverflowX ? style.overflowX : '')
    );
    if (overflowRegex.test(overflowStyle)) {
      return parent;
    }
  }

  return document.scrollingElement as HTMLElement || document.documentElement;
}