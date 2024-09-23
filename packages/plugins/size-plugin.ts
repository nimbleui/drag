import type { Plugin } from "../drag/types"

interface Options {}

export function sizePlugin(options?: Options): Plugin {
  return {
    name: "size-plugin",
    down({ data }, done) {
      const el = data.target as HTMLElement
      const { offsetLeft: l, offsetTop: t, offsetWidth: w, offsetHeight: h } = el;
      done({ l, t, w, h });
    },
    move({ data, value }) {
      const { target, disX, disY } = data;
      const { l, t, w, h } = value['size-plugin-down']
      const el = target as HTMLElement;
      el.style.top = `${disY + t}px`;
      el.style.left = `${disX + l}px`;
    },
  }
}