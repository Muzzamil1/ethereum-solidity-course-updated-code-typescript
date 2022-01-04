import HDWalletProvider from '@truffle/hdwallet-provider';
import { compiledContract } from 'scripts/compile';
import { config } from 'scripts/config';
import Web3 from 'web3';

import { Dai } from '../generatedTypes/dai';

const { abi, evm, } = compiledContract;
const mnemonicPhrase = config.accountMnemonic;
const network = config.rinkebyEndpoint;

if (!mnemonicPhrase || !network)
  throw new Error(
    'Please make sure ACCOUNT_MNEMONIC and RINKEBY_ENDPOINT are provided '
  );

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonicPhrase,
  },
  providerOrUrl: network,
});

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);

  const result = (await new web3.eth.Contract(abi)
    .deploy({
      data: '0x' + evm.bytecode.object,
    })
    .send({ from: accounts[0], })) as unknown as Dai;

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};

deploy();
