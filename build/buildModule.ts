import { rollup } from "rollup";
import resolvePlugin from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import commonjs from '@rollup/plugin-commonjs';
import { resolve } from "node:path";
import { projRoot, writeBundles } from "./utils";

export const buildModules = async () => {
  const bundle = await rollup({
    input: resolve(projRoot, './packages/drag/index.ts'),
    plugins: [
      esbuild({
        sourceMap: true,
        target: "es2015"
      }),
      resolvePlugin(),
      commonjs(),
    ],
    treeshake: false
  })

  await writeBundles(bundle, [
    {
      format: "esm",
      dir: resolve(projRoot, './dist/es'),
      preserveModules: true,
      sourcemap: true,
      entryFileNames: `[name].esm.js`,
    },
    {
      format: "cjs",
      dir: resolve(projRoot, './dist/lib'),
      exports: "named",
      preserveModules: true,
      sourcemap: true,
      entryFileNames: `[name].cjs.js`,
    },
  ]);
}
