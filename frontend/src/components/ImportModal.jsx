import React from 'react';
import { Modal, Button ,Alert} from 'antd';
import { Form, Input, InputNumber, Avatar, Typography } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import request from '../utils'
const ImportModal = (props)=>{

    const [loading,setLoading] = useState(false)
    const [show,setShow] = useState(props.show)
    const [message,setMessage] = useState()

    useEffect(()=>{
        setShow(props.show)
    },[props.show])

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        setLoading(true)

        const results= await props.loadNft(values['address'])
        console.log(results)
        if(results.length>0){
            await request.post(`/collections/${values.address}/items`,{items:JSON.stringify(results),owner:props.owner,chainid:props.chainid})
            setLoading(false)
            setShow(false)
            window.location.reload()
        }else{
            setLoading(false)
            setMessage("合约不存在或没有属于当前地址的NFT")
        }
        
      };
 
    const [form] = Form.useForm();

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
        };
        const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
        };

    return (
    <Modal title="导入我的NFT"footer={false} visible={show} onOk={()=>{props.onOk()}} onCancel={()=>{props.onCancel()}}>
        {message?(<Alert 
            message="操作提示"
            type="info"
            description={message}
            showIcon/>):""}
        <Form form={form} onFinish={onFinish} layout={layout} name="userForm" disabled={loading}>
            <Form.Item name="address" label="NFT地址" rules={[{ required: true }]}>
            <Input />
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" size='large' loading={loading}>
                导入
                </Button>
            </Form.Item>
        </Form>
    </Modal>
    )

}
 
export default ImportModal;