// import { PartialMessage } from '@bufbuild/protobuf'
// import { ConnectError } from '@connectrpc/connect'
// import { useQuery } from '@connectrpc/connect-query'
// import { UseQueryResult } from '@tanstack/react-query'
// import { exploreStats } from '@uniswap/client-explore/dist/uniswap/explore/v1/service-ExploreStatsService_connectquery'
// import { ExploreStatsRequest, ExploreStatsResponse } from '@uniswap/client-explore/dist/uniswap/explore/v1/service_pb'
// import { uniswapGetTransport } from 'uniswap/src/data/rest/base'

// /**
//  * Wrapper around Tanstack useQuery for the Uniswap REST BE service ExploreStats
//  * This included top tokens and top pools data
//  * @param input { chainId: string } - string representation of the chain to query or `ALL_NETWORKS` for aggregated data
//  * @param select - function to transform the data before returning it
//  * @returns UseQueryResult<ExploreStatsResponse, ConnectError>
//  */
// export function useExploreStatsQuery<TSelectType>({
//   input,
//   enabled = true,
//   select,
// }: {
//   input?: PartialMessage<ExploreStatsRequest>
//   enabled?: boolean
//   select?: ((data: ExploreStatsResponse) => TSelectType) | undefined
// }): UseQueryResult<TSelectType, ConnectError> {
//   return useQuery(exploreStats, input, { transport: uniswapGetTransport, enabled, select })
// }
// Primea: stubbed — no Uniswap ExploreStats gateway for Primea chain
import { ConnectError } from '@connectrpc/connect'
import { UseQueryResult } from '@tanstack/react-query'

export function useExploreStatsQuery<TSelectType>(_args?: unknown): UseQueryResult<TSelectType, ConnectError> {
  return {
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    isFetching: false,
    isSuccess: false,
    isPending: true,
    isLoadingError: false,
    isRefetchError: false,
    isPaused: false,
    isStale: false,
    isPlaceholderData: false,
    status: 'pending',
    fetchStatus: 'idle',
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    errorUpdateCount: 0,
    failureCount: 0,
    failureReason: null,
    refetch: () => Promise.resolve({} as any),
    promise: Promise.resolve(undefined as any),
  } as unknown as UseQueryResult<TSelectType, ConnectError>
}
