import { MoveRect } from "./types"

const BORDER_STYLE = `position: absolute;box-sizing: border-box;pointer-events: none;z-index: 99999;`;
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

const ROTATE_STYLE = `position: absolute;width: 15px;height: 15px;border-radius: 50%;transform: translateX(-50%);left: 50%;top: -25px;`

interface Options {
  canvas: Element;
  dot: boolean;
  rotate: boolean;
  target: Element | null;
}

export function createElement(options: Options) {
  return () => {
    const { canvas, dot, rotate, target } = options;
    let content = canvas.querySelector("[data-drag-type='content']");

    if (!content) {
      content = document.createElement("div");
      content.setAttribute('data-drag-type', 'content')
      // 创建八个点
      if (dot) {
        Object.keys(dotSite).forEach((site) => {
          const el = document.createElement("span");
          el.setAttribute('data-drag-site', site);
          el.setAttribute("data-drag-type", 'dot');
          el.setAttribute("style", `${BORER_SITE_STYLE_COMMON}${dotSite[site]}border: 1px solid #1677ff;background: #1677ff;`)
          content?.appendChild(el)
        });
      }
      // 创建可以旋转按钮
      if (rotate) {
        const el = document.createElement("div");
        el.setAttribute("data-drag-rotate", 'true')
        el.setAttribute("style", `${ROTATE_STYLE}background: #1677ff;`);
        content.appendChild(el);
      }
    }

    // 判断有没有选择可以移动元素
    if (!target) {
      return content.setAttribute('style', 'display: none;');
    }
    const t = target as HTMLElement
    content.setAttribute('style',
      `${BORDER_STYLE}border: 1px solid #1677ff;top: ${t.offsetTop}px;left: ${t.offsetLeft}px;width: ${t.offsetWidth}px;height: ${t.offsetHeight}px;`);
    canvas.appendChild(content);
    return content;
  }
}