/* eslint-disable unicorn/prefer-module */
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
// eslint-disable-next-line node/no-unpublished-import
import { glob, runTypeChain } from 'typechain';

import { compiledContract } from './compile';

const abiFolderPath = path.resolve(__dirname, '../', 'abi');

const abiFilePath = path.resolve(abiFolderPath, 'dai.json');

// create abi directory if not exist
if (!existsSync(abiFolderPath)) {
  mkdirSync(abiFolderPath, {
    recursive: true,
  });
}

// write compiledContract as JSON in dai.json file inside abi directory
writeFileSync(abiFilePath, JSON.stringify(compiledContract).toString());

//* Typechain
async function main() {
  const outDirectory = path.resolve(__dirname, '../', 'generatedTypes');

  // create typechain directory if not exist
  if (!existsSync(outDirectory)) {
    mkdirSync(outDirectory, {
      recursive: true,
    });
  }

  const cwd = process.cwd();
  // find all files matching the glob
  // const allFiles = glob(cwd, [`${config.paths.artifacts}/!(build-info)/**/+([a-zA-Z0-9_]).json`])
  const allFiles = glob(cwd, [abiFilePath]);

  const result = await runTypeChain({
    cwd,
    filesToProcess: allFiles,
    allFiles,
    outDir: outDirectory,
    target: 'web3-v1',
  });
}

main().catch(console.error);
