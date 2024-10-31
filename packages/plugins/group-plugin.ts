import type { Plugin } from "../drag/types";

const STYLE = `display: block;box-sizing: border-box;position: relative;width: 0;height: 0;z-index: 10000;border: 1px solid #1677ff;background-color: rgba(22, 119, 255, 0.3);`

const createEl = (canvas: Element) => {
  let el = canvas.querySelector(".drag-group");

  if (!el) {
    el = document.createElement('div');
    el.classList.add("drag-group");

    canvas.appendChild(el);
  }
  el.setAttribute("style", STYLE);
  return el;
}

export function groupPlugin(): Plugin {
  return {
    name: "group-plugin",
    runTarge: 'canvas',
    down({ canvasEl }, done) {
      const groupEl = createEl(canvasEl);
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
      groupEl.style.left = `${left}px`;
      groupEl.style.top = `${top}px`;
      groupEl.style.width = `${width}px`;
      groupEl.style.height = `${height}px`;
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
        groupEl.style.left = `${minX}px`;
        groupEl.style.top = `${minY}px`;
        groupEl.style.width = `${maxX - minX}px`;
        groupEl.style.height = `${maxY - minY}px`;
      }
    }
  }
}