import { ApolloClient, ApolloLink, HttpLink, from } from '@apollo/client'
import { setupSharedApolloCache } from 'uniswap/src/data/cache'
import { getDatadogApolloLink } from 'utilities/src/logger/datadog/datadogLink'

const API_URL = process.env.REACT_APP_AWS_API_ENDPOINT || null

if (!API_URL) {
  console.warn('[PrimeaNetwork] REACT_APP_AWS_API_ENDPOINT is not set. GraphQL portfolio queries will be disabled.')
}

// Primea: no subgraph — return errors so Apollo skips cache write entirely
// Using error termination prevents both the schema-validation crash (message:12)
// and the undefined-data crash from complete()-without-next()
const primeaNoopLink = new ApolloLink((operation, forward) => {
  if (forward) return forward(operation)
  return null
})

const httpLink: ApolloLink = API_URL
  ? new HttpLink({ uri: API_URL })
  : ApolloLink.empty()

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
