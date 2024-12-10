import { rollup } from 'rollup';
import { projRoot, writeBundles } from './utils';
import dts from 'rollup-plugin-dts';
import { resolve } from 'node:path';

export const buildDeclaration = async () => {
  const bundle = await rollup({
    input: resolve(projRoot, './packages/drag/index.ts'),
    plugins: [
      dts({
        tsconfig: resolve(projRoot, './packages/tsconfig.build.json'),
      }),
    ],
  });

  await writeBundles(bundle, [
    {
      format: 'esm',
      dir: resolve(projRoot, './dist/types'),
      sourcemap: false,
    },
  ]);
};
