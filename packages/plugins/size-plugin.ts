import type { Plugin } from "../drag/types"

interface Options {}

export function sizePlugin(options?: Options): Plugin {
  return {
    name: "size-plugin",
    runRequire: (target) => target.dataset.dragInfo == 'dot',
    down({ moveEl }, done) {
      const { offsetLeft: l, offsetTop: t, offsetWidth: w, offsetHeight: h } = moveEl!;
      done({ l, t, w, h });
    },
    move({ data, pluginValue }) {
      const { target, disX, disY } = data;
      const { l, t, w, h } = pluginValue['size-plugin-down']
      const el = target as HTMLElement;
      el.style.top = `${disY + t}px`;
      el.style.left = `${disX + l}px`;
    },
  }
}