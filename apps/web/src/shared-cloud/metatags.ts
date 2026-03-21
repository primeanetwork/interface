export type MetaTagInjectorInput = {
  title: string
  image?: string
  url: string
  description?: string
}

export function formatTokenMetatagTitleName(symbol: string | undefined, name: string | undefined) {
  if (symbol) {
    return 'Get ' + symbol + ' on PrimeaNetwork'
  }
  if (name) {
    return 'Get ' + name + ' on PrimeaNetwork'
  }
  return 'View Token on PrimeaNetwork'
}
