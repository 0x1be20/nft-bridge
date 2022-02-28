const {ethers} = require("hardhat");

const toWei = (eth)=>ethers.utils.parseEther(""+eth)

module.exports = async({getNamedAccounts,deployments,getChainId})=>{
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const [signer,addr1] = await ethers.getSigners()
    const dist = "0x9e52e12Ac3F2D0AE08BB1108CCb761B80Cd24728";
    await deploy("Token",{
        from:deployer,
        args:["Token","TNK",ethers.utils.parseEther("1000")]
    })
    const token = await ethers.getContract("Token",deployer);
    await token.approve(deployer,toWei(100))
    await token.transferFrom(deployer,dist,toWei(50));

    const tx = await signer.sendTransaction({
        to:dist,
        value:toWei(1),
    })
    await tx.wait()

    const balance = await signer.getBalance()
    console.log(deployer,signer.address,'balance',ethers.utils.formatEther(balance))
};
module.exports.tags = ['Token'];