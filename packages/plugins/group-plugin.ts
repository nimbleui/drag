import { DRAG_TYPE, DRAG_GROUP } from "@nimble-ui/constant";
import { createId, delAttr, getRotationDegrees, handleAttr, setStyle } from "@nimble-ui/utils";
import type { Plugin } from '../drag/types';

export function groupPlugin(): Plugin {
  return {
    name: 'group-plugin',
    runTarge: 'canvas',
    allDown({ moveSite, canvasEl, currentEl }) {
      const group = canvasEl.querySelector(`[${DRAG_GROUP}]`);
      if (currentEl == group) return;

      group && canvasEl.removeChild(group);
      moveSite.forEach((item) => {
        (item.el as HTMLElement).style.display = 'block'
      })
    },
    down({ canvasEl, startX, startY, canvasSite }, done) {
      const areaEl = canvasEl.querySelector(`[${DRAG_TYPE}='area']`);
      const x = startX - canvasSite.left;
      const y = startY - canvasSite.top;
      setStyle(areaEl, [x, y, 0, 0]);
      done({ areaEl, x, y });
    },
    move({ disX, disY, funValue }, done) {
      const { areaEl, x, y } = funValue.down;

      const width = Math.abs(disX);
      const height = Math.abs(disY);
      const top = disY < 0 ? y + disY : y;
      const left = disX < 0 ? x + disX : x;
      setStyle(areaEl, [left, top, width, height, 'block'])
      done({ width, height, top, left });
    },
    up({ moveSite, funValue, canvasSite, canvasEl, isMove }) {
      if (!isMove) return;
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
        const isDisabled = handleAttr(move.el, 'disabled') == 'true'
        // 判断是否在区域内并且不是禁用的
        if (t < tReal && b > bReal && l < lReal && r > rReal && !isDisabled) {
          els.push(move.el);
          minX = Math.min(minX, lReal);
          maxX = Math.max(maxX, rReal);
          minY = Math.min(minY, tReal);
          maxY = Math.max(maxY, bReal);
        }
      });

      setStyle(areaEl, [0, 0, 0, 0, 'none']);
      if (els.length < 2) return;

      // 计算组合元素的位置
      const groupEl = areaEl.cloneNode(true) as HTMLElement;
      handleAttr(groupEl, 'type', 'move');
      handleAttr(groupEl, 'group', 'true');

      const w = maxX - minX;
      const h = maxY - minY;
      setStyle(groupEl, [minX, minY, w, h]);
      groupEl.style.display = 'block';
      canvasEl.appendChild(groupEl);

      els.forEach((el) => {
        const id = createId();
        const item = el.cloneNode(true) as HTMLElement;
        const { offsetHeight: height, offsetLeft: left, offsetTop: top, offsetWidth: width } = el as HTMLElement;
        setStyle(item, [`${(left - minX) / w * 100}%`, `${(top - minY) / h * 100}%`, `${width / w * 100}%`, `${height / h * 100}%`]);
        delAttr(item, 'type');
        handleAttr(item, 'groupId', id)
        
        // 判断是否有旋转
        const angle = getRotationDegrees(el);
        if (angle) handleAttr(groupEl, 'group', 'angle');

        handleAttr(el, 'groupId', id);
        (el as HTMLElement).style.display = 'none';
        groupEl.appendChild(item);
      })
    },
  };
}
