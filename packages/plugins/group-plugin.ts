import { DRAG_TYPE, DRAG_DISABLED, DRAG_GROUP, DRAG_GROUP_ID } from "@nimble-ui/constant";
import { createId, getRotationDegrees } from "@nimble-ui/utils";
import type { Plugin } from '../drag/types';

function setSite(
  el: HTMLElement,
  data: { left: number; top: number; width: number; height: number }
) {
  Object.keys(data).forEach((key: string) => {
    el.style[key] = `${data[key]}px`;
  });
}

export function groupPlugin(): Plugin {
  return {
    name: 'group-plugin',
    runTarge: 'area',
    allDown({ moveSite, canvasEl, currentEl }) {
      const group = canvasEl.querySelector(`[${DRAG_GROUP}]`);
      if (currentEl == group) return;

      group && canvasEl.removeChild(group);
      moveSite.forEach((item) => {
        (item.el as HTMLElement).style.display = 'block'
      })
    },
    down({ canvasEl }, done) {
      const areaEl = canvasEl.querySelector(`[${DRAG_TYPE}='area']`);
      if (areaEl) {
        (areaEl as HTMLElement).style.display = 'none';
      }
      done({ areaEl });
    },
    move({ disX, disY, funValue, startX, startY, canvasSite }, done) {
      const { areaEl } = funValue.down;
      const x = startX - canvasSite.left;
      const y = startY - canvasSite.top;
      areaEl.style.display = 'block';

      const width = Math.abs(disX);
      const height = Math.abs(disY);
      const top = disY < 0 ? y + disY : y;
      const left = disX < 0 ? x + disX : x;
      setSite(areaEl, { width, height, top, left });
      done({ width, height, top, left });
    },
    up({ moveSite, funValue, canvasSite, canvasEl }) {
      const { areaEl } = funValue.down;
      const { width, height, top: t, left: l } = funValue.move;
      const b = t + height;
      const r = l + width;

      // 过滤满足的条件
      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;
      const els: Element[] = [];
      moveSite.forEach((move) => {
        const { top, left, bottom, right } = move;

        const tReal = top - canvasSite.top;
        const bReal = bottom - canvasSite.top;
        const lReal = left - canvasSite.left;
        const rReal = right - canvasSite.left;

        // 判断是否禁用
        const isDisabled = move.el.getAttribute(DRAG_DISABLED) == 'true'
        // 判断是否在区域内并且不是禁用的
        if (t < tReal && b > bReal && l < lReal && r > rReal && !isDisabled) {
          els.push(move.el);
          minX = Math.min(minX, lReal);
          maxX = Math.max(maxX, rReal);
          minY = Math.min(minY, tReal);
          maxY = Math.max(maxY, bReal);
        }
      });

      areaEl.style.display = 'none';
      if (els.length < 2) return;

      // 计算组合元素的位置
      const groupEl = areaEl.cloneNode() as HTMLElement;
      groupEl.setAttribute(`${DRAG_TYPE}`, 'move');
      groupEl.setAttribute(`${DRAG_GROUP}`, 'true');

      const w = maxX - minX;
      const h = maxY - minY;
      groupEl.style.width = `${w}px`;
      groupEl.style.height = `${h}px`;
      groupEl.style.top = `${minY}px`;
      groupEl.style.left = `${minX}px`;
      groupEl.style.display = 'block';
      canvasEl.appendChild(groupEl);

      els.forEach((el) => {
        const id = createId();
        const item = el.cloneNode(true) as HTMLElement;
        const {offsetHeight: height, offsetLeft: left, offsetTop: top, offsetWidth: width} = el as HTMLElement
        item.style.top = `${(top - minY) / h * 100}%`;
        item.style.left = `${(left - minX) / w * 100}%`;
        item.style.width = `${width / w * 100}%`;
        item.style.height = `${height / h * 100}%`;
        item.removeAttribute(`${DRAG_TYPE}`);
        item.setAttribute(`${DRAG_GROUP_ID}`, id);
        
        // 判断是否有旋转
        const angle = getRotationDegrees(el);
        if (angle) groupEl.setAttribute(`${DRAG_GROUP}`, 'angle');

        el.setAttribute(`${DRAG_GROUP_ID}`, `${id}`);
        (el as HTMLElement).style.display = 'none';
        groupEl.appendChild(item);
      })
    },
  };
}
