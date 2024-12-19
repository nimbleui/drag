import { isFunction } from './types';

let uid = 1;
export function useId(prefix = 'y') {
  return `${prefix}-${Date.now()}-${uid++}`;
}

export function isFunctionOrValue<T>(
  val: T
): T extends (...args: any) => any ? ReturnType<T> : T {
  return isFunction(val) ? val() : val;
}

export function getParentTarget(
  element: Element,
  polyfill: (el: HTMLElement) => boolean
) {
  let parent = element as HTMLElement | null;
  while (parent) {
    if (polyfill(parent)) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

export function createId() {
  return Math.random().toString(36).substring(2);
}
