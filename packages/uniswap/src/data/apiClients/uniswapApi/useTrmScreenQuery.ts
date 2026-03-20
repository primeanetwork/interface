import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { UseQueryApiHelperHookArgs } from 'uniswap/src/data/apiClients/types'
import { ScreenRequest, ScreenResponse } from 'uniswap/src/data/apiClients/uniswapApi/UniswapApiClient'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'

// TODO: Replace with TRM Labs enterprise key or Chainalysis Oracle proxy
// when compliance screening is ready for production.
// For now, all wallets are returned as unblocked.
export function useTrmScreenQuery({
  params,
  ...rest
}: UseQueryApiHelperHookArgs<ScreenRequest, ScreenResponse>): UseQueryResult<ScreenResponse> {
  const queryKey = [ReactQueryCacheKey.UniswapApi, 'trm-stub', params]

  return useQuery<ScreenResponse>({
    queryKey,
    queryFn: async (): Promise<ScreenResponse> => ({
      block: false,
    }),
    ...rest,
  })
}
