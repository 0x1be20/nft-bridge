require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers")
require('hardhat-deploy');

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

// If you are using MetaMask, be sure to change the chainId to 1337
module.exports = {
  solidity: "0.7.3",
  networks: {
    hardhat: {
      chainId: 31337
    }
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
};
