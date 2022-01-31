/* eslint-disable unicorn/prefer-module */
import fs from 'fs-extra';
import path from 'path';
// eslint-disable-next-line node/no-unpublished-import
import { glob, runTypeChain } from 'typechain';

//* Typechain
async function main() {
  const compiledContractPath = path.resolve(__dirname, '../', 'build');

  const outDirectory = path.resolve(__dirname, '../', 'generatedTypes');
  // Delete the current build folder.
  fs.removeSync(outDirectory);

  // Create the build folder.
  fs.ensureDirSync(outDirectory);

  const cwd = process.cwd();
  // find all files matching the glob
  // const allFiles = glob(cwd, [`${config.paths.artifacts}/!(build-info)/**/+([a-zA-Z0-9_]).json`])
  const allFiles = glob(cwd, [`${compiledContractPath}/*([a-zA-Z0-9_]).json`]);

  const result = await runTypeChain({
    cwd,
    filesToProcess: allFiles,
    allFiles,
    outDir: outDirectory,
    target: 'web3-v1',
  });
}

main().catch(console.error);
