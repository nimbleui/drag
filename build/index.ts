import { buildModules } from "./buildModule";
import { buildDeclaration } from "./buildDeclaration"
import { buildFullBundle } from "./buildFullBundle"
import { createPackage } from "./createPackage"

async function build() {
  await buildDeclaration();
  await buildModules();
  await buildFullBundle();
  await createPackage();
}
build()