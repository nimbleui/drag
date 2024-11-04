import type { Plugin } from "../drag/types";

interface Options {}

function infoPlugin(options: Options): Plugin {
  return {
    name: "info-plugin",
    runTarge: 'move',
    move(data, done) {
      console.log(222)
    },
  }
}