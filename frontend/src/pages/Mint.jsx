import React from 'react';
import { Card, Col, Row,Avatar,Steps,Space,Form,Input,Button,Checkbox, Spin,PageHeader,Descriptions } from 'antd';
import {
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Upload,
  Rate,
  Result,
} from 'antd'
import { EditOutlined, EllipsisOutlined,SettingOutlined } from '@ant-design/icons';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import request from '../utils'

const IERC721Enumerable = require("../contracts/IERC721Enumerable.json") 
const IERC721 = require("../contracts/IERC721.json")
const IERC721URI = require("../contracts/ERC721URIStorage.json")
const IERCMeta = require("../contracts/IERC721Metadata.json")
const NFTContract = require("../contracts/Nft.json")
const {useState} = React
const { Meta } = Card;
const {Step} = Steps


const Step1 = (props)=>{

    const [loading,setLoading] = useState(false)

    const importNft = async (values)=>{
        setLoading(true)
        const metaContract = new ethers.Contract(values['address'],IERCMeta.abi,props.provider)
        const name = await metaContract.name()
        const symbol = await metaContract.symbol()
        console.log('name',name,'symbol',symbol)
        setLoading(false)
        props.onFinish(values['address'],name,symbol)
    }

    const createNft = async (values)=>{
        console.log('values',values)
        const nftAddr = await props.contracts.NftFactory.callStatic.createNft(values['name'],values['symbol'])
        console.log('nftaddr',nftAddr)
        const trans = await props.contracts.NftFactory.createNft(values['name'],values['symbol'])
        setLoading(true)
        await trans.wait()
        setLoading(false)
        props.onFinish(nftAddr,values['name'],values['symbol'])
    }

    const [form1] = Form.useForm();
    const [form2] = Form.useForm();

    const [mode,setMode] = useState(1)
    return (<Spin spinning={loading}>
        {mode==1?(
            <Form
                form={form1}
                name="import"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}
                initialValues={{ remember: true }}
                  onFinish={importNft}
                //   onFinishFailed={onFinishFailed}
                autoComplete="off"
                >
                <Form.Item
                    label="合约地址"
                    name="address"
                    rules={[{ required: true, message: '请输入合约地址' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Space>
                    <Button type="primary" htmlType="submit">
                    下一步
                    </Button>
                    <Button type="text" onClick={()=>setMode(2)}>
                    创作新系列
                    </Button>
                    </Space>
                    
                </Form.Item>
            </Form>
        ):(
            <Form
                form={form2}
                name="create"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}
                initialValues={{ remember: true }}
                  onFinish={createNft}
                //   onFinishFailed={onFinishFailed}
                autoComplete="off"
                >
                <Form.Item
                    label="系列名称(name)"
                    name="name"
                    rules={[{ required: true, message: '请输入系列名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="系列标志(symbol)"
                    name="symbol"
                    rules={[{ required: true, message: '请输入系列标志' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Space>
                    <Button type="primary" htmlType="submit">
                    下一步
                    </Button>
                    <Button type="text" onClick={()=>setMode(1)}>
                    导入已有NFT
                    </Button>
                    </Space>
                </Form.Item>
            </Form>
        )}
        
    </Spin>)
}
const Step2 = (props)=>{
    const [config,setConfig] = useState({})
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
        async function loadConfig(){
            const result = await request.get('/api/upload/config')
            const config = result.data
            console.log(config)
            setConfig(config)
        }
        loadConfig()
    },[props.address])

    const handleUploadData = (file)=>{
        let hash = Math.random()
            .toString(36)
            .substr(0, 16)
        let key = hash+"/"+file.name
        console.log(key)
        console.log(file)
        file.key = key;
        file.url = config.cdn+'/'+key
        return {
            ...config,
            key,
            OSSAccessKeyId:config.ak
        };
    }

    const formItemLayout = {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 14,
        },
      };
    const normFile = (e) => {
        console.log('Upload event:', e);
        
        if (Array.isArray(e)) {
            return e;
        }
        
        return e && e.fileList;
    };

    const onFinish = async values=>{
        console.log('onfinish',values.upload[0].url)
        
        // 上传token的信息
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
        const item = {
            "name": values.name,
            "description": values.description,
            // "external_url": "https://michaelliao.github.io/simple-nft/",
            "image": values.upload[0].url,
            "attributes": []
        }
        var blob = new Blob([JSON.stringify(item, null, 2)], {type : 'application/json'});
        const file= new File([blob],'item.json')

        // const result = await request.get('/api/upload/config')
        // const config = result.data
        // setConfig(config)
        setLoading(true)
        const newConfig = handleUploadData(file)
        console.log(newConfig,'newConfig')
        await request.post(config.host,{
            ...newConfig,
            file:file
        },{'Content-Type':'multipart/form-data;charset=UTF-8'})
        console.log(file.url)

        // 开始设置uri
        const signer = props.provider.getSigner();
        const selectedAddress = await signer.getAddress()

        const nft = new ethers.Contract(props.address,NFTContract.abi,signer)
        
        const trans = await nft.mintItem(selectedAddress,file.url)
        console.log('trans',trans)
        await trans.wait()
        setLoading(false)
        props.onFinish(props.address,values['name'],values['description'])
    }
      
    return (<div>
        <Spin spinning={loading}>
        <PageHeader
            className="site-page-header"
            onBack={() => props.back()}
            title={props.name}
            subTitle={props.symbol}
            >
      <Descriptions size="small" column={1}>
        <Descriptions.Item label="Address">{props.address}</Descriptions.Item>
      </Descriptions>
    </PageHeader>
    <Form
      name="validate_other"
      {...formItemLayout}
      onFinish={onFinish}
      initialValues={{
        'input-number': 3,
        'checkbox-group': ['A', 'B'],
        rate: 3.5,
      }}
    >
        <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name="description" label="描述" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
      <Form.Item
        name="upload"
        label="NFT文件"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        // extra="longgggggggggggggggggggggggggggggggggg"
        rules={[{required:true}]}
      >
        <Upload 
        data={handleUploadData}
        name="file" action={config.host} listType="picture">
          <Button icon={<UploadOutlined />}>点击上传</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        wrapperCol={{
          span: 12,
          offset: 6,
        }}
      >
        <Button type="primary" htmlType="submit">
          下一步
        </Button>
      </Form.Item>
    </Form></Spin>
    </div>)
}

const Step3 = (props)=>{
    return (<div>
        <Result
    status="success"
    title="你成功地Mint了你的NFT!"
    subTitle={`NFT地址: ${props.address} 名称: ${props.name} 描述: ${props.description}`}
    extra={[
      <Button type="primary" key="console" onClick={props.back}>
        再来一次
      </Button>,
    ]}
  />
    </div>)
}

const Mint = props=>{

    const [current,setCurrent] = useState(0)
    const [address,setAddress] = useState()
    const [name,setName] = useState()
    const [symbol,setSymbol] = useState()
    const [itemName,setItemName] = useState()
    const [description,setDescription] = useState()

    const onFinishStep1 = (v,name,symbol)=>{
        setAddress(v)
        setSymbol(symbol)
        setName(name)
        setCurrent(1)
    }

    const onFinishStep2 = (v,_name,_description)=>{
        setItemName(_name)
        setDescription(_description)
        setCurrent(2)
    }

    return (<div>
        <Row>
            <Col span={12} offset={6}>
                <Steps size="small" current={current} style={{marginBottom:"20px"}}>
                    <Step title="导入NFT" />
                    <Step title="Mint" />
                    <Step title="Success" />
                </Steps>
                <Card>
                    {current==0?<Step1 contracts={props.contracts} provider={props.provider} onFinish={onFinishStep1}/>:"" }
                    {current==1?<Step2 contracts={props.contracts} provider={props.provider} onFinish={onFinishStep2} name={name} symbol={symbol} address={address} back={()=>setCurrent(0)}/>:""} 
                    {current==2?<Step3 name={name} symbol={symbol} address={address} name={itemName} description={description} back={()=>setCurrent(1)}/>:""}
                </Card>
            </Col>
        </Row>
        
    </div>)
}

export default Mint