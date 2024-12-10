import { resolve } from 'node:path';
import type { OutputOptions, RollupBuild } from 'rollup';

export const projRoot = resolve(__dirname, '..', '..');

export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map((option) => bundle.write(option)));
}
