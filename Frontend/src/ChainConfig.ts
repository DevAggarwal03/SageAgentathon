import { chainConfig } from "viem/op-stack"
import { defineChain } from 'viem'



export const HardhatNetwork = /*#__PURE__*/ defineChain({
  ...chainConfig,
  id: 1337,
  network: 'localhost 8545',
  name: 'HardHat network',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  testnet: true,
})
