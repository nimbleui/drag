import { getRotationDegrees } from '@nimble-ui/utils';
import { DRAG_SITE, DRAG_TYPE } from "@nimble-ui/constant";

const BORDER_STYLE = `position: absolute;box-sizing: border-box;pointer-events: none;z-index: 99999;`;
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
const GROUP_STYE = `display: block;box-sizing: border-box;position: relative;width: 0;height: 0;z-index: 10000;border: 1px solid #1677ff;background-color: rgba(22, 119, 255, 0.3);`;

interface Options {
  canvas: Element;
  dot: boolean;
  rotate: boolean;
  group: boolean;
  target: Element | null;
}

export function createElement(options: Options) {
  return () => {
    const { canvas, dot, rotate, target, group } = options;
    let content = canvas.querySelector('.drag-mask');

    if (!content) {
      content = document.createElement('div');
      content.classList.add('drag-mask');
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
    }

    // 创建组元素
    let groupEl = canvas.querySelector(`[${DRAG_TYPE}='group']`);
    if (group && !groupEl) {
      groupEl = document.createElement('div');
      groupEl.setAttribute(DRAG_TYPE, 'group');
      groupEl.setAttribute('style', GROUP_STYE);
      canvas.appendChild(groupEl);
    }
    // 判断当前元素是否组元素
    if (groupEl != target) {
      (groupEl as HTMLElement).style.display = 'none';
    }

    // 判断有没有选择可以移动元素
    if (!target) {
      return content.setAttribute('style', 'display: none;');
    }
    const t = target as HTMLElement;
    content.setAttribute(
      'style',
      `${BORDER_STYLE}border: 1px solid #1677ff;top: ${t.offsetTop}px;left: ${
        t.offsetLeft
      }px;width: ${t.offsetWidth}px;height: ${
        t.offsetHeight
      }px;transform: rotate(${getRotationDegrees(t)}deg);`
    );
    canvas.appendChild(content);
    return content;
  };
}
