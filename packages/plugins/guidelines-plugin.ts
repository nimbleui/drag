import type { Plugin } from "../drag/types"
import { getBoundingClientRectByScale } from "../utils";
interface Options {
  color?: string; // 辅助线的元素
  threshold?: number; // 吸附
}

interface ItemType {
  value: number;
  showValue: number;
}
type LineType = ItemType[];
type MarkLineType = {
  top: number | null;
  left: number | null;
  diffX: number;
  diffY: number;
};

const defaultMarkLine = { top: null, left: null, diffX: 0, diffY: 0 };

/**
 * 创建辅助线元素
 * @param el 画布
 * @param options 参数 
 * @returns 
 */
function createLine(el: Element, options?: Options) {
  let elY = el.querySelector(".drag-guideline-line-y") as HTMLElement | null;
  let elX = el.querySelector(".drag-guideline-line-x") as HTMLElement | null;
  const color = options?.color || '#1677ff'
  if (!elY) {
    elY = document.createElement("div");
    elY.classList.add("drag-guideline-line-y");
    elY.setAttribute(
      "style",
      `position: absolute; background-color: ${color}; display: none;width: 100%; height: 1px;`
    );
    el.appendChild(elY);
  }

  if (!elX) {
    elX = document.createElement("div");
    elX.classList.add("drag-guideline-line-x");
    elX.setAttribute(
      "style",
      `top: 0;position: absolute; background-color: ${color}; display: none;width: 1px; height: 100%;`
    );
    el.appendChild(elX);
  }

  return { elX, elY }
}

/**
 * 获取所有移动元素的跟当前移动元素的位置
 * @param target 移动元素
 * @param scale 缩放比例
 * @param el 画布
 * @returns 
 */
function getMoveElementSite(target: Element, scale: number, el?: Element) {
  const moves = el?.querySelectorAll('[data-drag-info="move"]')
  const sourceRect = getBoundingClientRectByScale(target, scale)
  if (!moves) return { sourceRect, lines: { x: [], y: [] } };

  const { height, width } = sourceRect
  const lines: { x: LineType, y: LineType } = { x: [], y: [] }
  for (let i = 0; i < moves.length || 0; i++) {
    const item = moves[i];
    if (target == item) continue;
    
    const { left: l, top: t, width: w, height: h, right: r, bottom: b } = getBoundingClientRectByScale(item, scale);
    const halfW = w / 2;
    const halfH = h / 2;

    lines.y.push({ showValue: t, value: t }); // 顶对顶
    lines.y.push({ showValue: t, value: t - height / 2 }); // 顶对中
    lines.y.push({ showValue: t, value: t - height }); // 顶对底

    lines.y.push({ showValue: t + halfH, value: t + halfH }); // 中对顶
    lines.y.push({ showValue: t + halfH, value: t + halfH - height / 2 }); // 中对中
    lines.y.push({ showValue: t + halfH, value: t + halfH - height }); // 中对底

    lines.y.push({ showValue: b, value: b }); // 底对顶
    lines.y.push({ showValue: b, value: b - height / 2 }); //底对中
    lines.y.push({ showValue: b, value: b - height }); // 底对底

    lines.x.push({ showValue: l, value: l }); // 左对左
    lines.x.push({ showValue: l, value: l - width / 2 }); // 左对中
    lines.x.push({ showValue: l, value: l - width }); // 左对右

    lines.x.push({ showValue: l + halfW, value: l + halfW - width }); // 中对右
    lines.x.push({ showValue: l + halfW, value: l + halfW - width / 2 }); // 中对中
    lines.x.push({ showValue: l + halfW, value: l + halfW }); // 中对左

    lines.x.push({ showValue: r, value: r }); // 右对左
    lines.x.push({ showValue: r, value: r - width / 2 }); // 右对中
    lines.x.push({ showValue: r, value: r - width }); // 右对右
  }

  return { sourceRect, lines }
}

export function guidelinesPlugin(options?: Options): Plugin {
  const threshold = options?.threshold ?? 5
  const markLines: MarkLineType = Object.assign({}, defaultMarkLine)
  return {
    name: 'guidelines-plugin',
    down({ data, scale, target }, done) {
      const { binElement } = data
      const { elY, elX } = createLine(binElement!, options)

      done({ elY, elX, ...getMoveElementSite(target!, scale, binElement) })
    },
    move({ data, pluginValue, scale, target }) {
      const { disX, disY, binElement } = data;
      const { elY, elX, sourceRect, lines } = pluginValue['guidelines-plugin-down'];
      // 获取画布距离左边和上边的距离
      const { left, top } = getBoundingClientRectByScale(binElement!, scale)
      Object.assign(markLines, defaultMarkLine);

      const y = sourceRect.top + disY
      for (let i = 0; i < lines.y.length; i++) {
        const { value, showValue } = lines.y[i];
        if (Math.abs(value - y) < threshold) {
          markLines.diffY = value - y;
          markLines.top = showValue - top
          break;
        }
      }
      const x = sourceRect.left + disX
      for (let i = 0; i < lines.x.length; i++) {
        const { value, showValue } = lines.x[i];
        if (Math.abs(value - x) < threshold) {
          markLines.diffX = value - x;
          markLines.left = showValue - left;
          break;
        }
      }

      if (markLines.top == null) {
        elY.style.display = "none";
      } else {
        elY.style.top = `${markLines.top}px`;
        elY.style.display = "block";
        target && (target.style.top = `${y + markLines.diffY - top}px`)
      }
      if (markLines.left == null) {
        elX.style.display = "none";
      } else {
        elX.style.left = `${markLines.left}px`;
        elX.style.display = "block";
        target && (target.style.left = `${x + markLines.diffX -left}px`)
      }
    },
    up({ pluginValue }) {
      const { elY, elX } = pluginValue['guidelines-plugin-down'];
      elX.style.display = "none";
      elY.style.display = "none";
    }
  }
}