// import { PartialMessage } from '@bufbuild/protobuf'
// import { ConnectError } from '@connectrpc/connect'
// import { useQuery } from '@connectrpc/connect-query'
// import { UseQueryResult } from '@tanstack/react-query'
// import { protocolStats } from '@uniswap/client-explore/dist/uniswap/explore/v1/service-ExploreStatsService_connectquery'
// import { ProtocolStatsRequest, ProtocolStatsResponse } from '@uniswap/client-explore/dist/uniswap/explore/v1/service_pb'
// import { uniswapGetTransport } from 'uniswap/src/data/rest/base'

// /**
//  * Wrapper around Tanstack useQuery for the Uniswap REST BE service ProtocolStats
//  * This includes data for protocol TVL and volume graphs
//  * @param input { chainId: string } - string representation of the chain to query or `ALL_NETWORKS` for aggregated data
//  * @returns UseQueryResult<ProtocolStatsResponse, ConnectError>
//  */
// export function useProtocolStatsQuery(
//   input?: PartialMessage<ProtocolStatsRequest>,
// ): UseQueryResult<ProtocolStatsResponse, ConnectError> {
//   return useQuery(protocolStats, input, { transport: uniswapGetTransport })
// }

// Primea: stubbed — no Uniswap ProtocolStats gateway for Primea chain
import { ConnectError } from '@connectrpc/connect'
import { ProtocolStatsResponse } from '@uniswap/client-explore/dist/uniswap/explore/v1/service_pb'
import { UseQueryResult } from '@tanstack/react-query'

export function useProtocolStatsQuery(_input?: unknown): UseQueryResult<ProtocolStatsResponse, ConnectError> {
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
  } as unknown as UseQueryResult<ProtocolStatsResponse, ConnectError>
}
