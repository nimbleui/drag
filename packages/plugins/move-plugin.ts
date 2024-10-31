import type { Plugin } from "../drag/types"
interface Options {
  // borderColor?: string;
  // dotColor?: string;
  // size?: boolean;
  updateSite?: (data: { x: number; y: number, id?: number | string, target: HTMLElement } ) => void
}

/**
 * 移动插件
 * @param options 
 * @returns 
 */
export function movePlugin(options?: Options): Plugin {
  return {
    name: "move-plugin",
    runTarge: 'move',
    down({ currentEl }, done) {
      if (!currentEl) return
      const { offsetLeft: l, offsetTop: t } = currentEl as HTMLElement;
      done({ l, t });
    },
    move({ currentEl, disX, disY, funValue }) {
      if (!currentEl) return;

      const { l, t } = funValue.down
      const y = disY + t;
      const x = disX + l;
      const el = currentEl as HTMLElement
      el.style.top = `${y}px`;
      el.style.left = `${x}px`;

      options?.updateSite?.({x, y, id: el.dataset['dragId'], target: el })
    },
  }
}