import type { Plugin, MoveRectList, MoveRect } from "../drag/types";
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
 * 计算碰撞值
 * @param moves 
 * @param sourceRect 
 * @returns 
 */
function getMoveElementSite(moves: MoveRectList, sourceRect: Omit<MoveRect, 'el'>) {
  const { height, width } = sourceRect
  const lines: { x: LineType, y: LineType } = { x: [], y: [] }
  for (let i = 0; i < moves.length || 0; i++) {
    const { left: l, top: t, width: w, height: h, right: r, bottom: b } = moves[i];
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
    runTarge: 'move',
    down({ canvasEl, moveSite, currentSite }, done) {
      const { elY, elX } = createLine(canvasEl, options)

      done({ elY, elX, ...getMoveElementSite(moveSite, currentSite!) })
    },
    move({ disX, disY, pluginValue, currentEl, canvasSite }) {
      const { elY, elX, sourceRect, lines } = pluginValue['guidelines-plugin-down'];
      // 获取画布距离左边和上边的距离
      const { left, top } = canvasSite
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

      const el = currentEl as HTMLElement
      if (markLines.top == null) {
        elY.style.display = "none";
      } else {
        elY.style.top = `${markLines.top}px`;
        elY.style.display = "block";
        el && (el.style.top = `${y + markLines.diffY - top}px`)
      }
      if (markLines.left == null) {
        elX.style.display = "none";
      } else {
        elX.style.left = `${markLines.left}px`;
        elX.style.display = "block";
        el && (el.style.left = `${x + markLines.diffX -left}px`)
      }
    },
    up({ pluginValue }) {
      const { elY, elX } = pluginValue['guidelines-plugin-down'];
      elX.style.display = "none";
      elY.style.display = "none";
    }
  }
}