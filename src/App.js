import React, { Component } from 'react';
import './App.css';

import SetProtocol from 'setprotocol.js';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';

// Kovan configuration
const config = {
  coreAddress: '0xdd7d1deb82a64af0a6265951895faf48fc78ddfc',
  setTokenFactoryAddress: '0x7497d12488ee035f5d30ec716bbf41735554e3b1',
  transferProxyAddress: '0xa0929aba843ff1a1af4451e52d26f7dde3d40f82',
  vaultAddress: '0x76aae6f20658f763bd58f5af028f925e7c5319af',
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      setProtocol: null,
      web3: null,
      // Etherscan Links
      createdSetLink: '',
    };
    this.createSet = this.createSet.bind(this);
    this.getAccount = this.getAccount.bind(this);
  }

  componentDidMount() {
    if (!this.state.web3) {
        this.requestWeb3Access();
    }
  }

  async requestWeb3Access() {
    let setProtocol, injectedWeb3;
    if (window.ethereum) {
      try {
        injectedWeb3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } catch (err) {
          console.error(`Unable to access web3: ${err.message}`);
      }
    }
    else if (window.web3) {
      injectedWeb3 = window.web3;
    }
    if (injectedWeb3) {
      setProtocol = new SetProtocol(injectedWeb3.currentProvider, config);
      this.setState((prevState) => ({ web3: injectedWeb3, setProtocol }));
    } 
    else {
      console.error('Web3 provider not found.');
    }
  }

  async createSet() {
    const { setProtocol } = this.state;

    /**
      * Steps to create your own Set Token
      * ----------------------------------
      *
      * 1. Fund your MetaMask wallet with Kovan ETH: https://gitter.im/kovan-testnet/faucet
      * 2. Modify your Set details below to your liking
      * 3. Click `Create My Set`
      */
    const trueUsdAddress = '0xadb015d61f4beb2a712d237d9d4c5b75bafefd7b';
    const daiAddress = '0x1d82471142f0aeeec9fc375fc975629056c26cee';

    const componentAddresses = [trueUsdAddress, daiAddress];
    const componentUnits = [new BigNumber(5), new BigNumber(5)];
    const naturalUnit = new BigNumber(10);
    const name = 'My Set';
    const symbol = 'MS';
    const account = this.getAccount();
    const txOpts = {
      from: account,
      gas: 4000000,
      gasPrice: 8000000000,
    };

    const txHash = await setProtocol.createSetAsync(
      componentAddresses,
      componentUnits,
      naturalUnit,
      name,
      symbol,
      txOpts,
    );
    const setAddress = await setProtocol.getSetAddressFromCreateTxHashAsync(txHash);
    this.setState({ createdSetLink: `https://kovan.etherscan.io/address/${setAddress}` });
  }

  async issueSet() {
    /**
      * Steps to Issue your Set Token
      * -----------------------------
      *
      * 1. Get TestNet TrueUSD and Dai
      *   - Navigate to the links below:
      *     - TrueUSD: https://kovan.etherscan.io/address/0xadb015d61f4beb2a712d237d9d4c5b75bafefd7b#writeContract
      *     - Dai:     https://kovan.etherscan.io/address/0x1d82471142f0aeeec9fc375fc975629056c26cee#writeContract
      *   - Click `Connect with MetaMask` link in the `Write Contract` tab. Click `OK` in the modal that shows up.
      *   - In the `greedIsGood` function, put in:
      *     - _to: Your MetaMask address
      *     - _value: 100000000000000000000000
      *   - Click the `Write` button
      *   - Confirm your MetaMask transaction
      *   - You now have TestNet tokens for TrueUSD/Dai.
      *   - Be sure to repeat the process for the other remaining TrueUSD/Dai token.
      */

    // Tutorial Link: https://docs.setprotocol.com/tutorials#issuing-a-set
    // TODO: Insert your code here
  }

  getAccount() {
    const { web3 } = this.state;
    if (web3 && web3.eth.accounts[0]) return web3.eth.accounts[0];
    throw new Error('Unlock MetaMask or allow account access when prompted to continue.');
  }

  renderEtherScanLink(link, content) {
    return (
      <div className="App-button-container">
        <a target="_blank" rel="noopener" href={link}>
          {content}
        </a>
      </div>
    );
  }

  render() {
    const { createdSetLink } = this.state;
    return (
      <div className="App">
        <header>
          <h1 className="App-title">Set Boiler Plate</h1>
        </header>
        <div>
          <button onClick={this.createSet}>
            Create My Set
          </button>
          { createdSetLink ? this.renderEtherScanLink(createdSetLink, 'Link to your new Set') : null }
        </div>
        <div>
          <button className="button-disabled" disabled>
            Issue My Set Tokens
          </button>
        </div>
      </div>
    );
  }
}

export default App;
