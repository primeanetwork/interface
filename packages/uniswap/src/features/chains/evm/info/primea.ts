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
 * - backendSupported = false (no Uniswap Data API / GraphQL backend for Primea)
 * - Addresses match tokenlist.json (real deployed contracts)
 * - WGASPN9 is the wrapped native token (WETH9 equivalent)
 * - USDP mapped as USDC for routing/pricing heuristics
 */

export const PRIMEA_TOKEN_ADDRESSES = {
  WGASPN9:  '0x65267D56e74F462ea6b3db368608F5Ddb10ae696',
  USDP:     '0x405862E7710019eaE9561Ea03BCA606107BD9B0C',
  PRIM:     '0xd1bd59B0E7f96f2b0eEF8CB7f8872E60DD02fbCf',
  SILVERPN: '0x353742fBaeCe4fCF662CBeC39E74eE1C4bCff5c5',
  GOLDPN:   '0xE46Bbb06C632B9Ab3706d28A97EcA22690b2923A',
  APPLP:    '0xAf2323c5Ef06c7EedC04EbcEd1E804c4625b851d',
} as const

export const PRIMEA_PERIPHERY_ADDRESSES = {
  UniswapV3Factory:           '0x27E6457d940edC0A1295b518fcd697E3a83dbC12',
  SwapRouter:                 '0x945faF172d69CF1FF36608A2f99c5d670C14c249',
  NonfungiblePositionManager: '0xC37E34E6534f55562521670a4477220A0c43a235',
  QuoterV2:                   '0x78fD77468aF04a0609af6BFa7c21fa337A5329C1',
  TickLens:                   '0xB666Fac4593928e694bAf9A632C571EfF28bc3aD',
  PeripheryMulticall:         '0x6Bef4741D8C089807bcdCae6E07B9573Ff0D00ee',
} as const

export const PRIMEA_FACTORY_INIT_CODE_HASH =
  '0xd3e7f58b9af034cfa7a0597e539bae7c6b393817a47a6fc1e1503cd6eaffe22a' as const

// buildChainTokens only accepts stables — non-stable tokens exported separately below
const tokens = buildChainTokens({
  stables: {
    USDC: new Token(UniverseChainId.Primea, PRIMEA_TOKEN_ADDRESSES.USDP, 18, 'USDP', 'Primea USD'),
  },
})

// Additional Primea tokens for routing and UI
export const PRIMEA_EXTRA_TOKENS = {
  WGASPN9:  new Token(UniverseChainId.Primea, PRIMEA_TOKEN_ADDRESSES.WGASPN9,  18, 'WGASPN9',  'Wrapped GASPN'),
  PRIM:     new Token(UniverseChainId.Primea, PRIMEA_TOKEN_ADDRESSES.PRIM,     18, 'PRIM',     'Primea'),
  SILVERPN: new Token(UniverseChainId.Primea, PRIMEA_TOKEN_ADDRESSES.SILVERPN, 18, 'SILVERPN', 'Primea Silver'),
  GOLDPN:   new Token(UniverseChainId.Primea, PRIMEA_TOKEN_ADDRESSES.GOLDPN,   18, 'GOLDPN',   'Gold Ounce Primea'),
  APPLP:    new Token(UniverseChainId.Primea, PRIMEA_TOKEN_ADDRESSES.APPLP,    18, 'APPLP',    'APPL Stock Primea'),
} as const

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
  elementName: ElementName.ChainBNB,

  explorer: {
    name: 'Primea Explorer',
    url: 'https://explorer.primeanetwork.com/',
  },

  interfaceName: 'primea',
  label: 'Primea',
  logo: BNB_LOGO,

  nativeCurrency: {
    name: 'GASPN',
    symbol: 'GASPN',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: BNB_LOGO,
  },

  networkLayer: NetworkLayer.L1,
  pendingTransactionsRetryOptions: undefined,

  rpcUrls: {
    [RPCType.Public]:    { http: ['https://rpc.primeanetwork.com'] },
    [RPCType.Default]:   { http: ['https://rpc.primeanetwork.com'] },
    [RPCType.Interface]: { http: ['https://rpc.primeanetwork.com'] },
  },

  spotPriceStablecoinAmountOverride: CurrencyAmount.fromRawAmount(tokens.USDC, '100000000000000000000'),
  tokens,

  statusPage: undefined,
  supportsV4: true,
  urlParam: 'primea',

  wrappedNativeCurrency: {
    name: 'Wrapped GASPN',
    symbol: 'WGASPN9',
    decimals: 18,
    address: PRIMEA_TOKEN_ADDRESSES.WGASPN9,
    logo: BNB_LOGO,
  },

  tradingApiPollingIntervalMs: 500,
} as const satisfies UniverseChainInfo
