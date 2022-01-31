/* eslint-disable security/detect-object-injection */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs-extra';
import path from 'path';

// types are not available --> https://stackoverflow.com/a/42505940
const solc = require('solc');

const buildPath = path.resolve(__dirname, '../', 'build');
const contractFileName = 'Campaign.sol';

// Delete the current build folder.
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, '../', 'contracts', contractFileName);
// If you are sure that no user input can reach your fs method calls, you should disable the rule for the offending line with :
/* eslint-disable-next-line security/detect-non-literal-fs-filename -- Safe as no value holds user input */
const source = fs.readFileSync(campaignPath, 'utf8');

/***
 * The recommended way to interface with the Solidity compiler, especially for more
 * complex and automated setups is the so-called JSON-input-output interface.
 *
 * See https://docs.soliditylang.org/en/v0.8.5/using-the-compiler.html#compiler-input-and-output-json-description
 * for more details.
 */
const input = {
  language: 'Solidity',
  sources: {
    // Each Solidity source file to be compiled must be specified by defining either
    // a URL to the file or the literal file content.
    // See https://docs.soliditylang.org/en/v0.8.5/using-the-compiler.html#input-description

    [contractFileName]: {
      content: source,
    },
  },
  settings: {
    metadata: {
      useLiteralContent: true,
    },
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
// console.log(JSON.stringify(output, undefined, 4));
const contracts = output.contracts[contractFileName];
// Create the build folder.
fs.ensureDirSync(buildPath);

// Extract and write the JSON representations of the contracts to the build folder.
for (const contract in contracts) {
  // eslint-disable-next-line no-prototype-builtins
  if (contracts.hasOwnProperty(contract)) {
    fs.outputJsonSync(path.resolve(buildPath, `${contract}.json`), contracts[contract]);
  }
}

