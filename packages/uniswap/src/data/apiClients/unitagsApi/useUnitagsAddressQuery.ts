import { UseQueryResult, skipToken, useQuery } from '@tanstack/react-query'
import { UseQueryApiHelperHookArgs } from 'uniswap/src/data/apiClients/types'
import { fetchAddress, fetchUnitagsByAddresses } from 'uniswap/src/data/apiClients/unitagsApi/UnitagsApiClient'
import { PRIMEA_ONLY } from 'uniswap/src/features/chains/utils'
import {
  UnitagAddressRequest,
  UnitagAddressResponse,
  UnitagAddressesRequest,
  UnitagAddressesResponse,
} from 'uniswap/src/features/unitags/types'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'
import { MAX_REACT_QUERY_CACHE_TIME_MS, ONE_MINUTE_MS } from 'utilities/src/time/time'

export function useUnitagsAddressQuery({
  params,
  enabled: enabledFromProps,
  ...rest
}: UseQueryApiHelperHookArgs<UnitagAddressRequest, UnitagAddressResponse>): UseQueryResult<UnitagAddressResponse> {
  const queryKey = [ReactQueryCacheKey.UnitagsApi, 'address', params]
  const enabled = !PRIMEA_ONLY && !!params && (enabledFromProps ?? true)

  return useQuery<UnitagAddressResponse>({
    queryKey,
    queryFn: params ? async (): ReturnType<typeof fetchAddress> => await fetchAddress(params) : skipToken,
    staleTime: ONE_MINUTE_MS,
    gcTime: MAX_REACT_QUERY_CACHE_TIME_MS,
    ...rest,
    enabled,
  })
}

export function useUnitagsAddressesQuery({
  params,
  enabled: enabledFromProps,
  ...rest
}: UseQueryApiHelperHookArgs<
  UnitagAddressesRequest,
  UnitagAddressesResponse
>): UseQueryResult<UnitagAddressesResponse> {
  const queryKey = [ReactQueryCacheKey.UnitagsApi, 'addresses', params]
  const enabled = !PRIMEA_ONLY && !!params && (enabledFromProps ?? true)

  return useQuery<UnitagAddressesResponse>({
    queryKey,
    queryFn: params
      ? async (): ReturnType<typeof fetchUnitagsByAddresses> => await fetchUnitagsByAddresses(params)
      : skipToken,
    staleTime: ONE_MINUTE_MS,
    gcTime: MAX_REACT_QUERY_CACHE_TIME_MS,
    ...rest,
    enabled,
  })
}
