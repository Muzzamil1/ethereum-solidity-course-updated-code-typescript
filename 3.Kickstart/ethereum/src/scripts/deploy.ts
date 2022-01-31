import HDWalletProvider from '@truffle/hdwallet-provider';
import { config } from 'scripts/config';
import Web3 from 'web3';

import compiledFactory from '../build/CampaignFactory.json';
import { CampaignFactory as TCampaignFactory } from '../generatedTypes/CampaignFactory';

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

  const result = (await new web3.eth.Contract(compiledFactory.abi as any)
    .deploy({ data: '0x' + compiledFactory.evm.bytecode.object, })
    .send({ from: accounts[0], })) as unknown as TCampaignFactory;

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};

deploy();

