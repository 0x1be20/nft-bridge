const ethers = require('ethers')
const fs = require('fs')
const {readdir} = require('fs/promises')
var argv = require('minimist')(process.argv.slice(2));

const source = argv['source']?argv['source']:'localhost'
const dist = argv['dist']?argv['dist']:'ganache'
const deployments = require("../frontend/src/contracts/hardhat_contracts.json")
const chains = require('../frontend/src/chains.json')
const uriContractAbi = require('../frontend/src/contracts/ERC721URIStorage.json')
console.log(chains)
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

function mnemonic() {
    let str = fs.readFileSync("../mnemonic.txt").toString().trim();
    return str
}
const mneStr = mnemonic()
let sourceSigner = new ethers.Wallet.fromMnemonic(mneStr)
let distSigner = new ethers.Wallet.fromMnemonic(mneStr)

const sourceProvider = new ethers.providers.JsonRpcProvider(chains[source].rpc)
sourceSigner = sourceSigner.connect(sourceProvider)
const sourceContracts = getContracts(deployments,sourceSigner,chains[source].chainId)

const distProvider = new ethers.providers.JsonRpcProvider(chains[dist].rpc)
distSigner = distSigner.connect(distProvider)
const distContracts = getContracts(deployments,distSigner,chains[dist].chainId)


sourceContracts.NftBridge.on('NftDeposit',async (nftAddr,tokenId,from,to)=>{
    console.log('event NftDeposit',nftAddr,tokenId,from,to)

    // 获取nft token的信息
    const uriContract = new ethers.Contract(nftAddr,uriContractAbi.abi,sourceSigner)
    const uri = await uriContract.tokenURI(tokenId)
    console.log('token uri',uri)
    // 在目标链上进行发放wnft
    const distTokenId = await distContracts.NftBridge.callStatic.mintItem(nftAddr,tokenId,to,uri)
    console.log('dist tokenid',distTokenId)
    const trans = await distContracts.NftBridge.mintItem(nftAddr,tokenId,to,uri)
    await trans.wait()
})

sourceContracts.NftBridge.on("NftCollectionCreate",async (sourceCollectionAddr,name,symbol)=>{
    console.log('event NftCollectionCreate',sourceCollectionAddr,name,symbol)
    // 创建目标链的nft合集
    // 检查目标链上的nft是否已经被创造出来
    const distAddr = await distContracts.NftBridge.getDistCollectionOnDist(sourceCollectionAddr)
    // 设置源链的目标链
    console.log(distAddr)
    console.log('owner',await distContracts.NftBridge.owner())
    if(distAddr==ethers.constants.AddressZero){

        // 在目标链上创建nft clone
        const distAddr = await distContracts.NftBridge.callStatic.createDistCollection(sourceCollectionAddr,name,symbol)
        console.log('distAddr',distAddr)
        const trans = await distContracts.NftBridge.createDistCollection(sourceCollectionAddr,name,symbol)
        await trans.wait()

        // 在源链上保存结果
        const trans2 = await sourceContracts.NftBridge.setDistCollection(sourceCollectionAddr,distAddr)
        await trans2.wait()
        
        // 获得源链的结果
        const retAddr = await sourceContracts.NftBridge.getDistCollectionOnSource(sourceCollectionAddr)
        console.log("after set,retAddr",retAddr,'address should be ',distAddr)
    }
})