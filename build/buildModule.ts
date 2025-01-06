import { rollup } from 'rollup';
import resolvePlugin from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import { resolve } from 'node:path';
import { projRoot, writeBundles } from './utils';

export const buildModules = async () => {
  const bundle = await rollup({
    input: resolve(projRoot, './packages/drag/index.ts'),
    plugins: [
      esbuild({
        sourceMap: false,
        target: 'es2015',
      }),
      resolvePlugin(),
      commonjs(),
    ],
    treeshake: false,
    external: ["@nimble-ui/move", "move"]
  });

  await writeBundles(bundle, [
    {
      format: 'esm',
      dir: resolve(projRoot, './dist'),
      preserveModules: false,
      sourcemap: false,
      entryFileNames: `index.esm.js`,
    },
    {
      format: 'cjs',
      dir: resolve(projRoot, './dist'),
      exports: 'named',
      preserveModules: false,
      sourcemap: false,
      entryFileNames: `index.cjs.js`,
    },
  ]);
};
