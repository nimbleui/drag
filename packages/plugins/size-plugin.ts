import type { Plugin } from "../drag/types"

interface Options {}

export function sizePlugin(options?: Options): Plugin {
  return {
    name: "size-plugin",
    runRequire: (target) => target.dataset.dragInfo == 'dot',
    down({ data }, done) {
      const el = data.target as HTMLElement
      const { offsetLeft: l, offsetTop: t, offsetWidth: w, offsetHeight: h } = el;
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