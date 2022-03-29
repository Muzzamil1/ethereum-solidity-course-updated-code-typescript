import { config } from 'config';
import Web3 from 'web3';

let web3: Web3;

if (
  typeof window !== 'undefined' &&
  (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined')
) {
  // We are in the browser and MetaMask is running.
  /**
   * MetaMask provides the Ethereum Provider API (window.ethereum) for developers
   * to work with. Note that it's window.web3 API will be deprecated in the near future
   * in favor of the window.ethereum API.
   *
   * See https://metamask.github.io/metamask-docs/API_Reference/Ethereum_Provider
   * for more details on the Ethereum Provider API.
   */
  if (typeof window.ethereum !== 'undefined') {
    // Ethereum user detected. Let's use the injected provider.
    web3 = new Web3(window.ethereum);

    if (typeof window.ethereum.autoRefreshOnNetworkChange !== 'undefined') {
      window.ethereum.autoRefreshOnNetworkChange = false;
    }

    window.ethereum.on('chainChanged', () => {
      document.location.reload();
    });

    // Request approval from the user to use an ethereum address they can be identified by.
    window.ethereum
      .enable()
      .then((_accounts: any) => {
        // no need to do anything here
      })
      .catch(function (error: any) {
        // Handle error. Likely the user rejected the login.
        console.error(error);

        alert(
          'Sorry, this application requires user approval to function correctly.'
        );
      });

    web3.eth.net.getNetworkType().then((networkInformation: string) => {
      if (networkInformation !== 'rinkeby') alert('Please connect to rinkeby network');
    });
  } else {
    web3 = new Web3(window.web3.currentProvider);
  }
} else {
  // We are on the server OR MetaMask is not running.
  const { providerUrl, } = config;

  if (!providerUrl) throw new Error('Please provide a provider url');

  const provider = new Web3.providers.HttpProvider(providerUrl);

  web3 = new Web3(provider);
}

export default web3;

