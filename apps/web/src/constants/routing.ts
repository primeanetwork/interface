import { Token } from '@uniswap/sdk-core'
import { PRIMEA_CHAIN_INFO } from 'uniswap/src/features/chains/evm/info/primea'
import { UniverseChainId } from 'uniswap/src/features/chains/types'

type ChainTokenList = {
  readonly [chainId: number]: Token[]
}

const WRAPPED_NATIVE_CURRENCIES_ONLY: ChainTokenList = {
  [UniverseChainId.Primea]: [PRIMEA_CHAIN_INFO.tokens.WGASPN9],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [UniverseChainId.Primea]: [
    PRIMEA_CHAIN_INFO.tokens.USDC,
    PRIMEA_CHAIN_INFO.tokens.PRIM,
    PRIMEA_CHAIN_INFO.tokens.WGASPN9,
    PRIMEA_CHAIN_INFO.tokens.SILVERPN,
    PRIMEA_CHAIN_INFO.tokens.APPLP,
  ],
}

export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
  [UniverseChainId.Primea]: [
    [PRIMEA_CHAIN_INFO.tokens.USDC, PRIMEA_CHAIN_INFO.tokens.WGASPN9],
    [PRIMEA_CHAIN_INFO.tokens.PRIM, PRIMEA_CHAIN_INFO.tokens.WGASPN9],
  ],
}
