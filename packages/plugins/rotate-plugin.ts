import { Plugin } from "../drag";

export function rotatePlugin(): Plugin {
  return {
    name: "rotatePlugin",
    runTarge: "rotate",
    down({ targetSite }, done) {
      const { width, height, left, top } = targetSite;
      // 计算中心点
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      done({ centerX, centerY })
    },
    move({ moveX, moveY, pluginValue }) {
      const { centerX, centerY } = pluginValue['rotate-plugin-down'];
      console.log(centerX, centerY)
      console.log(moveX, moveY)
    },
  }
}