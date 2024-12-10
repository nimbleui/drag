const _toString = Object.prototype.toString;

export function isFunction(el: unknown): el is Function {
  return typeof el === 'function';
}

export function isTouchEvent(val: unknown): val is TouchEvent {
  return _toString.call(val) === '[object TouchEvent]';
}
