// // Lists we use as fallbacks on chains that our backend doesn't support
// const COINGECKO_AVAX_LIST = 'https://tokens.coingecko.com/avalanche/all.json'

// export const DEFAULT_INACTIVE_LIST_URLS: string[] = [COINGECKO_AVAX_LIST]
// Primea: only load our own tokenlist — must match `PRIMEA_TOKEN_LIST_URL` in
// `packages/uniswap/src/features/chains/evm/info/primea.ts` (canonical URL for fetches).

export const PRIMEA_TOKEN_LIST = 'https://app.primeanetwork.com/tokenlist.json'
export const DEFAULT_INACTIVE_LIST_URLS: string[] = [PRIMEA_TOKEN_LIST]
