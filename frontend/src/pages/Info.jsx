import React from 'react'
import { Typography, Divider } from 'antd';

const { Title, Paragraph, Text, Link } = Typography;

const Info = props=>{


    return (
        <Typography>
    <Title>NFT Bridge</Title>
    <Paragraph>
      NFT是当前市场的热点，拥有最广大的用户群体。当前用户对于NFT的认知主要在于其<Text strong>艺术收藏价值</Text>，但是如果NFT只能作为炒作的题材，当前这样的热度是无法维持下去的。
    </Paragraph>
    <Paragraph>
      <Text strong>NFT金融以及身份权益</Text>可能会代替收藏作用，继续推动NFT发展。多链共同发展的情况也会继续，因此类似于Token跨链需求，NFT，尤其是高价值NFT，也需要跨链桥。
    </Paragraph>
    <Title level={2}>NFT跨链原理</Title>
    <Paragraph>
      不同于Token 跨链，存在<Link target={"_blank"} href="https://mp.weixin.qq.com/s/aSJgR7_JdoqgnJtGnc5uZA">多种解决方案</Link>，NFT因为每个NFT都是唯一不可分割的，所以NFT跨链只能通过<Text strong>合成资产</Text>的方式进行跨链。因此跨链逻辑是：
      <ol>
          <li>用户将源链NFT deposit到专门的合约中</li>
          <li>节点通过监听事件，然后在对应链上发行对应的wNFT</li>
      </ol>
    </Paragraph>
    <Title level={2}>演示配置</Title>
    <Paragraph>
        使用账户 Private Key: <Text mark copyable>0x211addeb38e18b96b55225248ef21652033dbfd9638a582f0ba97c627a1fef0f</Text>
    </Paragraph>
    <Paragraph>
        NFT铸造链: name: BSC Testnet chainID: 97 rpc:<Text copyable>https://data-seed-prebsc-1-s1.binance.org:8545/</Text>
    </Paragraph>
    <Paragraph>
        跨链目标链: name: Fantom Testnet chainID: 4002 rpc:<Text copyable>https://xapi.testnet.fantom.network/lachesis</Text>
    </Paragraph>
    <Paragraph>
        在铸造链上进行跨链之后，需要切换到目标网络，通过Listing按钮，把wNFT的地址（已经拷贝在剪切板，Ctrl+V就可以粘贴）粘贴导入就可以看到跨链过来的NFT。
    </Paragraph>
    <Title level={2}>项目说明</Title>
    <Paragraph>
        Github repos:<Link href="https://github.com/0x1be20/nft-bridge" target="_blank" >NFTBridge</Link>
    </Paragraph>
    <Paragraph>
        项目源代码分为四个部分，分别是合约代码(<Text code>contracts/</Text>)、用户前端(<Text code>frontend/</Text>)、数据索引后端(<Text code>backend/</Text>)以及bridge节点代码(<Text code>node/</Text>)。为了演示效果，代码也提供了一个创建NFT的工具，在演示的时候能够简单的创建自己的NFT合集，Mint NFT。
    </Paragraph>
    
  </Typography>
    )
}

export default Info