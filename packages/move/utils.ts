import { isFunctionOrValue, isTouchEvent } from "@nimble-ui/utils"
import { ElType, MouseTouchEvent, OptionsType } from "./types"

/**
 * 获取鼠标的x、y坐标
 * @param e 事件对象
 * @returns 
 */
export function getXY(e: MouseTouchEvent) {
  const result = { x: 0, y: 0 }
  if (isTouchEvent(e)) {
    const touch = e.targetTouches[0]
    result.x = touch.pageX
    result.y = touch.pageY
  } else {
    result.x = e.clientX
    result.y = e.clientY
  }

  return result
}

/**
 * 计算缩放比例
 * @param e 事件对象
 * @param options 参数
 * @returns 
 */
export const numScale = (e: MouseTouchEvent, options?: OptionsType) => {
  const { x, y } = getXY(e);
  const scale = isFunctionOrValue(options?.scale) ?? 1

  return {
    clientX: x / scale,
    clientY: y / scale,
  };
};

/**
 * 获取代理目标函数
 * @param e 事件对象
 * @param el 元素
 * @param options 参数 
 * @returns 
 */
export const getTarget = (e: MouseTouchEvent, el: ElType, options?: OptionsType) => {
  const target = e.target as HTMLElement;
  const agencyTarget = options?.agencyTarget;
  if (!agencyTarget) return isFunctionOrValue(el);
  const t = agencyTarget ? agencyTarget(target) : target;
  if (!t) return false;
  return t;
};

/**
 * 计算边界限制
 * @param target 目标元素
 * @param options 参数
 */
export const sunBoundaryValue = (target: Element, options?: OptionsType) => {
  const el = isFunctionOrValue(options?.boundary);
  if (!el) return null

  const scale = isFunctionOrValue(options?.scale) ?? 1;
  const expand = options?.expand ?? 0;

  let boundaryT = 0;
  let boundaryL = 0;
  let boundaryR = document.documentElement.clientWidth;
  let boundaryB = document.documentElement.clientHeight;
  if (el !== window ) {
    const { left, top, right, bottom } = (el as Element).getBoundingClientRect();
    boundaryT = top - expand;
    boundaryL = left - expand;
    boundaryR = right + expand;
    boundaryB = bottom + expand;
  }

  const rect = target.getBoundingClientRect();
  return {
    l: (boundaryL - rect.left) / scale,
    r: (boundaryR - rect.right) / scale,
    t: (boundaryT - rect.top) / scale,
    b: (boundaryB - rect.bottom) / scale,
  }
}
