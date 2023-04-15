// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WhitelistedERC20 is Ownable {
    mapping (address => bool) private whitelist;

    function addToWhitelist(address tokenAddress) public onlyOwner {
        whitelist[tokenAddress] = true;
    }

    function removeFromWhitelist(address tokenAddress) public onlyOwner {
        whitelist[tokenAddress] = false;
    }

    function whitelisted(address tokenAddress) public view returns (bool) {
        return whitelist[tokenAddress];
    }
}