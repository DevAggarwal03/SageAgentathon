import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// on Linea Sepolia
// const CLKTokenAddress = "0x6AFF5e1b5419286fa550C172848c9712abCa910f";
// const MIRTokenAddress = "0xe9Be8b2E9Cb6CFa2fDE8839C4608f3B74bA0210D";

//on Hardhat
// const CLKTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const MIRTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// on Base Sepolia
// const CLKTokenAddress = "0xaFAfE580fcBE957264129B256207372be7a10dfB";
// const MIRTokenAddress = "0x0d1941DdEFd4B2A001057EDcCF6C9640206851B0";

// on Arbitrum Sepolia
const CLKTokenAddress = "0xe57ffcf477aAa175F4378248d3473Df50fCbc160";
const MIRTokenAddress = "0x2d10723bBb401640033485F30ac23Fa71695B8DC";

// lp contract address: 0xC6418bafF7c7e345723C871e8b6057C56f59b537
const LiquidityPoolModule = buildModule("LiquidityPoolModule", (m) => {

    const clkAddr = m.getParameter("clkAddr", CLKTokenAddress)
    const mirAddr = m.getParameter("mirAddr", MIRTokenAddress)
    const LiquidityPool = m.contract("LiquidityPool", [clkAddr, mirAddr]);

    return { LiquidityPool };
});

export default LiquidityPoolModule;
