import React from 'react'
import {Row,Col,Card,Avatar,Select, Space, Button, Spin, message,Result} from 'antd'
import { InteractionOutlined,SmileOutlined } from '@ant-design/icons';

import { useEffect } from 'react'
import { useState } from 'react'
import chains from '../chains.json'
import {ethers} from 'ethers';

const IERC721 = require('../contracts/IERC721.json')

const { Meta } = Card;
const { Option } = Select;


const Cross = props=>{

    const [nfts,setNfts] = useState([])
    const [selectedNft,setSelectedNft] = useState(0)
    const [selectedChain,setSelectedChain] = useState(0)
    const [needCreateDist,setNeedCreateDist] = useState(false)
    const [loading,setLoading] = useState(false)
    const [distAddr,setDistAddr] = useState()

    useEffect(()=>{
        setNfts(props.nfts)
        async function c(){
            await checkDist(selectedNft)
        }
        c()
    },[props.nfts,selectedNft,selectedChain])

    const opts = nfts&&nfts.map((item,index)=>{
        const meta = JSON.parse(item.meta)
        return <Option key={item.id} value={index}>{meta.name}/{item.collection.name}</Option>
    })

    async function transfer(){
        const signer = await props.provider.getSigner()
        const address = await signer.getAddress()
        const nft = new ethers.Contract(nfts[selectedNft].collection.address,IERC721.abi,signer)
        console.log('tokenid',nfts[selectedNft].tokenid,selectedNft,nfts)
        await nft.approve(props.contracts.NftBridge.address,nfts[selectedNft].tokenid)
        await props.contracts.NftBridge.deposit(nfts[selectedNft].collection.address,nfts[selectedNft].tokenid,address)
    }

    async function checkDist(index){
        if(props.contracts && nfts[index]){
            const dist = await props.contracts.NftBridge.getDistCollectionOnSource(nfts[index].collection.address)
            if(dist==ethers.constants.AddressZero){
                setNeedCreateDist(true)
            }else{
                message.success(`wNFT address ${dist}`)
                setNeedCreateDist(false)
            }
        }
        
    }

    async function createDist(){
        await props.contracts.NftBridge.createCollection(nfts[selectedNft].collection.address)
        setLoading(true)
        // 执行循环
        const repeatCheck = setInterval(async()=>{
            if(props.contracts && nfts[selectedNft]){
                const dist = await props.contracts.NftBridge.getDistCollectionOnSource(nfts[selectedNft].collection.address)
                if(dist==ethers.constants.AddressZero){
                    setNeedCreateDist(true)
                }else{
                    setLoading(false)
                    setNeedCreateDist(false)
                    setDistAddr(dist)
                    message.success(`Dist Address ${dist}`)
                    clearInterval(repeatCheck)
                }
            }
        },1000)
    }

    let card =""
    if(nfts&&nfts.length>0){
        const meta = JSON.parse(nfts[selectedNft].meta)
        card=(
            <Card
                    style={{ width: 300 }}
                    cover={
                        <img
                        alt="example"
                        src={meta.image}
                        style={{objectFit:'cover',height:'250px'}}
                        />
                    }
                    
                    >
                    <Meta
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                        title={meta.name}
                        description={meta.description}
                    />
                </Card>
        )
    }else{

    }

    let chainOpts = []
    for(let i in chains){
        chainOpts.push(<Option value={chains[i].chainId}>{chains[i].name}</Option>)
    }

    return (
        <Spin spinning={loading} tip={"正在加载中..."}>
            {opts.length?( <Row>
            <Col span={24}>
            <Row gutter={16}justify="center" align="middle">
            <Col span={10} style={{"textAlign":'right'}}>
                <Row justify='end'>
                    {card}
                </Row>
                <Row justify='end' style={{marginTop:"20px"}}>
                <Select defaultValue={0} style={{width:300}} onChange={async value=>{setSelectedNft(value);await checkDist(value)}}>
                    {opts}
                </Select>
                </Row>
            </Col>
            <Col span={4} style={{"textAlign":"center"}}>
            <InteractionOutlined style={{fontSize:"80px"}}/>
            </Col>
            <Col span={10} style={{"textAlign":"left"}}>

                <Row justify='left'>
                {card}
                </Row>
                <Row justify='left' style={{marginTop:"20px"}}>
                    <Select style={{width:300}} onChange={value=>setSelectedChain(value)}>
                        {chainOpts}
                    </Select>
                </Row>
            </Col>
        </Row>
        <Row justify='center' style={{marginTop:"20px"}}>
            {needCreateDist?(<Button type='primary' size='large' onClick={async ()=>{await createDist()}}>创建目标链合集</Button>):(<Button type='primary' size='large' onClick={()=>transfer()}>转换</Button>)}
        </Row>
            </Col>
        </Row>):( <Row><Col span={24}style={{alignItems:"center"}}>
            <Result
            icon={<SmileOutlined />}
            title="目前还没持有NFT，可以导入或者Mint新NFT!"
            // extra={<Button type="primary">Next</Button>}
          /></Col></Row>)}
       
        </Spin>
    )
    
}

export default Cross