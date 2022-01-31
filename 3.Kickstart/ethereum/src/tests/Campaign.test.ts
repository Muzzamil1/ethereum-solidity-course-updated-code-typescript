/* eslint-disable no-undef */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable @typescript-eslint/no-var-requires */
import assert from 'assert';
import Web3 from 'web3';

import compiledCampaign from '../build/Campaign.json';
import compiledFactory from '../build/CampaignFactory.json';
import { Campaign as TCampaign } from '../generatedTypes/Campaign';
import { CampaignFactory as TCampaignFactory } from '../generatedTypes/CampaignFactory';

// types are not available --> https://stackoverflow.com/a/42505940
const ganache = require('ganache-cli');

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts: string[];
let factory: TCampaignFactory;
let campaignAddress;
let campaign: TCampaign;

beforeEach(async () => {
  // Get a list of all accounts.
  accounts = await web3.eth.getAccounts();

  /***
   * NOTE: In the Udemy course code for this test file, the instructor sets
   * gas to a value of 1000000 (1 million). That does not work here. My tests
   * result in a 'VM Exception while processing transaction: out of gas'
   * being generated when using that value.
   *
   * However, when I set gas to 1500000 (1.5 million) the tests passed.
   */

  // Use one of those accounts to deploy the contract.
  factory = (await new web3.eth.Contract(compiledFactory.abi as any)
    .deploy({ data: '0x' + compiledFactory.evm.bytecode.object, })
    .send({
      from: accounts[0],
      gas: 1_500_000,
    })) as unknown as TCampaignFactory;

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: 1_500_000,
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(compiledCampaign.abi as any, campaignAddress) as unknown as TCampaign;;
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(manager, accounts[0]);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1],
    });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '5',
        from: accounts[1],
      });

      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods.createRequest('Buy batteries', '100', accounts[1]).send({
      from: accounts[0],
      gas: 1_500_000,
    });

    const request = await campaign.methods.requests(0).call();
    assert('Buy batteries', request.description);
  });

  it('processes requests', async () => {
    // Let accounts[1] contribute 10 ether to the campaign.
    await campaign.methods.contribute().send({
      value: web3.utils.toWei('10', 'ether'),
      from: accounts[1],
    });

    // Create a spend request for 5 ether to go to accounts[2].
    await campaign.methods
      .createRequest('A cool spend request', web3.utils.toWei('5', 'ether'), accounts[2])
      .send({
        from: accounts[0],
        gas: 1_500_000,
      });

    // Approve the spend request.
    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
      gas: 1_500_000,
    });

    // Finalize the request.
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: 1_500_000,
    });

    let balance = await web3.eth.getBalance(accounts[2]);
    balance = web3.utils.fromWei(balance, 'ether');
    const totalBalance = Number.parseFloat(balance);
    assert(totalBalance > 104);
  });
});
