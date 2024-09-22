import type { Plugin } from "./types"

export function areaPlugin(): Plugin {
  return {
    enforce: 'move',
    fun(data) {
      console.log(data)
    },
  }
}