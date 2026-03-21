import { config } from 'uniswap/src/config'
import { FeatureFlags, getFeatureFlagName } from 'uniswap/src/features/gating/flags'
import { getStatsigClient } from 'uniswap/src/features/gating/sdk/statsig'

export function isInstantTokenBalanceUpdateEnabled(): boolean {
  if (!config.statsigApiKey) {
    return false
  }
  return getStatsigClient().checkGate(getFeatureFlagName(FeatureFlags.InstantTokenBalanceUpdate))
}
