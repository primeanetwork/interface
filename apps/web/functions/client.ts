import { ApolloClient, ApolloLink, InMemoryCache, Observable } from '@apollo/client'

// Primea: stubbed — no Uniswap subgraph available for Primea chain
export default new ApolloClient({
  connectToDevTools: false,
  link: new ApolloLink(() => new Observable((observer) => {
    observer.next({ data: {} })
    observer.complete()
  })),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
    },
  },
})
