require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers")
require('hardhat-deploy');
const { readdir }=require('fs/promises');

const fs = require("fs");


// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

const defaultNetwork = "localhost";

function mnemonic() {
  try {
    return fs.readFileSync("./mnemonic.txt").toString().trim();
  } catch (e) {
    if (defaultNetwork !== "localhost") {
      console.log(
        "☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`."
      );
    }
  }
  return "";
}

// If you are using MetaMask, be sure to change the chainId to 1337
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  ovm: {
    solcVersion: "0.7.6",
  },
  networks: {
    localhost: {
      chainId: 31337,
      url:'http://localhost:8545',
      accounts:{
        mnemonic:mnemonic()
      }
    },
    ganache:{
      chainId:1337,
      url:"http://localhost:7545",
      accounts:{
        mnemonic:mnemonic()
      }
    },
    ftmtest:{
      url:'https://xapi.testnet.fantom.network/lachesis',
      chainId:4002,
      accounts:{
        mnemonic:mnemonic()
      }
    },
    bsctest:{
      url:"https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId:97,
      accounts:{
        mnemonic:mnemonic()
      }
    }
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
};

task("copy", "copy compiled contracts to frontend dir")
  .setAction(async (taskArgs) => {

    try {
      const baseDir = "artifacts/contracts";
      const files = await readdir(baseDir);
      for (const file of files){
        const name = file.split(".sol",2)[0]
        const contracts = await readdir(baseDir+"/"+file)
        for (const contract of contracts){
          if(contract==`${name}.json`){
            fs.copyFileSync(`${baseDir}/${file}/${name}.json`,`frontend/src/contracts/${name}.json`)
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  });