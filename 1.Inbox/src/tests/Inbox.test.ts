/* eslint-disable no-undef */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable @typescript-eslint/no-var-requires */
import assert from 'assert';
import { compiledContract } from 'scripts/compile';
import Web3 from 'web3';

import { Dai } from '../typechain/dai';
// eslint-disable-next-line node/no-extraneous-import
// import { Contract } from 'web3-eth-contract';

;
// types are not available --> https://stackoverflow.com/a/42505940
const ganache = require('ganache-cli');

const { abi, evm, } = compiledContract;

const provider = ganache.provider();
const web3 = new Web3(provider);

const message = 'Hi there!';
let accounts: string[];
// let inbox: Contract;
let inbox: Dai;

beforeEach(async () => {
  // Get a list of all accounts.
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract.
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: '0x' + evm.bytecode.object,
      arguments: [message],
    })
    .send({
      from: accounts[0],
      gas: 1_000_000,
    }) as unknown as Dai;

});

describe('Inbox', () => {
  //* Run this in all projects to make sure contract has been deployed successful
  it('deploys a contract', () => {
    // inbox.options.address -->     Give address where the contract is deployed
    // assert.ok             -->     Make sure that the value we are providing is exists   

    // Test will fail is inbox.options.address is undefined 
    // assert.ok(inbox.options.address);
    assert.ok(inbox.options.address);
  });
  //* ---------------------------------------------

  it('has a default message', async () => {
    // Gas will not be used as we are just reading the data from our contract
    const message_ = await inbox.methods.message().call();
    assert.strictEqual(message_, message);
  });

  it('can change the message', async () => {
    const newMessage = 'bye';
    // Gas will be used as we are changing data in our contract
    await inbox.methods.setMessage(newMessage).send({ from: accounts[0], });

    // Gas will not be used as we are just reading the data from our contract
    const message_ = await inbox.methods.message().call();
    assert.strictEqual(message_, newMessage);
  });
});