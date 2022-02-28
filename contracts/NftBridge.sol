pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";  
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./wNft.sol";

contract NftBridge is Ownable{  
    uint256 public chainId;
    uint256 public distChainId;

    mapping(address=>address) source2distCollections; // source=>dist 源链使用的数据
    mapping(address=>address) dist2sourceCollections; // dist=>source 目标链使用的数据

    event NftDeposit(address sourceNftAddr,uint256 tokenId,address from,address to); // nft 存储
    // event NftWrapped(address sourceNftAddr,uint256 tokenId,address to); // nft 发放
    event NftCollectionCreated(address distCollectionAddr,string collectionName,string symbol); // 新建nft collection copy
    event NftCollectionCreate(address sourceCollectionAddr,string collectionName,string symbol); // 新建nft collection copy

    constructor(uint256 _chainId,uint256 _distChainId){
        chainId = _chainId;
        distChainId = _distChainId;
    }

    // 获得目标链的nft地址
    function getDistCollection(address collectionAddr)public view returns(address){
        return source2distCollections[collectionAddr];
    }

    // 设置目标链的nft地址
    function setDistCollection(address sourceCollectionAddr,address distCollectionAddr)onlyOwner public{
        require(source2distCollections[sourceCollectionAddr]!=address(0),"dist address already exists");
        source2distCollections[sourceCollectionAddr] = distCollectionAddr;
    }

    // 创建合集
    function createDistCollection(address sourceCollectionAddr,string memory collectionName,string memory _symbol)onlyOwner public returns(address){
        wNft _wnft = new wNft(sourceCollectionAddr,distChainId,collectionName,_symbol);
        dist2sourceCollections[sourceCollectionAddr] = address(_wnft);
        emit NftCollectionCreated(address(_wnft),collectionName,_symbol);
        return address(_wnft);
    }

    // 源链调用
    function createCollection(address sourceCollectionAddr)public{
        string memory name = ERC721(sourceCollectionAddr).name();
        string memory symbol = ERC721(sourceCollectionAddr).symbol();
        emit NftCollectionCreate(sourceCollectionAddr,name,symbol);
    }


    // 存储nft
    function deposit(address sourceCollectionAddr,uint256 tokenId,address to) public virtual returns(bool){
        require(source2distCollections[sourceCollectionAddr]!=address(0),"nft collection not exists");
        IERC721(sourceCollectionAddr).safeTransferFrom(msg.sender,address(this),tokenId);

        emit NftDeposit(sourceCollectionAddr,tokenId,msg.sender,to);
        return true;
    }

    // 铸造nft
    function mintItem(address sourceCollectionAddr,address to,string memory uri)onlyOwner public returns(uint256){
        require(source2distCollections[sourceCollectionAddr]!=address(0),"nft collection not exists");
        uint256 itemId = wNft(source2distCollections[sourceCollectionAddr]).mintItem(to,uri);
        return itemId;
    }
}