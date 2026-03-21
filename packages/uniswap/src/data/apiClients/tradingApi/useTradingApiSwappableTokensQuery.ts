import { QueryClient, UseQueryResult, useQuery, useQueryClient } from '@tanstack/react-query'
import { UseQueryApiHelperHookArgs } from 'uniswap/src/data/apiClients/types'
import { GetSwappableTokensResponse } from 'uniswap/src/data/tradingApi/__generated__'
import type { TradeableAsset } from 'uniswap/src/entities/assets'
import {
  getTokenAddressFromChainForTradingApi,
  toTradingApiSupportedChainId,
} from 'uniswap/src/features/transactions/swap/utils/tradingApi'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'
import { PRIMEA_TOKEN_LIST_URL } from 'uniswap/src/features/chains/evm/info/primea'

export interface SwappableTokensParams {
  tokenIn: string
  tokenInChainId: number
}

function isValidSwappableParams(params: SwappableTokensParams | undefined): params is SwappableTokensParams {
  return !!params && params.tokenIn.length > 0 && params.tokenInChainId > 0
}

// Fetches swappable tokens from the hosted PrimeaNetwork token list (same as apps/web default list URL).
async function fetchLocalSwappableTokens(params: SwappableTokensParams): Promise<GetSwappableTokensResponse> {
  const response = await fetch(PRIMEA_TOKEN_LIST_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch local token list')
  }
  const list = await response.json()
  return {
    tokens: list.tokens.filter(
      (token: { chainId: number; address: string }) =>
        token.chainId === params.tokenInChainId &&
        token.address.toLowerCase() !== params.tokenIn.toLowerCase(),
    ),
  }
}

function getQueryKey(params: SwappableTokensParams): unknown[] {
  return [ReactQueryCacheKey.TradingApi, 'local-swappable-tokens', params]
}

export function useTradingApiSwappableTokensQuery({
  params,
  enabled: enabledFromProps,
  ...rest
}: UseQueryApiHelperHookArgs<SwappableTokensParams, GetSwappableTokensResponse>): UseQueryResult<GetSwappableTokensResponse> {
  const valid = isValidSwappableParams(params)
  const enabled = (enabledFromProps ?? true) && valid

  return useQuery<GetSwappableTokensResponse>({
    queryKey: getQueryKey(params ?? { tokenIn: '', tokenInChainId: 0 }),
    queryFn: async () => (valid ? fetchLocalSwappableTokens(params) : { tokens: [] }),
    ...rest,
    enabled,
  })
}

// Synchronous cache read used by checkIsBridgePair to determine bridge eligibility
// without triggering a network request. Returns undefined if not yet cached.
export function getSwappableTokensQueryData({
  params,
  queryClient,
}: {
  params: SwappableTokensParams
  queryClient: QueryClient
}): GetSwappableTokensResponse | undefined {
  return queryClient.getQueryData<GetSwappableTokensResponse>(getQueryKey(params))
}

// Prefetches swappable tokens into the React Query cache so that
// checkIsBridgePair can perform a synchronous cache read when the
// user opens the token selector.
// Accepts a TradeableAsset (as used in SwapFormScreenStoreContextProvider)
// and derives the SwappableTokensParams internally.
export function usePrefetchSwappableTokens(asset: TradeableAsset | undefined): void {
  const queryClient = useQueryClient()

  if (!asset) {
    return
  }

  const tokenIn = getTokenAddressFromChainForTradingApi(asset.address, asset.chainId)
  const tokenInChainId = toTradingApiSupportedChainId(asset.chainId)

  if (!tokenIn || !tokenInChainId) {
    return
  }

  const params: SwappableTokensParams = { tokenIn, tokenInChainId }
  const cached = queryClient.getQueryData<GetSwappableTokensResponse>(getQueryKey(params))

  if (!cached) {
    queryClient.prefetchQuery({
      queryKey: getQueryKey(params),
      queryFn: () => fetchLocalSwappableTokens(params),
    })
  }
}
