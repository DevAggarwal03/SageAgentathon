// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LiquidityPool is ERC20 {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public reserveA;
    uint256 public reserveB;

    constructor(address _tokenA, address _tokenB) ERC20("LP Token", "LP") {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    // Add Liquidity Function
    function addLiquidity(uint256 amountA, uint256 amountB) external {
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        if (reserveA == 0 || reserveB == 0) {
            _mint(msg.sender, amountA); // Mint LP tokens (Initial Liquidity Providers)
        } else {
            uint256 lpTokens = (amountA * totalSupply()) / reserveA;
            _mint(msg.sender, lpTokens);
        }

        reserveA += amountA;
        reserveB += amountB;
    }

    // Remove Liquidity Function
    function removeLiquidity(uint256 lpTokens) external {
        require(balanceOf(msg.sender) >= lpTokens, "Not enough LP tokens");

        uint256 amountA = (lpTokens * reserveA) / totalSupply();
        uint256 amountB = (lpTokens * reserveB) / totalSupply();

        _burn(msg.sender, lpTokens);
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);

        reserveA -= amountA;
        reserveB -= amountB;
    }

    // Swap Function (Token A to Token B)
    function swapAtoB(uint256 amountA) external {
        require(amountA > 0, "Amount must be greater than 0");
        
        uint256 amountB = (amountA * reserveB) / (reserveA + amountA); // Simple AMM formula
        require(amountB > 0, "Insufficient liquidity");

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transfer(msg.sender, amountB);

        reserveA += amountA;
        reserveB -= amountB;
    }

    // Swap Function (Token B to Token A)
    function swapBtoA(uint256 amountB) external {
        require(amountB > 0, "Amount must be greater than 0");

        uint256 amountA = (amountB * reserveA) / (reserveB + amountB);
        require(amountA > 0, "Insufficient liquidity");

        tokenB.transferFrom(msg.sender, address(this), amountB);
        tokenA.transfer(msg.sender, amountA);

        reserveA -= amountA;
        reserveB += amountB;
    }
}
