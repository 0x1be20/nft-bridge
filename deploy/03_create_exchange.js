const {ethers} = require("hardhat")

module.exports = async({getNamedAccounts,deployments,getChainId})=>{
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts()

    const factory = await ethers.getContract("Factory",deployer);    
    const token = await ethers.getContract("Token",deployer);
    let exAddr = await factory.getExchange(token.address);
    console.log(exAddr,"exchange address")
    if(exAddr==ethers.constants.AddressZero){
        await factory.createExchange(token.address);
    }
}

module.exports.tags = ["Factory"];