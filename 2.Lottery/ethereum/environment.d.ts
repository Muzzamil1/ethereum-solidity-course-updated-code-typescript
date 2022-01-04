//install @types.node
//create environment.d.ts in root directory
declare global {
  namespace NodeJS {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    interface ProcessEnv {
      NODE_ENV: 'development' | 'test' | 'production';
      ACCOUNT_MNEMONIC: string | undefined;
      RINKEBY_ENDPOINT: string | undefined;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { };