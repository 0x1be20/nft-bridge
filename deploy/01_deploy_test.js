const {ethers} = require("hardhat")

module.exports = async({getNamedAccounts,deployments,getChainId})=>{
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts()

    await deploy("Token",{
        from:deployer,
        args:[],
        log:true,
    });

    const factory = await ethers.getContract("Token",deployer);    
}

module.exports.tags = ["Token"];