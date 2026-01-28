import {
  PoolTableSortState,
  TablePool,
  calculate1DVolOverTvl,
  calculateApr,
  sortPools,
} from 'appGraphql/data/pools/useTopPools'
// import { useCallback, useMemo, useRef, useEffect, useState } from 'react'
import { useCallback, useMemo, useRef } from 'react'
import { DEFAULT_TICK_SPACING, V2_DEFAULT_FEE_TIER } from 'uniswap/src/constants/pools'
import {
  useTopV2PairsQuery,
  useTopV3PoolsQuery,
  useTopV4PoolsQuery,
} from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { DEFAULT_NATIVE_ADDRESS } from 'uniswap/src/features/chains/evm/rpc'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { toGraphQLChain } from 'uniswap/src/features/chains/utils'

// ⬇️ adjust this path if your alias doesn't resolve
// import { registryClient, registryAddress, registryAbi } from '@/utils/registry'

const DEFAULT_QUERY_SIZE = 20

export function usePoolsFromTokenAddress({
  tokenAddress,
  sortState,
  chainId,
  isNative,
}: {
  tokenAddress: string
  sortState: PoolTableSortState
  chainId: UniverseChainId
  isNative?: boolean
}) {
  const chain = toGraphQLChain(chainId)

  const {
    loading: loadingV4,
    error: errorV4,
    data: dataV4,
    fetchMore: fetchMoreV4,
  } = useTopV4PoolsQuery({
    variables: {
      first: DEFAULT_QUERY_SIZE,
      tokenAddress: isNative ? DEFAULT_NATIVE_ADDRESS : tokenAddress,
      chain,
    },
  })

  const {
    loading: loadingV3,
    error: errorV3,
    data: dataV3,
    fetchMore: fetchMoreV3,
  } = useTopV3PoolsQuery({
    variables: {
      first: DEFAULT_QUERY_SIZE,
      tokenAddress,
      chain,
    },
  })

  const {
    loading: loadingV2,
    error: errorV2,
    data: dataV2,
    fetchMore: fetchMoreV2,
  } = useTopV2PairsQuery({
    variables: {
      first: DEFAULT_QUERY_SIZE,
      tokenAddress,
      chain,
    },
    skip: !chainId,
  })

  const loading = loadingV4 || loadingV3 || loadingV2
  const loadingMoreV4 = useRef(false)
  const loadingMoreV3 = useRef(false)
  const loadingMoreV2 = useRef(false)
  const sizeRef = useRef(DEFAULT_QUERY_SIZE)

  const loadMore = useCallback(
    ({ onComplete }: { onComplete?: () => void }) => {
      if (loadingMoreV4.current || loadingMoreV3.current || loadingMoreV2.current) {
        return
      }

      loadingMoreV4.current = true
      loadingMoreV3.current = true
      loadingMoreV2.current = true
      sizeRef.current += DEFAULT_QUERY_SIZE

      fetchMoreV4({
        variables: {
          cursor: dataV4?.topV4Pools?.[dataV4.topV4Pools.length - 1]?.totalLiquidity?.value,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!Object.keys(prev).length) {
            loadingMoreV4.current = false
            return prev
          }

          if (!loadingMoreV3.current && !loadingMoreV2.current) {
            onComplete?.()
          }

          const mergedData = {
            topV4Pools: [...(prev.topV4Pools ?? []), ...(fetchMoreResult.topV4Pools ?? [])],
          }

          loadingMoreV4.current = false
          return mergedData
        },
      })

      fetchMoreV3({
        variables: {
          cursor: dataV3?.topV3Pools?.[dataV3.topV3Pools.length - 1]?.totalLiquidity?.value,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!Object.keys(prev).length) {
            loadingMoreV3.current = false
            return prev
          }

          if (!loadingMoreV2.current && !loadingMoreV4.current) {
            onComplete?.()
          }

          const mergedData = {
            topV3Pools: [...(prev.topV3Pools ?? []), ...(fetchMoreResult.topV3Pools ?? [])],
          }

          loadingMoreV3.current = false
          return mergedData
        },
      })

      fetchMoreV2({
        variables: {
          cursor: dataV2?.topV2Pairs?.[dataV2.topV2Pairs.length - 1]?.totalLiquidity?.value,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!Object.keys(prev).length) {
            loadingMoreV2.current = false
            return prev
          }

          if (!loadingMoreV3.current && !loadingMoreV4.current) {
            onComplete?.()
          }

          const mergedData = {
            topV2Pairs: [...(prev.topV2Pairs ?? []), ...(fetchMoreResult.topV2Pairs ?? [])],
          }

          loadingMoreV2.current = false
          return mergedData
        },
      })
    },
    [dataV2?.topV2Pairs, dataV3?.topV3Pools, dataV4?.topV4Pools, fetchMoreV2, fetchMoreV3, fetchMoreV4],
  )

  // Build raw pools (Primea Phase 1: no TokenRegistry filter)
  const rawPools: TablePool[] = useMemo(() => {
    const topV4Pools: TablePool[] =
      dataV4?.topV4Pools?.map((pool) => ({
        hash: pool.poolId,
        token0: pool.token0,
        token1: pool.token1,
        tvl: pool.totalLiquidity?.value,
        volume24h: pool.volume24h?.value,
        volume30d: pool.volume30d?.value,
        volOverTvl: calculate1DVolOverTvl(pool.volume24h?.value, pool.totalLiquidity?.value),
        apr: calculateApr({
          volume24h: pool.volume24h?.value,
          tvl: pool.totalLiquidity?.value,
          feeTier: pool.feeTier,
        }),
        feeTier: pool.feeTier
          ? { feeAmount: pool.feeTier, tickSpacing: DEFAULT_TICK_SPACING, isDynamic: pool.isDynamicFee ?? false }
          : undefined,
        protocolVersion: pool.protocolVersion,
        hookAddress: pool.hook?.address,
      })) ?? []

    const topV3Pools: TablePool[] =
      dataV3?.topV3Pools?.map((pool) => ({
        hash: pool.address,
        token0: pool.token0,
        token1: pool.token1,
        tvl: pool.totalLiquidity?.value,
        volume24h: pool.volume24h?.value,
        volume30d: pool.volume30d?.value,
        volOverTvl: calculate1DVolOverTvl(pool.volume24h?.value, pool.totalLiquidity?.value),
        apr: calculateApr({
          volume24h: pool.volume24h?.value,
          tvl: pool.totalLiquidity?.value,
          feeTier: pool.feeTier,
        }),
        feeTier: pool.feeTier
          ? { feeAmount: pool.feeTier, tickSpacing: DEFAULT_TICK_SPACING, isDynamic: false }
          : undefined,
        protocolVersion: pool.protocolVersion,
      })) ?? []

    const topV2Pairs: TablePool[] =
      dataV2?.topV2Pairs?.map((pool) => ({
        hash: pool.address,
        token0: pool.token0,
        token1: pool.token1,
        tvl: pool.totalLiquidity?.value,
        volume24h: pool.volume24h?.value,
        volume30d: pool.volume30d?.value,
        volOverTvl: calculate1DVolOverTvl(pool.volume24h?.value, pool.totalLiquidity?.value),
        apr: calculateApr({
          volume24h: pool.volume24h?.value,
          tvl: pool.totalLiquidity?.value,
          feeTier: V2_DEFAULT_FEE_TIER,
        }),
        feeTier: { feeAmount: V2_DEFAULT_FEE_TIER, tickSpacing: DEFAULT_TICK_SPACING, isDynamic: false },
        protocolVersion: pool.protocolVersion,
      })) ?? []

    return sortPools([...topV4Pools, ...topV3Pools, ...topV2Pairs], sortState).slice(0, sizeRef.current)
  }, [dataV2?.topV2Pairs, dataV3?.topV3Pools, dataV4?.topV4Pools, sortState])

  // TokenRegistry whitelist filter (cached)
  // Primea Phase 1: no TokenRegistry deployed → do NOT filter pools.
  // const [verifiedPools, setVerifiedPools] = useState<TablePool[]>([])
  // useEffect(() => {
  //   let cancelled = false
  //   const cache = new Map<string, boolean>()
  //
  //   const toAddr = (a?: string) => (a?.toLowerCase() as `0x${string}` | undefined)
  //
  //   async function isWhitelisted(addr?: string): Promise<boolean> {
  //     if (!addr) return false
  //     if (cache.has(addr)) return cache.get(addr) as boolean
  //     try {
  //       const ok = await registryClient.readContract({
  //         address: registryAddress,
  //         abi: registryAbi,
  //         functionName: 'isWhitelisted',
  //         args: [addr as `0x${string}`],
  //       })
  //       cache.set(addr, Boolean(ok))
  //       return Boolean(ok)
  //     } catch {
  //       cache.set(addr, false)
  //       return false
  //     }
  //   }
  //
  //   async function run() {
  //     if (!rawPools?.length) {
  //       if (!cancelled) setVerifiedPools([])
  //       return
  //     }
  //     const checks = await Promise.all(
  //       rawPools.map(async (p) => {
  //         const t0 = toAddr(p.token0?.id ?? (p as any).token0?.address)
  //         const t1 = toAddr(p.token1?.id ?? (p as any).token1?.address)
  //         const [ok0, ok1] = await Promise.all([isWhitelisted(t0), isWhitelisted(t1)])
  //         return ok0 && ok1 ? p : null
  //       }),
  //     )
  //     if (!cancelled) setVerifiedPools(checks.filter(Boolean) as TablePool[])
  //   }
  //
  //   run()
  //   return () => {
  //     cancelled = true
  //   }
  // }, [rawPools])

  // Phase 1 output: raw pools (no registry filter)
  return { loading, errorV2, errorV3, errorV4, pools: rawPools, loadMore }
}
