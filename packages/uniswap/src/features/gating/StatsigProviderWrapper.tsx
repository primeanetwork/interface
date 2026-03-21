import { ReactNode, useEffect } from 'react'
import { config } from 'uniswap/src/config'
import {
  StatsigOptions,
  StatsigProvider,
  StatsigUser,
  StorageProvider,
  useClientAsyncInit,
} from 'uniswap/src/features/gating/sdk/statsig'
import { statsigBaseConfig } from 'uniswap/src/features/gating/statsigBaseConfig'
import { logger } from 'utilities/src/logger/logger'

type StatsigProviderWrapperProps = {
  user: StatsigUser
  children: ReactNode
  onInit?: () => void
  options?: Partial<StatsigUser>
  storageProvider?: StorageProvider
}

const OFFLINE_STATSIG_SDK_KEY = 'client-primea-offline'

export function StatsigProviderWrapper({
  children,
  options,
  user,
  storageProvider,
  onInit,
}: StatsigProviderWrapperProps): ReactNode {
  // Primea / no-key builds: hooks still require a StatsigClient in context. Use a placeholder key and
  // preventAllNetworkTraffic so we never hit gating.interface.gateway.uniswap.org (CSP / independence).
  const sdkKey = config.statsigApiKey || OFFLINE_STATSIG_SDK_KEY
  const offlineStatsig = !config.statsigApiKey

  const statsigOptions: StatsigOptions = {
    ...statsigBaseConfig,
    storageProvider,
    networkConfig: {
      ...statsigBaseConfig.networkConfig,
      ...(offlineStatsig ? { preventAllNetworkTraffic: true } : {}),
    },
    ...options,
  }

  const { client, isLoading: isStatsigLoading } = useClientAsyncInit(sdkKey, user, statsigOptions)

  useEffect(() => {
    if (isStatsigLoading) {
      return
    }

    onInit?.()
  }, [isStatsigLoading, onInit])

  useEffect(() => {
    const errorHandler = (event: unknown): void => {
      logger.error('StatsigProviderWrapper', {
        tags: { file: 'StatsigProviderWrapper', function: 'error' },
        extra: {
          event,
        },
      })
    }
    client.on('error', errorHandler)
    client.on('initialization_failure', errorHandler)
    return () => {
      client.off('error', errorHandler)
      client.off('initialization_failure', errorHandler)
    }
  }, [client])

  return <StatsigProvider client={client}>{children}</StatsigProvider>
}
