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

export function StatsigProviderWrapper({
  children,
  options,
  user,
  storageProvider,
  onInit,
}: StatsigProviderWrapperProps): ReactNode {
  if (!config.statsigApiKey) {
    // Primea phase 1 runs without external feature-flagging. If the key is missing,
    // render the app without Statsig instead of crashing and without triggering network calls.
    return <>{children}</>
  }

  const statsigOptions: StatsigOptions = {
    ...statsigBaseConfig,
    storageProvider,
    ...options,
  }

  const { client, isLoading: isStatsigLoading } = useClientAsyncInit(config.statsigApiKey, user, statsigOptions)

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
