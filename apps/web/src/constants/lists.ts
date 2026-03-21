// // Lists we use as fallbacks on chains that our backend doesn't support
// const COINGECKO_AVAX_LIST = 'https://tokens.coingecko.com/avalanche/all.json'

// export const DEFAULT_INACTIVE_LIST_URLS: string[] = [COINGECKO_AVAX_LIST]
// Primea: only load our own tokenlist — no external chain lists needed
export const PRIMEA_TOKEN_LIST = 'https://app.primeanetwork.com/tokenlist.json'
export const DEFAULT_INACTIVE_LIST_URLS: string[] = [PRIMEA_TOKEN_LIST]
