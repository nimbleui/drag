import type { Plugin } from "../drag/types"
export function groupPlugin(): Plugin {
  return {
    name: "group-plugin",
    runTarge: 'canvas',
    
  }
}