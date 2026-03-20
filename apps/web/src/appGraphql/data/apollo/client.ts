import { ApolloClient, ApolloLink, HttpLink, Observable, from } from '@apollo/client'
import { setupSharedApolloCache } from 'uniswap/src/data/cache'
import { getDatadogApolloLink } from 'utilities/src/logger/datadog/datadogLink'

const API_URL = process.env.REACT_APP_AWS_API_ENDPOINT || null

if (!API_URL) {
  console.warn('[PrimeaNetwork] REACT_APP_AWS_API_ENDPOINT is not set. GraphQL portfolio queries will be disabled.')
}

const httpLink: ApolloLink = API_URL
  ? new HttpLink({ uri: API_URL })
  : new ApolloLink(() => new Observable((observer) => { observer.next({ data: {} }); observer.complete() }))

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
