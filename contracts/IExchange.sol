pragma solidity ^0.8.0;

interface IExchange{
    function ethToTokenSwap(uint256 _minToken)external payable;
    function ethToTokenTransfer(uint _minToken,address recipient)external payable;
}