import { copyFile } from 'fs/promises';
import { resolve } from 'node:path';

import { projRoot } from './utils';

export async function copyFiles() {
  await copyFile(
    resolve(projRoot, './README.md'),
    resolve(projRoot, './dist/README.md')
  );
}
