export interface Pool {
  name: string;
  id: number;   
  address: string;
  token0: {
    symbol: string;
    address: string;
    logoURI: string;
  };
  token1: {
    symbol: string;
    address: string;
    logoURI: string;
  };
  fee: number;
  source: string;
  chainId: number;
}

export const pools: Pool[] = [
  {
    name: "uniswap-v3-usdc-cbBTC",
    id: 1,
    address: "0xfBB6Eed8e7aa03B138556eeDaF5D271A5E1e43ef",
    token0: {
      symbol: "USDC",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      logoURI: "https://ethereum-optimism.github.io/data/USDC/logo.png"
    },
    token1: {
      symbol: "cbBTC",
      address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
      logoURI: "https://assets.coingecko.com/coins/images/40143/standard/cbbtc.webp"
    },
    fee: 3000,
    source: "Uniswap V3",
    chainId: 8453
  },
  {
    name: "uniswap-v3-eth-usdc",
    id: 2,
    address: "0x6c561B446416E1A00E8E93E221854d6eA4171372",
    token0: {
      symbol: "ETH",
      address: "0x4200000000000000000000000000000000000006",
      logoURI: "https://res.cloudinary.com/dg5ddxvko/image/upload/v1738785154/eth-diamond-black-gray_dlsr8g.png"
    },
    token1: {
      symbol: "USDC",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      logoURI: "https://ethereum-optimism.github.io/data/USDC/logo.png"
    },
    fee: 3000,
    source: "Uniswap V3",
    chainId: 8453
  },
  {
    name: "uniswap-v3-eth-cbBTC",
    id: 3,
    address: "0x8c7080564B5A792A33Ef2FD473fbA6364d5495e5",
    token0: {
      symbol: "ETH",
      address: "0x4200000000000000000000000000000000000006",
      logoURI: "https://res.cloudinary.com/dg5ddxvko/image/upload/v1738785154/eth-diamond-black-gray_dlsr8g.png"
    },
    token1: {
      symbol: "cbBTC",
      address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
      logoURI: "https://assets.coingecko.com/coins/images/40143/standard/cbbtc.webp"
    },
    fee: 3000,
    source: "Uniswap V3",
    chainId: 8453
  },
  {
    name: "uniswap-v3-eth-aero",
    id: 4,
    address: "0x3d5D143381916280ff91407FeBEB52f2b60f33Cf",
    token0: {
      symbol: "ETH",
      address: "0x4200000000000000000000000000000000000006",
      logoURI: "https://res.cloudinary.com/dg5ddxvko/image/upload/v1738785154/eth-diamond-black-gray_dlsr8g.png"
    },
    token1: {
      symbol: "AERO",
      address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
      logoURI: "https://basescan.org/token/images/aerodrome_32.png"
    },
    fee: 3000,
    source: "Uniswap V3",
    chainId: 8453
  },
  {
    name: "uniswap-v3-usdc-usdt",
    id: 5,
    address: "0xD56da2B74bA826f19015E6B7Dd9Dae1903E85DA1",
    token0: {
      symbol: "USDC",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      logoURI: "https://ethereum-optimism.github.io/data/USDC/logo.png"
    },
    token1: {
      symbol: "USDT",
      address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      logoURI: "https://ethereum-optimism.github.io/data/USDT/logo.png"
    },
    fee: 3000,
    source: "Uniswap V3",
    chainId: 8453
  }
];
