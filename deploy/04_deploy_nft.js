const {ethers} = require("hardhat")
// const {create} = require('ipfs-http-client')
// const ipfsClient = require('ipfs-http-client')

// connect to ipfs daemon API server
// const ipfs = ipfsClient('https://infura-ipfs.io:5001') // (the default in Node.js)
// const ipfs = create("https://infura-ipfs.io:5001")

module.exports = async({getNamedAccounts,deployments,getChainId})=>{
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts()
    const dist = "0x9e52e12Ac3F2D0AE08BB1108CCb761B80Cd24728";

    await deploy("NftFactory",{
        from:deployer,
        args:[],
        log:true,
    });

    const nftFactory = await ethers.getContract("NftFactory",deployer);
    // await nft1.setBaseURI(`http://127.0.0.1:7001/collections/${nft1.address}/items/`)
    
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

    // const file = (ipfs.add(JSON.stringify(item1)))

    // console.log('arr',await file[0])
    // const uploaded = await ipfs.add(JSON.stringify(item1))
    // console.log("ipfs path",uploaded)
    // await nft1.mintItem(dist,"1",{
    //     gasLimit:400000,
    // });
}

module.exports.tags = ["NftFactory"];