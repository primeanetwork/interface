// packages/uniswap/src/config.ts

/**
 * Primea Phase 1 goals for WEB:
 * - Primea-only (698369)
 * - No Uniswap Trading API / Metrics proxy / Uniswap APIs
 * - No Infura/Alchemy/Quicknode usage
 *
 * IMPORTANT: `react-native-dotenv` pulls Node deps (fs) and breaks Vite/web runtime.
 * For Phase 1 web independence, we do NOT import it here.
 */

// eslint-disable-next-line @typescript-eslint/no-restricted-imports
// import {
//   ALCHEMY_API_KEY,
//   AMPLITUDE_PROXY_URL_OVERRIDE,
//   API_BASE_URL_OVERRIDE,
//   API_BASE_URL_V2_OVERRIDE,
//   APPSFLYER_API_KEY,
//   APPSFLYER_APP_ID,
//   DATADOG_CLIENT_TOKEN,
//   DATADOG_PROJECT_ID,
//   FOR_API_URL_OVERRIDE,
//   GRAPHQL_URL_OVERRIDE,
//   INCLUDE_PROTOTYPE_FEATURES,
//   INFURA_KEY,
//   IS_E2E_TEST,
//   ONESIGNAL_APP_ID,
//   QUICKNODE_ENDPOINT_NAME,
//   QUICKNODE_ENDPOINT_TOKEN,
//   SCANTASTIC_API_URL_OVERRIDE,
//   STATSIG_API_KEY,
//   STATSIG_PROXY_URL_OVERRIDE,
//   TRADING_API_KEY,
//   TRADING_API_URL_OVERRIDE,
//   UNISWAP_API_KEY,
//   UNITAGS_API_URL_OVERRIDE,
//   WALLETCONNECT_PROJECT_ID,
//   WALLETCONNECT_PROJECT_ID_BETA,
//   WALLETCONNECT_PROJECT_ID_DEV,
// } from 'react-native-dotenv'

import { isNonTestDev } from 'utilities/src/environment/constants'

/**
 * Primea Phase 1:
 * - Primea-only (698369)
 * - No Uniswap Trading API
 * - No Uniswap Metrics/Amplitude proxy
 * - No Infura/Alchemy/Quicknode usage
 *
 * Hard toggle so the app cannot accidentally hit Uniswap/Ethereum infra.
 */
const PRIMEA_PHASE1 = true

/**
 * Naming requirements for different environments:
 * - Web ENV vars: must have process.env.REACT_APP_<var_name>
 * - Extension ENV vars: must have process.env.<var_name>
 * - Mobile ENV vars: must have BOTH process.env.<var_name> and <var_name>
 *
 * NOTE (Phase 1 web): we ONLY read process.env, no react-native-dotenv.
 */

export interface Config {
  alchemyApiKey: string
  amplitudeProxyUrlOverride: string
  apiBaseUrlOverride: string
  apiBaseUrlV2Override: string
  appsflyerApiKey: string
  appsflyerAppId: string
  datadogClientToken: string
  datadogProjectId: string
  isE2ETest: boolean
  forApiUrlOverride: string
  graphqlUrlOverride: string
  includePrototypeFeatures: string
  infuraKey: string
  onesignalAppId: string
  quicknodeEndpointName: string
  quicknodeEndpointToken: string
  scantasticApiUrlOverride: string
  statsigProxyUrlOverride: string
  statsigApiKey: string
  tradingApiKey: string
  tradingApiUrlOverride: string
  tradingApiWebTestEnv: string
  uniswapApiKey: string
  unitagsApiUrlOverride: string
  walletConnectProjectId: string
  walletConnectProjectIdBeta: string
  walletConnectProjectIdDev: string
}

