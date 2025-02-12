// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CLKToken is ERC20 {
    address private admin;
    constructor() ERC20("Clock", "CLK") {
        admin = msg.sender;
        _mint(msg.sender, 10 * 1e18);
    }

    modifier onlyAdmin {
        require(msg.sender == admin, "Only admin can call this funciton");
        _;    
    }

    function  getAdmin() view public returns (address) {
        return admin;
    }

    function mint(uint256 value) public onlyAdmin {
        _mint(msg.sender, value);
    }

}