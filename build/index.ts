import { buildModules } from "./buildModule";
import { buildDeclaration } from "./buildDeclaration"

async function build() {
  await buildModules();
  await buildDeclaration();
}
build()