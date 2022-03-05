const {ethers} = require("hardhat")

module.exports = async({getNamedAccounts,deployments,getChainId})=>{
    // const {deploy} = deployments;
    // const {deployer} = await getNamedAccounts()

    // await deploy("Factory",{
    //     from:deployer,
    //     args:[],
    //     log:true,
    // });

    // const factory = await ethers.getContract("Factory",deployer);    
}

module.exports.tags = ["Factory"];