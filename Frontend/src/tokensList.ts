export interface Token {
    name: string;
    symbol: string;
    logoURI: string;
    address: string;
    decimals: number;
    balance?: string;
  }

export const tokens = [
    {
      "chainId": 42161,
      "address": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      "name": "Wrapped Ether",
      "symbol": "WETH",
      "decimals": 18,
      "logoURI": "https://ethereum-optimism.github.io/data/WETH/logo.png"
    },
    {
      "chainId": 42161,
      "address": "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      "name": "Tether USD",
      "symbol": "USDT",
      "decimals": 6,
      "logoURI": "https://ethereum-optimism.github.io/data/USDT/logo.png"
    },
    {
      "chainId": 42161,
      "address": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      "name": "USD Coin",
      "symbol": "USDC",
      "decimals": 6,
      "logoURI": "https://ethereum-optimism.github.io/data/USDC/logo.png"
    },
    {
      "chainId": 42161,
      "address": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      "name": "Dai Stablecoin",
      "symbol": "DAI",
      "decimals": 18,
      "logoURI": "https://ethereum-optimism.github.io/data/DAI/logo.svg"
    },
    {
      "chainId": 42161,
      "address": "0x912CE59144191C1204E64559FE8253a0e49E6548",
      "name": "Arbitrum",
      "symbol": "ARB",
      "decimals": 18,
      "logoURI": "https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg"
    },
    {
      "chainId": 42161,
      "address": "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
      "name": "Wrapped Bitcoin",
      "symbol": "WBTC",
      "decimals": 8,
      "logoURI": "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png"
    },
    {
      "chainId": 42161,
      "address": "0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55",
      "name": "Dopex Governance Token",
      "symbol": "DPX",
      "decimals": 18,
      "logoURI": "https://arbiscan.io/assets/arbitrum/images/svg/empty-token.svg?v=25.1.4.0"
    },
    {
      "chainId": 42161,
      "address": "0x51318B7D00db7ACc4026C88c3952B66278B6A67F",
      "name": "Plutus",
      "symbol": "PLS",
      "decimals": 18,
      "logoURI": "https://arbiscan.io/token/images/plutusdao2_32.png"
    },
    {
      "chainId": 42161,
      "address": "0x539bdE0d7Dbd336b79148AA742883198BBF60342",
      "name": "Magic",
      "symbol": "MAGIC",
      "decimals": 18,
      "logoURI": "https://assets.coingecko.com/coins/images/18623/large/magic.png"
    },
    {
      "chainId": 42161,
      "address": "0x32Eb7902D4134bf98A28b963D26de779AF92A212",
      "name": "Dopex Rebate Token",
      "symbol": "RDPX",
      "decimals": 18,
      "logoURI": "https://arbiscan.io/assets/arbitrum/images/svg/empty-token.svg?v=25.1.4.0"
    }
];