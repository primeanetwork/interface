import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { BNB_LOGO } from 'ui/src/assets'
import { Chain as BackendChainId } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { DEFAULT_NATIVE_ADDRESS_LEGACY } from 'uniswap/src/features/chains/evm/rpc'
import { buildChainTokens } from 'uniswap/src/features/chains/evm/tokens'
import {
  GqlChainId,
  NetworkLayer,
  RPCType,
  UniverseChainId,
  UniverseChainInfo,
} from 'uniswap/src/features/chains/types'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { ElementName } from 'uniswap/src/features/telemetry/constants'

/**
 * Primea chain configuration
 *
 * Notes:
 * - backendSupported = false (no Uniswap Data API / GraphQL backend for Primea yet)
 * - Uses real deployed token + periphery addresses
 * - WGOLDPN9 is the wrapped native token (WETH9 equivalent)
 */

const tokens = buildChainTokens({
  stables: {
    // USDP – Primea USD (canonical stable)
    USDC: new Token(
      UniverseChainId.Primea,
      '0xe855adB2C4058c6804c7D815354A53418D5Ab509',
      18,
      'USDP',
      'Primea USD',
    ),
  },
})

export const PRIMEA_CHAIN_INFO = {
  id: UniverseChainId.Primea,
  name: 'Primea',
  platform: Platform.EVM,
  assetRepoNetworkName: undefined,

  backendChain: {
    chain: BackendChainId.UnknownChain as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },

  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: undefined,
  bridge: undefined,
  docs: 'https://primeanetwork.com/',
  elementName: ElementName.ChainBNB, // reuse until Primea telemetry constant exists

  explorer: {
    name: 'Primea Explorer',
    url: 'https://explorer.primeanetwork.com/',
  },

  interfaceName: 'primea',
  label: 'Primea',
  logo: BNB_LOGO, // replace later with Primea logo

  nativeCurrency: {
    name: 'GOLDPN',
    symbol: 'GOLDPN',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: BNB_LOGO, // replace later with GOLDPN logo
  },

  networkLayer: NetworkLayer.L1,
  pendingTransactionsRetryOptions: undefined,

  rpcUrls: {
    [RPCType.Public]: { http: ['https://rpc.primeanetwork.com'] },
    [RPCType.Default]: { http: ['https://rpc.primeanetwork.com'] },
    [RPCType.Interface]: { http: ['https://rpc.primeanetwork.com'] },
  },

  // Pricing heuristics (used by UI, even without backend)
  spotPriceStablecoinAmountOverride: CurrencyAmount.fromRawAmount(tokens.USDC, 100e18),
  tokens,

  statusPage: undefined,
  supportsV4: true,
  urlParam: 'primea',

  // ✅ Real wrapped native token (WGOLDPN9)
  wrappedNativeCurrency: {
    name: 'Wrapped GOLDPN',
    symbol: 'WGOLDPN',
    decimals: 18,
    address: '0x3a8f7DbD63eA169cfE1D597be0130fe68e0c86f9',
  },

  tradingApiPollingIntervalMs: 500,
} as const satisfies UniverseChainInfo

// Optional exports for reuse elsewhere (UI / scripts / diagnostics)
export const PRIMEA_TOKEN_ADDRESSES = {
  PRIM: '0x94EeF39C36552074924f5D49Ec4b328C60aE62EE',
  USDP: '0xe855adB2C4058c6804c7D815354A53418D5Ab509',
  KAGP: '0x9c0758e5c6e658f28f8e3D93f6402595A2c5209F',
  APPLP: '0xf2052Ca4368c2704A4e40f78a6C28F8dabC4F518',
}

export const PRIMEA_PERIPHERY_ADDRESSES = {
  UniswapV3Factory: '0x27E6457d940edC0A1295b518fcd697E3a83dbC12',
  SwapRouter: '0xeE6C964c1c210D63429cE15DC2D692f08C832d47',
  NonfungiblePositionManager: '0xD01379551f70B766D9008Fa182c0d076Df89cEC7',
  QuoterV2: '0xd31ADCD62bfb5b891a3389B6E951415fA108fDe6',
  TickLens: '0xff2E8c17b8dA0960efF5c6b38A1Abf5AfF3cA856',
}
