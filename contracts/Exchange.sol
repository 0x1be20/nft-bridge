pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IFactory.sol";
import "./IExchange.sol";
contract Exchange is ERC20{
    address public tokenAddress;
    address public factoryAddress;
    constructor(address _token)ERC20("Zuniswap-V1","ZUNI-V1"){
        require(_token!=address(0),"invalid token address");
        tokenAddress = _token;
        factoryAddress = msg.sender;
    }

    function addLiquidity(uint256 _tokenAmount) public payable returns(uint256){
        if(getReserve()==0){
            
            IERC20 token = IERC20(tokenAddress);
            token.transferFrom(msg.sender, address(this), _tokenAmount);

            uint256 liquidity = address(this).balance;
            _mint(msg.sender,liquidity);
            return liquidity;
        }else{
            uint256 ethReserve = address(this).balance-msg.value;
            uint256 tokenReserve = getReserve();
            uint256 tokenAmount = (msg.value*tokenReserve)/ethReserve;
            require(_tokenAmount>=tokenAmount,"insufficient token amount");
            IERC20 token = IERC20(tokenAddress);
            token.transferFrom(msg.sender, address(this), tokenAmount);

            uint256 liquidity = (totalSupply()*msg.value)/ethReserve;
            _mint(msg.sender,liquidity);
            return liquidity;
        }
        
    }

    function removeLiquidity(uint _amount)public returns(uint256,uint256){
        require(_amount>0,"invalid amount");

        uint256 ethAmount = (address(this).balance*_amount)/totalSupply();
        uint256 tokenAmount = (getReserve()*_amount)/totalSupply();

        _burn(msg.sender,_amount);
        payable(msg.sender).transfer(ethAmount);
        IERC20(tokenAddress).transfer(msg.sender,tokenAmount);

        return (ethAmount,tokenAmount);
    }

    function getReserve() public view returns (uint256){
        return IERC20(tokenAddress).balanceOf(address(this));
    }    

    function getAmount(uint256 inputAmount,uint256 inputReserve,uint256 outputReserve)private pure returns(uint256){
        require(inputReserve>0 && outputReserve>0,"invalid reserves");
        uint256 inputAmountWithFee = inputAmount*99;
        uint256 numerator = inputAmountWithFee*outputReserve;
        uint256 denominator = (inputReserve*100)+inputAmountWithFee;
        return numerator/denominator;
    }

    function getTokenAmount(uint256 _ethSold)public view returns (uint256){
        require(_ethSold>0,"ethSold is too small");
        uint256 tokenReserve = getReserve();
        return getAmount(_ethSold,address(this).balance,tokenReserve);
    }

    function getEthAmount(uint256 _tokenSold)public view returns(uint256){
        require(_tokenSold>0,"tokenSold is too small");
        uint256 tokenReserve = getReserve();
        return getAmount(_tokenSold,tokenReserve,address(this).balance);
    }

    function ethToTokenSwap(uint256 _minTokens)public payable{
        ethToToken(_minTokens,msg.sender);
    }


    function tokenToEthSwap(uint256 _tokenSold,uint256 _minEth)public{
        uint256 tokenReserve = getReserve();
        uint256 ethBought = getAmount(_tokenSold, tokenReserve, address(this).balance);

        require(ethBought>=_minEth,"insufficient output amount");

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _tokenSold);

        payable(msg.sender).transfer(ethBought);
    }

    function ethToToken(uint256 _minToken,address recipient)private{
        uint256 tokenReserve = getReserve();
        uint256 tokenBought = getAmount(msg.value,address(this).balance-msg.value,tokenReserve);
        require(tokenBought>=_minToken,"insufficient output amount");

        IERC20(tokenAddress).transfer(recipient, tokenBought);
    }

    function ethToTokenTransfer(uint _minToken,address recipient)public payable{
        ethToToken(_minToken, recipient);
    }

    function tokenToTokenSwap(uint _tokenSold,uint256 _minTokenBought,address _tokenAddress)public {
        
        address exchangeAddress = IFactory(factoryAddress).getExchange(_tokenAddress);
        require(
            exchangeAddress!=address(0) && exchangeAddress!=address(this),
            "invalid exchange address"
        );
        uint256 tokenReserve = getReserve();
        uint256 ethBought = getAmount(_tokenSold,tokenReserve,address(this).balance);
        
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _tokenSold);

        IExchange(exchangeAddress).ethToTokenTransfer{value:ethBought}(_minTokenBought,msg.sender);

    }
}