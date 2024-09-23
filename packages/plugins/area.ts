import type { Plugin } from "../drag/types"

export function areaPlugin(): Plugin {
  return {
    name: "area-plugin",
    move(data) {
      console.log(data)
    },
  }
}