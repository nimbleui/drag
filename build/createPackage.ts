import path from 'node:path';
import { writeFile } from 'node:fs';
import { projRoot } from './utils';

const pkg = {
  name: '@nimble-ui/drag',
  version: '1.2.7',
  description: 'low code drag',
  author: {
    name: 'Chen Yu Yun',
    email: '897908015@qq.com',
  },
  keywords: [
    'low code',
    'vue',
    'vue3',
    'drag',
    'react',
    'component library',
    'ui framework',
    'ui',
    '@nimble-ui/drag',
    'nimble-ui',
  ],
  license: 'MIT',
  main: './index.cjs.js',
  module: './index.esm.js',
  types: './index.d.ts',
  unpkg: "./index.full.min.js",
  jsdelivr: "./index.full.min.js",
  homepage: 'https://github.com/nimbleui/drag',
  bugs: {
    url: 'https://github.com/nimbleui/drag/issues',
  },
  repository: {
    type: 'git',
    url: 'git+https://github.com/nimbleui/drag',
  },
  publishConfig: {
    access: 'public',
  },
  dependencies: {
    "@nimble-ui/move": "^1.0.6",
  },
  exports: {
    '.': {
      import: './index.esm.js',
      require: './index.cjs.js',
      types: './index.d.ts',
    },
  },
};

export function createPackage() {
  return new Promise((resolve, reject) => {
    writeFile(
      path.resolve(projRoot, 'dist/package.json'),
      JSON.stringify(pkg, null, 2),
      (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      }
    );
  });
}
