import { ApolloClient, ApolloLink, HttpLink, Observable, from } from '@apollo/client'
import { setupSharedApolloCache } from 'uniswap/src/data/cache'
import { getDatadogApolloLink } from 'utilities/src/logger/datadog/datadogLink'

const API_URL = process.env.REACT_APP_AWS_API_ENDPOINT || null

if (!API_URL) {
  console.warn('[PrimeaNetwork] REACT_APP_AWS_API_ENDPOINT is not set. GraphQL portfolio queries will be disabled.')
}

// Primea: Apollo 3.10 requires next() before complete() — it calls toQueryResult()
// on the last value unconditionally. We must emit errors instead of data so Apollo
// marks queries as errored (safe) rather than crashing on undefined.data
const primeaNoopLink = new ApolloLink((operation) =>
  new Observable((observer) => {
    observer.error(new Error(`[PrimeaNetwork] No subgraph for operation: ${operation.operationName}`))
  })
)

const httpLink: ApolloLink = API_URL
  ? new HttpLink({ uri: API_URL })
  : primeaNoopLink

const datadogLink = getDatadogApolloLink()

export const apolloClient = new ApolloClient({
  connectToDevTools: true,
  link: from([datadogLink, httpLink]),
  headers: {
    'Content-Type': 'application/json',
    Origin: 'https://app.primeanetwork.com',
  },
  cache: setupSharedApolloCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
    },
  },
})
