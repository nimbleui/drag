import type { Plugin } from "../drag/types";

const STYLE = `display: block;position: relative;width: 0;height: 0;z-index: 10000;border: 1px solid #1677ff;background-color: rgba(22, 119, 255, 0.3);`

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
    up({ funValue }) {
      const { groupEl } = funValue.down;

      groupEl.style.display = 'none';
    }
  }
}