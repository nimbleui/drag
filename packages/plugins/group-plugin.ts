import type { Plugin } from "../drag/types"
export function groupPlugin(): Plugin {
  return {
    name: "group-plugin",
    runTarge: 'canvas',
    down({ target }, done) {
      console.log(target)
    },
  }
}