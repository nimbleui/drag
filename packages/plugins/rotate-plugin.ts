import { Plugin } from "../drag";

export function rotatePlugin(): Plugin {
  return {
    name: "rotate-plugin",
    runTarge: "rotate",
    down({ currentSite }, done) {
      const { width, height, left, top } = currentSite!;
      // 计算中心点
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      done({ centerX, centerY })
    },
    move({ moveX, moveY, funValue }) {
      const { centerX, centerY } = funValue.down;
      const diffX = centerX - moveX;
      const diffY = centerY - moveY;
      const radians = Math.atan2(diffY, diffX);
      const deg = (radians * 180) / Math.PI - 90
      console.log((deg + 360) % 360)
    },
  }
}