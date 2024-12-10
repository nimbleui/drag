import type { Plugin } from '../drag/types';
import { getRotationDegrees } from '@nimble-ui/utils';

interface Options {}

const degToRadian = (deg: number) => (deg * Math.PI) / 180;
const cos = (deg: number) => Math.cos(degToRadian(deg));
const sin = (deg: number) => Math.sin(degToRadian(deg));

export function sizePlugin(options?: Options): Plugin {
  return {
    name: 'size-plugin',
    runTarge: 'dot',
    down({ currentEl, e }, done) {
      const target = e.target as HTMLElement;
      const direction = target.dataset.dragSite;
      const {
        offsetLeft: l,
        offsetTop: t,
        offsetWidth: w,
        offsetHeight: h,
      } = currentEl as HTMLElement;

      done({ l, t, w, h, direction });
    },
    move({ disX, disY, funValue, currentEl }) {
      const { l, t, w, h, direction } = funValue.down;
      const angle = getRotationDegrees(currentEl);
      const result = handleRatio(disX, disY, direction, angle, {
        centerX: l + w / 2,
        centerY: t + h / 2,
        width: w,
        height: h,
      });
      const el = currentEl as HTMLElement;
      el.style.left = `${result.left}px`;
      el.style.top = `${result.top}px`;
      el.style.height = `${result.height}px`;
      el.style.width = `${result.width}px`;
    },
  };
}

const setValue = (size: number, delta: number, minSize = 0) => {
  const value = size + delta;
  if (value > minSize) {
    size = value;
  } else {
    delta = minSize - size;
    size = minSize;
  }
  return [size, delta];
};

type Rect = { centerX: number; centerY: number; width: number; height: number };
const handleRatio = (
  deltaX: number,
  deltaY: number,
  type: string,
  rotate: number,
  rect: Rect
) => {
  const alpha = Math.atan2(deltaY, deltaX);
  const deltaL = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const beta = alpha - degToRadian(rotate);
  let deltaW = deltaL * Math.cos(beta);
  let deltaH = deltaL * Math.sin(beta);

  let { centerX, centerY, width, height } = rect;
  switch (type) {
    case 'lt': {
      deltaW = -deltaW;
      deltaH = -deltaH;
      [width, deltaW] = setValue(width, deltaW);
      [height, deltaH] = setValue(height, deltaH);

      centerX -= (deltaW / 2) * cos(rotate) - (deltaH / 2) * sin(rotate);
      centerY -= (deltaW / 2) * sin(rotate) + (deltaH / 2) * cos(rotate);
      break;
    }
    case 't': {
      deltaH = -deltaH;
      [height, deltaH] = setValue(height, deltaH);

      centerX += (deltaH / 2) * sin(rotate);
      centerY -= (deltaH / 2) * cos(rotate);
      break;
    }
    case 'rt': {
      deltaH = -deltaH;
      [width, deltaW] = setValue(width, deltaW);
      [height, deltaH] = setValue(height, deltaH);

      centerX += (deltaW / 2) * cos(rotate) + (deltaH / 2) * sin(rotate);
      centerY += (deltaW / 2) * sin(rotate) - (deltaH / 2) * cos(rotate);
      break;
    }
    case 'r': {
      [width, deltaW] = setValue(width, deltaW);
      // 左边固定
      centerX += (deltaW / 2) * cos(rotate);
      centerY += (deltaW / 2) * sin(rotate);
      break;
    }
    case 'rb': {
      [width, deltaW] = setValue(width, deltaW);
      [height, deltaH] = setValue(height, deltaH);

      centerX += (deltaW / 2) * cos(rotate) - (deltaH / 2) * sin(rotate);
      centerY += (deltaW / 2) * sin(rotate) + (deltaH / 2) * cos(rotate);
      break;
    }
    case 'b': {
      [height, deltaH] = setValue(height, deltaH);
      // 上边固定
      centerX -= (deltaH / 2) * sin(rotate);
      centerY += (deltaH / 2) * cos(rotate);
      break;
    }
    case 'lb': {
      deltaW = -deltaW;
      [width, deltaW] = setValue(width, deltaW);
      [height, deltaH] = setValue(height, deltaH);

      centerX -= (deltaW / 2) * cos(rotate) + (deltaH / 2) * sin(rotate);
      centerY -= (deltaW / 2) * sin(rotate) - (deltaH / 2) * cos(rotate);
      break;
    }
    case 'l': {
      deltaW = -deltaW;
      [width, deltaW] = setValue(width, deltaW);
      // 右边固定
      centerX -= (deltaW / 2) * cos(rotate);
      centerY -= (deltaW / 2) * sin(rotate);
    }
  }

  return {
    width: Math.round(Math.abs(width)),
    height: Math.round(Math.abs(height)),
    top: Math.round(centerY - Math.abs(height) / 2),
    left: Math.round(centerX - Math.abs(width) / 2),
  };
};
