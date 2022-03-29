import CampaignFactory from 'ethereum/src/build/CampaignFactory.json';
import { CampaignFactory as TCampaignFactory } from 'ethereum/src/generatedTypes/CampaignFactory';

import web3 from './web3';

const contractAddress = '0x166101353b985d887235CD3f7242CF1BD6955d66';
const abi = CampaignFactory.abi;
const instance = new web3.eth.Contract(abi as any, contractAddress) as unknown as TCampaignFactory;

export default instance;

