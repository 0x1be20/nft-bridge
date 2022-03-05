import React from 'react';
import { Card, Col, Row,Avatar,Menu,Dropdown, message,Result,Button } from 'antd';
import { EditOutlined, EllipsisOutlined,SettingOutlined,DownOutlined,SmileOutlined } from '@ant-design/icons';
const copy = require('clipboard-copy')
const { Meta } = Card;

const MyNft=props=>{

  


  const divs = props.nfts.map(item=>{

    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={()=>{
            copy(item.collection.address)
            message.success("拷贝地址成功")
          }}>
            拷贝地址
          </a>
        </Menu.Item>
      </Menu>
    );

    const meta = JSON.parse(item.meta)
    return (
      <Col key={item.url}  xs={24} sm={12} md={8} lg={6}>
      <Card
      style={{ width: 250,marginBottom:'20px' }}
      hoverable
      onClick={()=>{copy(item.collection.address);message.success("NFT地址已拷贝至剪切板")}}
      cover={
        <img
          alt="example"
          src={meta.image}
          style={{objectFit:'cover',height:'200px'}}
        />
      }
      // actions={[
      //   <SettingOutlined key="setting" />,
      //   <EditOutlined key="edit" />,
      //   (<Dropdown overlay={menu} key='drop'>
      //     <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
      //       <EllipsisOutlined/>
      //     </a>
      //   </Dropdown>),
      // ]}
    >
      <Meta
        // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
        title={meta.name}
        description={meta.description}
      />
    </Card>
    </Col>
    )
  })

  return (
      <Row gutter={8}>
        {divs.length?divs:(<Col span={24} style={{alignItems:'center'}}>
          <Result
    icon={<SmileOutlined />}
    title="目前还没持有NFT，可以导入或者Mint新NFT!"
    // extra={<Button type="primary">Next</Button>}
  />
        </Col>)}
    </Row>
  )
}

export default MyNft;