import { UniverseChainId, UniverseChainInfo } from 'uniswap/src/features/chains/types'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'

export const PRIMEA_CHAIN_INFO: UniverseChainInfo = {
  id: UniverseChainId.Primea,
  name: 'Primea',
  shortName: 'Primea',
  platform: Platform.EVM,
  testnet: false,
  nativeCurrency: {
    name: 'GOLDPN',
    symbol: 'GOLDPN',
    decimals: 18,
  },
  rpcUrls: {
    interface: { http: ['https://rpc.primeanetwork.com'] },
    default:   { http: ['https://rpc.primeanetwork.com'] },
    public:    { http: ['https://rpc.primeanetwork.com'] },
  },
  blockExplorers: {
    default: { name: 'Primea Explorer', url: 'https://explorer.primeanetwork.com' },
  },
  backendChain: {
    // some interfaces require this mapping for GraphQL
    chain: 'primea',
    chainId: UniverseChainId.Primea,
  },
}
