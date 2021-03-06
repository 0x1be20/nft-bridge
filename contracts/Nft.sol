pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Nft is ERC721,ERC721Enumerable,Ownable,ERC721URIStorage{
    using Counters for Counters.Counter;
    string public baseURI;

    Counters.Counter private _tokenIdCounter;

    constructor(string memory collectionName,string memory _symbol)ERC721(collectionName,_symbol){}

    function setBaseURI(string memory _baseURI)onlyOwner public {
        baseURI = _baseURI;
    }

    function _baseURI() internal view override returns(string memory){
        return baseURI;
    }

    function mintItem(address to,string memory uri)public virtual returns(uint256){
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to,tokenId);
        _setTokenURI(tokenId,uri);
        return tokenId;
    }

    function _beforeTokenTransfer(address from, address to,uint256 tokenId)internal override(ERC721,ERC721Enumerable){
        super._beforeTokenTransfer(from,to,tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721,ERC721URIStorage){
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)public view override(ERC721,ERC721URIStorage)returns(string memory){
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)public view override(ERC721,ERC721Enumerable)returns(bool){
        return super.supportsInterface(interfaceId);
    }
}