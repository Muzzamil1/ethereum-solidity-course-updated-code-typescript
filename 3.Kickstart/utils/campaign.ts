import Campaign from './ethereum/build/Campaign.json';
import { Campaign as TCampaign } from './ethereum/generatedTypes/Campaign';

import web3 from './web3';

const campaignContract = (address: string) => {
  const abi = Campaign.abi;

  return new web3.eth.Contract(abi as any, address) as unknown as TCampaign;
};

export default campaignContract;
