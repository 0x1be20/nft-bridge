import React from "react";
import { Menu,Layout,Tabs } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { PageHeader, Tag, Button, Statistic, Descriptions, Row } from 'antd';
import { Card, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';

import MyNft from './MyNft'
import Mint from './Mint'
import Cross from './Cross'
import Info from './Info'

import ImportModal from "../components/ImportModal";
import request from '../utils'
import { useState } from "react";
import { useEffect } from "react";

const { Meta } = Card;
const { Header, Content, Footer, Sider } = Layout;
const { TabPane } = Tabs;

const IERC721Enumerable = require("../contracts/IERC721Enumerable.json") 
const IERC721 = require("../contracts/IERC721.json")
const IERC721URI = require("../contracts/ERC721URIStorage.json")
const IERCMeta = require("../contracts/IERC721Metadata.json")

const Dex = props=>{

    const [importModalShow,setImportModalShow] = useState(false)
    const [nfts,setNfts] = useState([])
    const [owner,setOwner] = useState()
    const [chainid,setChainid] = useState(0)
    useEffect(()=>{
        async function loadMyNft(){
            let signer = await props.provider.getSigner()
            let chainid = (await props.provider.getNetwork())['chainId']
            let address = await signer.getAddress()
            let items = await request.get(`/api/address/${address}/items`,{chainid:chainid})
            console.log('collections of address',items,chainid,await props.provider.getNetwork())

            // 检查所有的nft是否所有人正确
            let nfts = {}
            for(let item of items.data){
                let ownerOk = await checkOwner(item.collection.address,item.tokenid,address)

                if(!nfts[item.collection.address]){
                    if(ownerOk){
                        nfts[item.collection.address] = [{'meta':JSON.parse(item.meta),'owner':address,'tokenid':item.tokenid,'chainid':chainid}]
                    }else{
                        nfts[item.collection.address] = []
                    }
                }else{
                    if(ownerOk){
                        nfts[item.collection.address].push({'meta':JSON.parse(item.meta),'owner':address,'tokenid':item.tokenid,'chainid':chainid})
                    }
                }
            }

            for(let nftAddr in nfts){
                await request.post(`/collections/${nftAddr}/items`,{items:JSON.stringify(nfts[nftAddr]),owner:address,chainid:chainid})
            }
            items = await request.get(`/api/address/${address}/items`,{chainid:chainid})

            setNfts(items.data)
            setOwner(address)
            setChainid(chainid)
        }

        loadMyNft()
    },[props.contracts,props.provider])

    async function parseMeta(nftAddr,index){
        const contract = new ethers.Contract(nftAddr,IERC721URI.abi,props.provider)
        const uri = await contract.tokenURI(index)
        console.log(uri,'uri')
        const result = await request.get(uri)
        console.log(uri,'uri',result)
        return result
    }

    async function checkOwner(nftAddr,index,owner){
        const contract = new ethers.Contract(nftAddr,IERC721.abi,props.provider)
        let _owner = await contract.ownerOf(index)
        console.log("NFT owner",nftAddr,index,_owner,owner)
        return _owner==owner
    }

    async function loadNft(nftAddr){
        const contract = new ethers.Contract(nftAddr,IERC721Enumerable.abi,props.provider)
        const metaContract = new ethers.Contract(nftAddr,IERCMeta.abi,props.provider)
        const result = await contract.totalSupply()

        const name = await metaContract.name()
        const symbol = await metaContract.symbol()
        let signer = await props.provider.getSigner()
        let chainid = (await props.provider.getNetwork())['chainId']
        setChainid(chainid)
        let address = await signer.getAddress()
        await request.post(`/collections/${nftAddr}`,{'name':name,'address':nftAddr,'symbol':symbol,'chainid':chainid})
        console.log('result',result)
       
        let nfts = []
        for(let i=ethers.BigNumber.from(1);result.gte(i);i=i.add(ethers.BigNumber.from(1))){
            let owner = await contract.ownerOf(i)
            if(owner.toLowerCase()==address.toLowerCase()){
               let meta = await parseMeta(nftAddr,i)
               console.log('meta',meta)
               nfts.push({
                   meta,
                   'owner':address,
                   'tokenid':i.toString(),
                   'chainid':chainid
                })
            }
        }
        console.log("load nft totalsupply",result,nfts )
        return nfts
    }

    return (
        <div>
            <PageHeader
                className="site-page-header"
                onBack={() => window.history.back()}
                backIcon={false}
                title="NFT Bridge"
                subTitle="Hold your NFTs on every blockchain"
                extra={[
                    <Button key="2" onClick={()=>setImportModalShow(true)}>Listing</Button>,
                    // <Button key="3">连接钱包</Button>,
                ]}/>
            <div style={{padding:"0 30px"}}>
                <Tabs defaultActiveKey="0">
                    <TabPane tab="介绍" key="0">
                        <Info/>
                    </TabPane>
                    <TabPane tab="我的NFT" key="1">
                        <MyNft nfts={nfts}/>
                    </TabPane>
                    {/* <TabPane tab="市场" key="2">
                    Content of Tab Pane 2
                    </TabPane> */}
                    <TabPane tab="Mint" key="3">
                        <Mint contracts={props.contracts} provider={props.provider}/>
                    </TabPane>
                    <TabPane tab="跨链" key="4">
                        <Cross contracts={props.contracts} provider={props.provider} nfts={nfts}/>
                    </TabPane>
                </Tabs>
            </div>
            <ImportModal 
                chainid={chainid}
                show={importModalShow} 
                owner={owner}
                onOk={()=>setImportModalShow(false)}
                onCancel={()=>setImportModalShow(false)}
                loadNft={loadNft}
            />
        </div>
        
        )
}
export default Dex;