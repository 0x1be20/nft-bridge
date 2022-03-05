import React from "react";
import { useCallback, useEffect, useState } from 'react';
import 'antd/dist/antd.css'
import {DatePicker} from 'antd'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";

import Dex from '../pages/Dex';

const deployments = require("../contracts/hardhat_contracts.json")

// This is the Hardhat Network id, you might change it in the hardhat.config.js.
// If you are using MetaMask, be sure to change the Network id to 1337.
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = '31337';

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;


function getContracts(deployments,signer,chainId){
  let contracts = {}
  if(!deployments[chainId]){
    return contracts
  }
  const configs = deployments[chainId][0]
  for(let i in configs['contracts']){
    contracts[i] = new ethers.Contract(configs['contracts'][i]['address'],configs['contracts'][i]['abi'],signer)
  }
  return contracts
}

export class Dapp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress:undefined,
      networkError:undefined,
    }
    this.deployments = deployments
  }

  async componentDidMount(){
    if(!this.state.selectedAddress){
      await this._connectWallet()
    }
  }

  render() {

    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }
   
    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet 
          connectWallet={() => this._connectWallet()} 
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dex contracts={this.state.contracts} provider={this.state.provider}/>} ></Route>
        </Routes>
      </BrowserRouter>
    )
  }

  componentWillUnmount() {
    this._stopPollingData();
  }

  async _connectWallet() {
 
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);

    const network = await provider.getNetwork()
    const signer = provider.getSigner();

    const selectedAddress = await signer.getAddress()
    this.setState({'provider':provider,'chainId':network['chainId'],'signer':signer})

    // First we check the network
    if (!this._checkNetwork()) {
      return;
    }

    const c = getContracts(this.deployments,signer,network['chainId'])
    this.setState({'contracts':c})
    console.log("selected address",selectedAddress)
    await this._initialize(selectedAddress,provider);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", async ([newAddress]) => {
      console.log("account changed")
      this._stopPollingData();
      
      await this._initialize(newAddress,this.state.provider);
    });
    
    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", async ([networkId]) => {
      console.log("chain changed")
      this._stopPollingData();

      this._provider = new ethers.providers.Web3Provider(window.ethereum)
      this.setState({'provider':this._provider})
      await this._initialize(this.state.selectedAddress,this._provider)
    });
  }

  async _initialize(userAddress,provider) {
    this.setState({
      selectedAddress: userAddress,
    });

    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = await provider.getSigner()
    const network = await provider.getNetwork()
    const c = getContracts(this.deployments,signer,network['chainId'])
    this.setState({'contracts':c})

    this._startPollingData();
  }



  _startPollingData() {
    this._pollDataInterval = setInterval(() => {}, 1000);
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }


  // This method checks if Metamask selected network is Localhost:8545 
  _checkNetwork() {
    return true
  }
}
