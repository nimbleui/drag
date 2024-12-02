import path from "node:path";
import { writeFile } from "node:fs";
import { projRoot } from "./utils";

const pkg = {
  name: "@nimble-ui/drag",
  version: "1.0.0",
  description: "low code drag",
  author: {
    name: "Chen Yu Yun",
    email: "897908015@qq.com"
  },
  keywords: ["low code", "vue", "vue3", "drag", "react", "component library", "ui framework", "ui", "@nimble-ui/drag", "nimble-ui"],
  license: "MIT",
  main: "lib/drag/index.cjs.js",
  module: "es/drag/index.esm.js",
  browser: "index.full.min.js",
  types: "types/index.d.ts",
  homepage: "https://nimbleui.github.io/docs/",
  bugs: {
    url: "https://github.com/nimbleui/drag/issues",
  },
  repository: {
    type: "git",
    url: "git+https://github.com/nimbleui/drag",
  },
  publishConfig: {
    access: "public",
  },
  exports: {
    ".": {
      import: "es/drag/index.esm.js",
      require: "lib/drag/index.cjs.js",
      browser: "index.full.min.js",
      types: "types/index.d.ts",
    }
  }
};

export function createPackage() {
  return new Promise((resolve, reject) => {
    writeFile(path.resolve(projRoot, "dist/package.json"), JSON.stringify(pkg, null, 2), (err) => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
}