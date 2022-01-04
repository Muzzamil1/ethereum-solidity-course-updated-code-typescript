import Web3 from 'web3';

import { Dai } from '../generatedTypes/dai';

export async function enterPlayerInLottery(
  lotteryContract: Dai,
  playerAddress: string,
  web3Instance: Web3,
  etherAmount: string
) {
  await lotteryContract.methods.enter().send({
    from: playerAddress,
    value: etherAmount ? web3Instance.utils.toWei(etherAmount, 'ether') : 0,
  });
}

