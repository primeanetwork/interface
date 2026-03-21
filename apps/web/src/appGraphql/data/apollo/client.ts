import { ApolloClient, ApolloLink, HttpLink, Observable, from } from '@apollo/client'
import { setupSharedApolloCache } from 'uniswap/src/data/cache'
import { getDatadogApolloLink } from 'utilities/src/logger/datadog/datadogLink'

const API_URL = process.env.REACT_APP_AWS_API_ENDPOINT || null

if (!API_URL) {
  console.warn('[PrimeaNetwork] REACT_APP_AWS_API_ENDPOINT is not set. GraphQL portfolio queries will be disabled.')
}

// Primea: no subgraph — complete without writing anything to Apollo cache
// observer.next() causes schema validation errors regardless of shape returned;
// silently completing skips cache write entirely and produces no errors
const primeaNoopLink = new ApolloLink(() =>
  new Observable((observer) => {
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
