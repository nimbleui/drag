import { DRAG_SITE, DRAG_TYPE } from "@nimble-ui/constant";

const BORDER_STYLE = `display: none;position: absolute;box-sizing: border-box;pointer-events: none;z-index: 99999;`;
const BORER_SITE_STYLE_COMMON = `position: absolute;width: 10px;height: 10px;border-radius: 50%;box-sizing: border-box;z-index: 4;pointer-events: all;`;
const dotSite = {
  lt: `top: -5px; left: -5px; cursor: nw-resize;`,
  t: `top: -5px; left: 50%; cursor: n-resize; transform: translateX(-50%);`,
  rt: `top: -5px; right: -5px; cursor: ne-resize;`,
  lb: `left: -5px; bottom: -5px; cursor: sw-resize;`,
  b: `left: 50%; bottom: -5px; transform: translateX(-50%); cursor: s-resize;`,
  rb: `right: -5px; bottom: -5px; cursor: se-resize;`,
  l: `left: -5px; top: 50%; transform: translateY(-50%); cursor: w-resize;`,
  r: `right: -5px; top: 50%; transform: translateY(-50%); cursor: e-resize;`,
};

const ROTATE_STYLE = `pointer-events: all;position: absolute;width: 15px;height: 15px;border-radius: 50%;transform: translateX(-50%);left: 50%;top: -25px;`;
const AREA_STYE = `display: none;box-sizing: border-box;position: absolute;width: 0;height: 0;z-index: 10000;`;
const AREA_MASK_STYLE = `position: absolute;width: 100%;height: 100%;box-sizing: border-box;z-index: 99;border: 1px solid #1677ff;background-color: rgba(22, 119, 255, 0.3);`

interface Options {
  canvas: Element;
  dot: boolean;
  rotate: boolean;
}

export function createElement(options: Options) {
  const { canvas, dot, rotate } = options;
  let content = canvas.querySelector('.drag-mask');

  if (!content) {
    content = document.createElement('div');
    content.classList.add('drag-mask');
    content.setAttribute('style', BORDER_STYLE);
    // 创建八个点
    if (dot) {
      Object.keys(dotSite).forEach((site) => {
        const el = document.createElement('span');
        el.setAttribute(DRAG_SITE, site);
        el.setAttribute(DRAG_TYPE, 'dot');
        el.setAttribute(
          'style',
          `${BORER_SITE_STYLE_COMMON}${dotSite[site]}border: 1px solid #1677ff;background: #1677ff;`
        );
        content?.appendChild(el);
      });
    }
    // 创建可以旋转按钮
    if (rotate) {
      const el = document.createElement('div');
      el.setAttribute(DRAG_TYPE, 'rotate');
      el.setAttribute('style', `${ROTATE_STYLE}background: #1677ff;`);
      content.appendChild(el);
    }
    canvas.appendChild(content);
  }

  // 创建组元素
  let areaEl = canvas.querySelector(`[${DRAG_TYPE}='area']`);
  if (!areaEl) {
    areaEl = document.createElement('div');
    areaEl.setAttribute(DRAG_TYPE, 'area');
    areaEl.setAttribute('style', AREA_STYE);

    const maskEl = document.createElement('div');
    maskEl.setAttribute('style', AREA_MASK_STYLE);
    areaEl.appendChild(maskEl);
    canvas.appendChild(areaEl);
  }
}
