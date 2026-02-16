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

export const PRIMEA_TOKEN_ADDRESSES = {
  WGOLDPN9: '0x94EeF39C36552074924f5D49Ec4b328C60aE62EE',
  USDP: '0x9c0758e5c6e658f28f8e3D93f6402595A2c5209F',
  PRIM: '0xe855adB2C4058c6804c7D815354A53418D5Ab509',
  SILVERPN: '0xf2052Ca4368c2704A4e40f78a6C28F8dabC4F518',
  APPLP: '0x3a8f7DbD63eA169cfE1D597be0130fe68e0c86f9',
} as const

export const PRIMEA_PERIPHERY_ADDRESSES = {
  UniswapV3Factory: '0x27E6457d940edC0A1295b518fcd697E3a83dbC12',
  SwapRouter: '0x945faF172d69CF1FF36608A2f99c5d670C14c249',
  NonfungiblePositionManager: '0xC37E34E6534f55562521670a4477220A0c43a235',
  QuoterV2: '0x78fD77468aF04a0609af6BFa7c21fa337A5329C1',
  TickLens: '0xB666Fac4593928e694bAf9A632C571EfF28bc3aD',
  PeripheryMulticall: '0x6Bef4741D8C089807bcdCae6E07B9573Ff0D00ee',
} as const

export const PRIMEA_FACTORY_INIT_CODE_HASH =
  '0xd3e7f58b9af034cfa7a0597e539bae7c6b393817a47a6fc1e1503cd6eaffe22a' as const

const tokens = buildChainTokens({
  stables: {
    // USDP – Primea USD (canonical stable)
    USDC: new Token(UniverseChainId.Primea, PRIMEA_TOKEN_ADDRESSES.USDP, 18, 'USDP', 'Primea USD'),
  },
  // If your UI uses these token groups for routing/UX, keep them explicit
  other: {
    PRIM: new Token(UniverseChainId.Primea, PRIMEA_TOKEN_ADDRESSES.PRIM, 18, 'PRIM', 'Primea'),
    SILVERPN: new Token(
      UniverseChainId.Primea,
      PRIMEA_TOKEN_ADDRESSES.SILVERPN,
      18,
      'SILVERPN',
      'Primea Silver',
    ),
    APPLP: new Token(UniverseChainId.Primea, PRIMEA_TOKEN_ADDRESSES.APPLP, 18, 'APPLP', 'Apple Prime'),
    WGOLDPN9: new Token(
      UniverseChainId.Primea,
      PRIMEA_TOKEN_ADDRESSES.WGOLDPN9,
      18,
      'WGOLDPN9',
      'Wrapped GOLDPN',
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
    // Optional but helpful if the type supports it:
    // [RPCType.Fallback]: { http: ['https://rpc.primeanetwork.com'] },
  },

  // Pricing heuristics (used by UI, even without backend)
  spotPriceStablecoinAmountOverride: CurrencyAmount.fromRawAmount(tokens.USDC, '100000000000000000000'),
  tokens,

  statusPage: undefined,
  supportsV4: true,
  urlParam: 'primea',

  // ✅ Wrapped native token (WGOLDPN9)
  wrappedNativeCurrency: {
    name: 'Wrapped GOLDPN',
    symbol: 'WGOLDPN9',
    decimals: 18,
    address: PRIMEA_TOKEN_ADDRESSES.WGOLDPN9,
    logo: BNB_LOGO, // replace later with WGOLDPN logo
  },

  tradingApiPollingIntervalMs: 500,
} as const satisfies UniverseChainInfo
