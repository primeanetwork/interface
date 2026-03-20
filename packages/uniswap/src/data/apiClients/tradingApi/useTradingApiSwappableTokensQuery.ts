import { UseQueryResult, skipToken, useQuery } from '@tanstack/react-query'
import { UseQueryApiHelperHookArgs } from 'uniswap/src/data/apiClients/types'
import { GetSwappableTokensResponse } from 'uniswap/src/data/tradingApi/__generated__'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'

export interface SwappableTokensParams {
  tokenIn: string
  tokenInChainId: number
}

// Fetches swappable tokens from the locally hosted PrimeaNetwork token list.
// To add or update tokens, edit public/tokenlist.json.
async function fetchLocalSwappableTokens(params: SwappableTokensParams): Promise<GetSwappableTokensResponse> {
  const response = await fetch('/tokenlist.json')
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

export function useTradingApiSwappableTokensQuery({
  params,
  ...rest
}: UseQueryApiHelperHookArgs<SwappableTokensParams, GetSwappableTokensResponse>): UseQueryResult<GetSwappableTokensResponse> {
  const queryKey = [ReactQueryCacheKey.TradingApi, 'local-swappable-tokens', params]

  return useQuery<GetSwappableTokensResponse>({
    queryKey,
    queryFn: params
      ? async () => fetchLocalSwappableTokens(params)
      : skipToken,
    ...rest,
  })
}
