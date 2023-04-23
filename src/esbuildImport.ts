import { build } from "esbuild";
import fs from "fs";
import os from "os";
import path from "path";
import { createRequire } from "module";

async function esbuildImport(filePath: string) {
  const outfilePath = path.join(
    os.tmpdir(),
    `${path.basename(filePath, path.extname(filePath))}.js`
  );

  await build({
    entryPoints: [filePath],
    outfile: outfilePath,
    platform: "node",
    format: "cjs",
    bundle: true,
    target: "es2017",
  });

  const importedModule = require(outfilePath);
  fs.unlinkSync(outfilePath);

  return importedModule.default || importedModule;
}

export { esbuildImport };
