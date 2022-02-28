const {ethers} = require("hardhat")
// const {create} = require('ipfs-http-client')

// const ipfs = create("https://infura-ipfs.io:5001")

module.exports = async({getNamedAccounts,deployments,getChainId})=>{
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts()
    const dist = "0x9e52e12Ac3F2D0AE08BB1108CCb761B80Cd24728";

    await deploy("Nft",{
        from:deployer,
        args:["Nft1","NFT1"],
        log:true,
    });

    const nft1 = await ethers.getContract("Nft",deployer);
    
    // const item1 = {
    //     "name": "NFT item1",
    //     "description": "NFT item1",
    //     "external_url": "https://michaelliao.github.io/simple-nft/",
    //     "image": "https://infura-ipfs.io/ipfs/QmaCR37BEGv6aZzzfJ1ShT8tu52UWosVgN9ookYY94FVVt?filename=file.png",
    //     "attributes": [
    //         {
    //             "trait_type": "Type",
    //             "value": "EIP-1155"
    //         },
    //         {
    //             "trait_type": "Author",
    //             "value": "Crypto Michael"
    //         }
    //     ]
    // }

    // const uploaded = await ipfs.add(JSON.stringify(item1))
    // console.log("ipfs path",uploaded.path)
    // await nft1.mintItem(dist,uploaded.path,{
    //     gasLimit:400000,
    // });
}

module.exports.tags = ["Nft"];