import { ATTR_KEY } from "@nimble-ui/constant";

/**
 * 获取元素的旋转角度
 * @param element 目标元素
 * @returns
 */
export function getRotationDegrees(element: Element | null) {
  if (!element) return 0;
  const style = window.getComputedStyle(element);
  const matrix = style.transform;
  if (matrix !== 'none') {
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const a = +values[0];
    const b = +values[1];
    const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    return angle < 0 ? angle + 360 : angle; // 将角度转换为正值
  }
  return 0; // 如果没有旋转，则返回0
}

type KEYS = keyof typeof ATTR_KEY
/**
 * 设置元素的属性
 * @param element 目标元素
 * @param attr 属性key
 * @param value 属性值
 * @returns 
 */
export function handleAttr(element: Element | null, attr: KEYS): string | null;
export function handleAttr(element: Element | null, attr:  KEYS, value: string): void;
export function handleAttr(element: Element | null, attr:  KEYS, value?: string) {
  if (value) {
    element?.setAttribute(ATTR_KEY[attr], value)
  } else {
    return element?.getAttribute(ATTR_KEY[attr]);
  }
}

/**
 * 移除元素属性
 * @param element 目标元素
 * @param attr 属性key
 */
export function delAttr(element: Element | null, attr: KEYS) {
  element?.removeAttribute(ATTR_KEY[attr])
}

export function selectDOM(el: Element | Document, query: string): Element | null;
export function selectDOM(el: Element | Document, query: string, isAll: boolean): NodeListOf<Element> | null;
export function selectDOM(el: Element | Document, query: string, isAll?: boolean) {
  return isAll ?  el.querySelectorAll(query) : el.querySelector(query);
}
