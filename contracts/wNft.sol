pragma solidity ^0.8.0;
import "./Nft.sol";

contract wNft is Nft{

    address public sourceNft; // 源nft地址
    uint256 public sourceChainId;
    mapping(uint256=>uint256) sourceTokenIds; // 源nft的tokenid

    constructor(address _source,uint256 _sourceChainId,string memory collectionName,string memory _symbol)Nft(collectionName,_symbol){
        sourceNft = _source;
        sourceChainId = _sourceChainId;
    }

    function mintItem(uint256 sourceTokenId,address to,string memory uri)public returns(uint256){
        uint256 id = super.mintItem(to,uri);
        sourceTokenIds[id] = sourceTokenId;
        return id;
    }

    function getSourceTokenId(uint256 id)public view returns(uint256){
        return sourceTokenIds[id];
    }

    function _checkExisting(uint256 sourceId)internal view returns(bool){
        uint256 total = totalSupply();
        for(uint256 i=1;i<=total;i++){
            if(sourceTokenIds[i]==sourceId){
                return true;
            }
        }
        return false;
    }

    function getDistTokenId(uint256 sourceId)public view returns(uint256){
        uint256 total = totalSupply();
        for(uint256 i=1;i<=total;i++){
            if(sourceTokenIds[i]==sourceId){
                return i;
            }
        }
        return 0;
    }
}