const _config: Config = {
  // alchemyApiKey: process.env.REACT_APP_ALCHEMY_API_KEY || process.env.ALCHEMY_API_KEY || ALCHEMY_API_KEY,
  alchemyApiKey: PRIMEA_PHASE1 ? '' : process.env.REACT_APP_ALCHEMY_API_KEY || process.env.ALCHEMY_API_KEY || '',

  // amplitudeProxyUrlOverride: process.env.AMPLITUDE_PROXY_URL_OVERRIDE || AMPLITUDE_PROXY_URL_OVERRIDE,
  amplitudeProxyUrlOverride: 'https://api2.amplitude.com/2/httpapi',

  // apiBaseUrlOverride: process.env.API_BASE_URL_OVERRIDE || API_BASE_URL_OVERRIDE,
  // NOTE: Keep as-is; you may point this to YOUR own API later.
  apiBaseUrlOverride: process.env.API_BASE_URL_OVERRIDE || '',

  // apiBaseUrlV2Override: process.env.API_BASE_URL_V2_OVERRIDE || API_BASE_URL_V2_OVERRIDE,
  apiBaseUrlV2Override: process.env.API_BASE_URL_V2_OVERRIDE || '',

  // appsflyerApiKey: process.env.APPSFLYER_API_KEY || APPSFLYER_API_KEY,
  appsflyerApiKey: process.env.APPSFLYER_API_KEY || '',

  // appsflyerAppId: process.env.APPSFLYER_APP_ID || APPSFLYER_APP_ID,
  appsflyerAppId: process.env.APPSFLYER_APP_ID || '',

  datadogClientToken: process.env.REACT_APP_DATADOG_CLIENT_TOKEN || process.env.DATADOG_CLIENT_TOKEN || '',
  datadogProjectId: process.env.REACT_APP_DATADOG_PROJECT_ID || process.env.DATADOG_PROJECT_ID || '',

  // isE2ETest: process.env.IS_E2E_TEST?.toLowerCase() === 'true' || IS_E2E_TEST?.toLowerCase() === 'true',
  isE2ETest: process.env.IS_E2E_TEST?.toLowerCase() === 'true',

  // forApiUrlOverride: process.env.FOR_API_URL_OVERRIDE || FOR_API_URL_OVERRIDE,
  forApiUrlOverride: process.env.FOR_API_URL_OVERRIDE || '',

  // graphqlUrlOverride: process.env.GRAPHQL_URL_OVERRIDE || GRAPHQL_URL_OVERRIDE,
  // IMPORTANT: Primea is not on Uniswap Data API; keep blank to prevent GraphQL calls.
  graphqlUrlOverride: PRIMEA_PHASE1 ? '' : process.env.GRAPHQL_URL_OVERRIDE || '',

  // includePrototypeFeatures: process.env.INCLUDE_PROTOTYPE_FEATURES || INCLUDE_PROTOTYPE_FEATURES,
  includePrototypeFeatures: process.env.INCLUDE_PROTOTYPE_FEATURES || '',

  // onesignalAppId: process.env.ONESIGNAL_APP_ID || ONESIGNAL_APP_ID,
  onesignalAppId: process.env.ONESIGNAL_APP_ID || '',

  // quicknodeEndpointName:
  //   process.env.REACT_APP_QUICKNODE_ENDPOINT_NAME || process.env.QUICKNODE_ENDPOINT_NAME || QUICKNODE_ENDPOINT_NAME,
  quicknodeEndpointName: PRIMEA_PHASE1
    ? ''
    : process.env.REACT_APP_QUICKNODE_ENDPOINT_NAME || process.env.QUICKNODE_ENDPOINT_NAME || '',

  // quicknodeEndpointToken:
  //   process.env.REACT_APP_QUICKNODE_ENDPOINT_TOKEN || process.env.QUICKNODE_ENDPOINT_TOKEN || QUICKNODE_ENDPOINT_TOKEN,
  quicknodeEndpointToken: PRIMEA_PHASE1
    ? ''
    : process.env.REACT_APP_QUICKNODE_ENDPOINT_TOKEN || process.env.QUICKNODE_ENDPOINT_TOKEN || '',

  // scantasticApiUrlOverride: process.env.SCANTASTIC_API_URL_OVERRIDE || SCANTASTIC_API_URL_OVERRIDE,
  scantasticApiUrlOverride: process.env.SCANTASTIC_API_URL_OVERRIDE || '',

  // statsigApiKey: process.env.REACT_APP_STATSIG_API_KEY || process.env.STATSIG_API_KEY || STATSIG_API_KEY,
  statsigApiKey: process.env.REACT_APP_STATSIG_API_KEY || process.env.STATSIG_API_KEY || '',

  // statsigProxyUrlOverride: process.env.STATSIG_PROXY_URL_OVERRIDE || STATSIG_PROXY_URL_OVERRIDE,
  statsigProxyUrlOverride: process.env.STATSIG_PROXY_URL_OVERRIDE || '',

  // infuraKey: process.env.REACT_APP_INFURA_KEY || INFURA_KEY,
  infuraKey: PRIMEA_PHASE1 ? '' : process.env.REACT_APP_INFURA_KEY || '',

  // tradingApiKey: process.env.REACT_APP_TRADING_API_KEY || process.env.TRADING_API_KEY || TRADING_API_KEY,
  tradingApiKey: PRIMEA_PHASE1 ? '' : process.env.REACT_APP_TRADING_API_KEY || process.env.TRADING_API_KEY || '',

  // tradingApiUrlOverride:
  //   process.env.REACT_APP_TRADING_API_URL_OVERRIDE || process.env.TRADING_API_URL_OVERRIDE || TRADING_API_URL_OVERRIDE,
  // IMPORTANT: blank override to prevent any Uniswap Trading API routing/quotes.
  tradingApiUrlOverride: PRIMEA_PHASE1
    ? ''
    : process.env.REACT_APP_TRADING_API_URL_OVERRIDE || process.env.TRADING_API_URL_OVERRIDE || '',

  tradingApiWebTestEnv: process.env.REACT_APP_TRADING_API_TEST_ENV || '',

  // uniswapApiKey: process.env.UNISWAP_API_KEY || UNISWAP_API_KEY,
  uniswapApiKey: PRIMEA_PHASE1 ? '' : process.env.UNISWAP_API_KEY || '',

  // unitagsApiUrlOverride: process.env.UNITAGS_API_URL_OVERRIDE || UNITAGS_API_URL_OVERRIDE,
  unitagsApiUrlOverride: process.env.UNITAGS_API_URL_OVERRIDE || '',

  walletConnectProjectId:
    process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || process.env.WALLETCONNECT_PROJECT_ID || '',
  walletConnectProjectIdBeta: process.env.WALLETCONNECT_PROJECT_ID_BETA || '',
  walletConnectProjectIdDev: process.env.WALLETCONNECT_PROJECT_ID_DEV || '',
}

export const config = Object.freeze(_config)

if (isNonTestDev) {
  // Cannot use logger here, causes error from circular dep
  // eslint-disable-next-line no-console
  console.debug('Using app config:', config)
}
