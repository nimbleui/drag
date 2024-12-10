export function objectTransform<
  T extends { [key: string]: any },
  K extends keyof T
>(obj: T, keys: Array<K>): { [K in (typeof keys)[number]]: T[K] };
export function objectTransform<
  T extends { [key: string]: any },
  K extends keyof T,
  C extends (val: T[K], key: K) => any
>(obj: T, keys: Array<K>, callback: C): { [R in K]: ReturnType<C> };
/**
 * 取对象部分值，返回新的对象
 * @param obj 目标对象
 * @param keys key数组
 * @param callback 转换值的函数
 * @returns
 */
export function objectTransform<
  T extends { [key: string]: any },
  K extends keyof T,
  C extends (val: T[K], key: K) => any
>(obj: T, keys: Array<K>, callback?: C) {
  const result = {} as { [K in (typeof keys)[number]]: ReturnType<C> | T[K] };
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    result[key] = callback?.(obj[key], key) ?? obj[key];
  }
  return result;
}

export function toInt(val?: string | number) {
  return parseInt(String(val || 0));
}

export function getBoundingClientRectByScale(
  el: Element | HTMLElement,
  scale = 1
) {
  const rect = el.getBoundingClientRect();
  const values = objectTransform(
    rect,
    ['top', 'left', 'right', 'bottom', 'width', 'height'],
    (val) => val / scale
  );

  return values;
}
