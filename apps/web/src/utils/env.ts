import { isBetaEnv, isProdEnv } from 'utilities/src/environment/env'

function isAppPrimeaOrg({ hostname }: { hostname: string }): boolean {
  return hostname === 'app.primeanetwork.com'
}

function isAppPrimeaStagingOrg({ hostname }: { hostname: string }): boolean {
  return hostname === 'staging.primeanetwork.com'
}

export function isBrowserRouterEnabled(): boolean {
  if (isProdEnv()) {
    if (
      isAppPrimeaOrg(window.location) ||
      isAppPrimeaStagingOrg(window.location) ||
      isLocalhost(window.location)
    ) {
      return true
    }
    return false
  }
  return true
}

function isLocalhost({ hostname }: { hostname: string }): boolean {
  return hostname === 'localhost'
}

export function isRemoteReportingEnabled(): boolean {
  if (isBetaEnv() && !isAppPrimeaStagingOrg(window.location)) {
    return false
  }
  if (isProdEnv() && !isAppPrimeaOrg(window.location)) {
    return false
  }
  return process.env.REACT_APP_ANALYTICS_ENABLED === 'true'
}
