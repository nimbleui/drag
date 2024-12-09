import { buildModules } from "./buildModule";
import { buildDeclaration } from "./buildDeclaration"
import { buildFullBundle } from "./buildFullBundle"
import { createPackage } from "./createPackage"
import { copyFiles } from "./copyFiles"

async function build() {
  await buildDeclaration();
  await buildModules();
  await buildFullBundle();
  await createPackage();
  await copyFiles();
}
build()