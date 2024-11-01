import type { Plugin } from "../drag/types";

function setSite(el: HTMLElement, data: { left: number;top: number;width: number;height: number; }) {
  Object.keys(data).forEach((key: string) => {
    el.style[key] = `${data[key]}px`;
  })
}

export function groupPlugin(): Plugin {
  return {
    name: "group-plugin",
    runTarge: ['canvas', 'group'],
    down({ canvasEl, type }, done) {
      console.log(type)
      const groupEl = canvasEl.querySelector("[data-drag-type='group']");
      done({ groupEl });
    },
    move({ disX, disY, funValue, startX, startY, canvasSite }, done) {
      const { groupEl } = funValue.down;
      const x = startX - canvasSite.left;
      const y = startY - canvasSite.top;

      const width = Math.abs(disX);
      const height = Math.abs(disY);
      const top = disY < 0 ? y + disY : y;
      const left = disX < 0 ? x + disX : x;
      setSite(groupEl, { width, height,  top, left });
      done({ width, height, top, left });
    },
    up({ moveSite, funValue, canvasSite }) {
      const { groupEl } = funValue.down;
      const { width, height, top: t, left: l } = funValue.move;
      const b = t + height;
      const r = l + width;

      // 过滤满足的条件
      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;
      const els: Element[] = []
      moveSite.forEach((move) => {
        const { top, left, bottom, right } = move;
        if (t < top && b > bottom && l < left && r > right) {
          els.push(move.el);
          minX = Math.min(minX, left - canvasSite.left);
          maxX = Math.max(maxX, right - canvasSite.left);
          minY = Math.min(minY, top - canvasSite.top);
          maxY = Math.max(maxY, bottom - canvasSite.top);
        }
      })
      if (!els.length) {
        groupEl.style.display = 'none';
      } else {
        setSite(groupEl, { width: maxX - minX, height: maxY - minY, top: minY, left: minX });
      }
    }
  }
}