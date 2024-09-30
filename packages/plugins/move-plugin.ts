import type { Plugin } from "../drag/types"

const BORDER_STYLE = `position: absolute;top: 0;left: 0;width: 100%;height: 100%;pointer-events: none;margin: -1px 0 0 -1px;`;
const BORER_SITE_STYLE_COMMON = `position: absolute;width: 10px;height: 10px;border-radius: 50%;box-sizing: border-box;z-index: 4;pointer-events: all;`;
const dotSite = {
  "lt": `top: -5px; left: -5px; cursor: nw-resize;`,
  "t": `top: -5px; left: 50%; cursor: n-resize; transform: translateX(-50%);`,
  "rt": `top: -5px; right: -5px; cursor: ne-resize;`,
  "lb": `left: -5px; bottom: -5px; cursor: sw-resize;`,
  "b": `left: 50%; bottom: -5px; transform: translateX(-50%); cursor: s-resize;`,
  "rb": `right: -5px; bottom: -5px; cursor: se-resize;`,
  "l": `left: -5px; top: 50%; transform: translateY(-50%); cursor: w-resize;`,
  "r": `right: -5px; top: 50%; transform: translateY(-50%); cursor: e-resize;`
}

interface Options {
  borderColor?: string;
  dotColor?: string;
  size?: boolean;
  updateSite?: (data: { x: number; y: number, id?: number | string }) => void
}

// 移除当前以外的元素
function removeEl() {
  const els = document.querySelectorAll(".drag-border");
  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    el.parentElement?.removeChild(el)
  }
}

/**
 * 创建元素
 * @param target 目标元素 
 * @param isDot 是否创建点
 * @param options 插件的参数
 * @returns 
 */
function createElement(target: HTMLElement, isDot: boolean, options?: Options) {
  // 获取是否存在圆点
  let borderEl = target.querySelector(".drag-border");
  // 判断是否点击圆点
  const isClickDot = target.dataset.dragInfo == 'dot'
  if (borderEl || isClickDot) return borderEl;

  removeEl()
  borderEl = document.createElement('div');
  borderEl.className = 'drag-border';
  const color = options?.borderColor || '#1677ff';
  if (isDot) {
    Object.keys(dotSite).forEach((site) => {
      const el = document.createElement("span");
      el.setAttribute('data-drag-site', site);
      el.setAttribute("data-drag-info", 'dot');
      el.setAttribute("style", `${BORER_SITE_STYLE_COMMON}${dotSite[site]}border: 1px solid ${color};background:${options?.dotColor || '#a2c9ff'}`)
      borderEl.appendChild(el)
    })
  }

  borderEl.setAttribute('style',`${BORDER_STYLE}border: 1px solid ${color}`)
  target.appendChild(borderEl)
  return borderEl
}

/**
 * 移动插件
 * @param options 
 * @returns 
 */
export function movePlugin(options?: Options): Plugin {
  return {
    name: "move-plugin",
    runRequire: (target) => target.dataset.dragInfo == 'move',
    down({ data, citePlugins }, done) {
      const el = data.target as HTMLElement;
      const { offsetLeft: l, offsetTop: t } = el;
      createElement(el, citePlugins['size-plugin'], options)
      done({ l, t });
    },
    move({ data, pluginValue }) {
      const { target, disX, disY } = data;
      const { l, t } = pluginValue['move-plugin-down']
      const el = target as HTMLElement;
      const y = disY + t;
      const x = disX + l;
      el.style.top = `${y}px`;
      el.style.left = `${x}px`;

      options?.updateSite?.({x, y, id: el.dataset['dragId'] })
    },
  }
}