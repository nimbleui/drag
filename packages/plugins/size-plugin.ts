import type { Plugin } from "../drag/types"

interface Options {}

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

const degToRadian = (deg: number) => (deg * Math.PI) / 180;
const cos = (deg: number) => Math.cos(degToRadian(deg));
const sin = (deg: number) => Math.sin(degToRadian(deg));

export function sizePlugin(options?: Options): Plugin {
  return {
    name: "size-plugin",
    runTarge: "dot",
    down({ currentEl }, done) {
      const { offsetLeft: l, offsetTop: t, offsetWidth: w, offsetHeight: h } = currentEl as HTMLElement;
      done({ l, t, w, h });
    },
    move({ pluginValue, e, currentEl }) {
      const { l, t, w, h } = pluginValue['size-plugin-down']
      const target = e.target as HTMLElement;
      const direction = target.dataset.dragSite
      const angle = getRotationDegrees(currentEl)
      
      console.log(direction)
      console.log('angle', angle)
      // el.style.top = `${disY + t}px`;
      // el.style.left = `${disX + l}px`;
    },
  }
}
