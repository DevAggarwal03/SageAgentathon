import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: 'hardhat',
  networks: {
    LineaSepolia: {
      // chainId: 59141,
      url: "https://rpc.sepolia.linea.build",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    BaseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    ArbitrumSepolia: {
      url: "https://421614.rpc.thirdweb.com",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};

export default config;
