import { ApolloClient, HttpLink, from } from '@apollo/client'
import { setupSharedApolloCache } from 'uniswap/src/data/cache'
import { getDatadogApolloLink } from 'utilities/src/logger/datadog/datadogLink'

const API_URL = process.env.REACT_APP_AWS_API_ENDPOINT

// API_URL may be absent during local dev or when self-hosting without a subgraph.
// The app will still function — queries will simply return no data until a subgraph is configured.
if (!API_URL) {
  console.warn('[PrimeaNetwork] REACT_APP_AWS_API_ENDPOINT is not set. GraphQL portfolio queries will be disabled.')
}

const httpLink = new HttpLink({ uri: API_URL ?? '' })
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
