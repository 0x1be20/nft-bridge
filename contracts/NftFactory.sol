pragma solidity ^0.8.0;
import "./Nft.sol";
contract NftFactory{

    mapping(address=>address) creator;

    function createNft(string memory name,string memory symbol)public returns(address){
        Nft nft = new Nft(name,symbol);
        creator[address(nft)] = msg.sender;
        return address(nft);
    }

    function setBaseURI(address nftAddr,string memory uri)public {
        require(creator[nftAddr]==msg.sender,"only creator can set");
        Nft(nftAddr).setBaseURI(uri);
    }

    function transferOwnship(address nftAddr,address owner)public{
        require(creator[nftAddr]==msg.sender,"only creator can transfer");
        Nft(nftAddr).transferOwnership(owner);
    }

}