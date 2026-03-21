import { ApolloClient, ApolloLink, HttpLink, Observable, from } from '@apollo/client'
import { setupSharedApolloCache } from 'uniswap/src/data/cache'
import { getDatadogApolloLink } from 'utilities/src/logger/datadog/datadogLink'

const API_URL = process.env.REACT_APP_AWS_API_ENDPOINT || null

if (!API_URL) {
  console.warn('[PrimeaNetwork] REACT_APP_AWS_API_ENDPOINT is not set. GraphQL portfolio queries will be disabled.')
}

// Primea: no subgraph — return null for each queried field by operation name
// to satisfy Apollo InMemoryCache schema validation (empty {} causes message:12 errors)
const primeaNoopLink = new ApolloLink((operation) =>
  new Observable((observer) => {
    const field = operation.operationName
      ? operation.operationName.charAt(0).toLowerCase() + operation.operationName.slice(1)
      : null
    const data = field ? { [field]: null } : {}
    observer.next({ data })
    observer.complete()
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
    },
  },
})
