pragma solidity ^0.8.0;
import "./Nft.sol";

contract wNft is Nft{

    address sourceNft; // 源nft地址
    uint256 sourceChainId;

    constructor(address _source,uint256 _sourceChainId,string memory collectionName,string memory _symbol)Nft(collectionName,_symbol){
        sourceNft = _source;
        sourceChainId = _sourceChainId;
    }
}