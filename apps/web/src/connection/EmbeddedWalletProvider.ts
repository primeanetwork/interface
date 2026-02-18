import { getEmbeddedWalletState, setChainId } from 'state/embeddedWallet/store'
import { getChainInfo } from 'uniswap/src/features/chains/chainInfo'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import {
  signMessagesWithPasskey,
  signTransactionsWithPasskey,
  signTypedDataWithPasskey,
} from 'uniswap/src/features/passkey/embeddedWallet'
import { HexString, isValidHexString } from 'uniswap/src/utils/hex'
import { isAddress } from 'utilities/src/addresses/index'
import { logger } from 'utilities/src/logger/logger'
import { Account, Hash, SignableMessage, createPublicClient, fallback, http } from 'viem'

export type Listener = (payload: any) => void

type RequestArgs = {
  method: string
  params?: any[]
}

// JSON.stringify does not handle BigInts, so we need to convert them to strings
const safeJSONStringify = (param: any): any => {
  return JSON.stringify(
    param,
    (_, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
  )
}

const NoWalletFoundError = new Error('Attempted embedded wallet function with no embedded wallet connected')

export class EmbeddedWalletProvider {
  listeners: Map<string, Set<Listener>>
  chainId: UniverseChainId
  publicClient?: ReturnType<typeof createPublicClient>
  static _instance: EmbeddedWalletProvider | undefined

  private constructor() {
    this.listeners = new Map()
    const { chainId } = getEmbeddedWalletState()
    this.chainId = (chainId ?? 1) as UniverseChainId
    this.publicClient = undefined
  }

  public static getInstance(): EmbeddedWalletProvider {
    if (!this._instance) {
      this._instance = new EmbeddedWalletProvider()
    }
    return this._instance
  }

  // ---------- helpers ----------

  private toHex(value: number | bigint): HexString {
    const v = typeof value === 'bigint' ? value : BigInt(value)
    return (`0x${v.toString(16)}` as unknown) as HexString
  }

  private parseHexQuantityToBigInt(input: any): bigint | undefined {
    if (typeof input === 'bigint') return input
    if (typeof input === 'number' && Number.isFinite(input)) return BigInt(input)
    if (typeof input === 'string') {
      if (input === 'latest') return undefined
      if (input.startsWith('0x') || input.startsWith('0X')) {
        try {
          return BigInt(input)
        } catch {
          return undefined
        }
      }
      // numeric string fallback
      const n = Number(input)
      if (!Number.isNaN(n) && Number.isFinite(n)) return BigInt(n)
    }
    return undefined
  }

  private parseChainId(input: any): UniverseChainId {
    if (typeof input === 'string') {
      if (input.startsWith('0x') || input.startsWith('0X')) return Number(BigInt(input)) as UniverseChainId
      const n = Number(input)
      if (!Number.isNaN(n) && Number.isFinite(n)) return n as UniverseChainId
    }
    if (typeof input === 'number' && Number.isFinite(input)) return input as UniverseChainId
    if (typeof input === 'bigint') return Number(input) as UniverseChainId
    return this.chainId
  }

  private getPublicClient(chainId: UniverseChainId) {
    const chainInfo = getChainInfo(chainId)

    if (!this.publicClient || this.publicClient.chain !== chainInfo) {
      const rpcUrls = chainInfo.rpcUrls
      const fallbackTransports = rpcUrls.fallback?.http.map((url) => http(url)) ?? []

      this.publicClient = createPublicClient({
        chain: chainInfo,
        transport: fallback([
          http(rpcUrls.public?.http[0]),
          http(rpcUrls.default.http[0]),
          ...fallbackTransports,
        ]),
      })
    }

    return this.publicClient
  }

  // ---------- EIP-1193-ish provider surface ----------

  async request(args: RequestArgs) {
    switch (args.method) {
      case 'eth_call':
        return this.call(args.params)
      case 'eth_estimateGas':
        return this.estimateGas(args.params)

      case 'eth_accounts':
        return this.getAccounts()

      case 'eth_sendTransaction':
        return this.sendTransaction(args.params)

      case 'eth_chainId':
        return this.getChainIdHex()

      case 'eth_blockNumber':
        return this.getBlockNumberHex()

      case 'eth_getBlockByNumber':
        // params: [ blockTag, includeTransactions ]
        return this.getBlockByNumber(args.params?.[0], args.params?.[1])

      case 'eth_getTransactionByHash':
        return this.getTransactionByHash(args.params?.[0])

      case 'eth_getTransactionReceipt':
        return this.getTransactionReceipt(args.params?.[0])

      case 'wallet_switchEthereumChain': {
        // params: [{ chainId: "0x..." }]
        const next = this.parseChainId(args.params?.[0]?.chainId)
        this.updateChainId(next)
        // EIP-1193: resolve null on success
        return null
      }

      case 'personal_sign':
        return this.signMessage(args)

      case 'eth_sign':
        return this.sign(args)

      case 'eth_signTypedData_v4':
        return this.signTypedData(args)

      case 'eth_getCode':
        return this.getCode(args)

      default: {
        logger.error(NoWalletFoundError, {
          tags: { file: 'EmbeddedWalletProvider.ts', function: 'request' },
        })
        throw NoWalletFoundError
      }
    }
  }

  on(event: string, listener: Listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener)
  }

  removeListener(event: string, listener: Listener) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(listener)
    }
  }

  off(event: string, listener: Listener) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(listener)
    }
  }

  emit(event: string, payload: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((listener) => listener(payload))
    }
  }

  connect(chainId?: number) {
    this.chainId = ((chainId ?? 1) as unknown) as UniverseChainId
    setChainId(chainId ?? null)
    // EIP-1193 connect event uses hex chainId
    this.emit('connect', { chainId: this.getChainIdHex() })
  }

  disconnect(error: any) {
    this.emit('disconnect', error)
  }

  // ---------- wallet/account ----------

  getAccount() {
    const { walletAddress } = getEmbeddedWalletState()
    const address = isAddress(walletAddress) || undefined

    if (!address) {
      logger.debug('EmbeddedWalletProvider.ts', 'getAccount', 'No embedded wallet connected')
      return undefined
    }

    const signMessage = async ({ message }: { message: SignableMessage }): Promise<HexString> => {
      try {
        const signedMessages = await signMessagesWithPasskey([message.toString()], address)
        const signedMessage = signedMessages?.[0]
        if (!signedMessage || !isValidHexString(signedMessage)) {
          throw new Error(`Invalid signed message: ${signedMessage}`)
        }
        return signedMessage
      } catch (e: any) {
        logger.error(e, {
          tags: { file: 'EmbeddedWalletProvider.ts', function: 'signMessage' },
        })
        throw e
      }
    }

    const signTransaction = async (transaction: any): Promise<HexString> => {
      try {
        const signedTransactions = await signTransactionsWithPasskey([safeJSONStringify(transaction)], address)
        const signedTransaction = signedTransactions?.[0]
        if (!signedTransaction || !isValidHexString(signedTransaction)) {
          throw new Error(`Invalid signed transaction: ${signedTransaction}`)
        }
        return signedTransaction
      } catch (e: any) {
        logger.error(e, {
          tags: { file: 'EmbeddedWalletProvider.ts', function: 'signTransaction' },
        })
        throw e
      }
    }

    const signTypedData = async (typedData: any): Promise<HexString> => {
      try {
        const signedTypedData = await signTypedDataWithPasskey([safeJSONStringify(typedData)], address)
        const signature = signedTypedData?.[0]
        if (!signature || !isValidHexString(signature)) {
          throw new Error(`Invalid signature: ${signature}`)
        }
        return signature
      } catch (e: any) {
        logger.error(e, {
          tags: { file: 'EmbeddedWalletProvider.ts', function: 'signTypedData' },
        })
        throw e
      }
    }

    const account: Account = {
      address,
      signMessage,
      signTransaction,
      signTypedData,
      publicKey: address,
      source: 'custom',
      type: 'local',
    }

    return account
  }

  // ---------- RPC method implementations ----------

  async estimateGas(params: any) {
    const account = this.getAccount()
    if (!account) {
      const error = new Error('Attempted embedded wallet function with no embedded wallet connected')
      logger.error(error, {
        tags: { file: 'EmbeddedWalletProvider.ts', function: 'estimateGas' },
      })
      throw error
    }

    const client = this.getPublicClient(this.chainId)
    const data = await client.estimateGas({
      ...params[0],
      account: account.address,
      value: BigInt(params[0].value ?? 0),
    })
    return data
  }

  async call(params: any) {
    const client = this.getPublicClient(this.chainId)

    // JSON-RPC eth_call second param can be "latest" or hex quantity
    let blockNumber: bigint | undefined = this.parseHexQuantityToBigInt(params?.[1])
    if (params?.[1] === 'latest' || typeof blockNumber === 'undefined') {
      // let viem default to latest if undefined
      blockNumber = undefined
    }

    const { data } = await client.call({
      ...params[0],
      blockNumber,
    })

    return data
  }

  async getAccounts() {
    const account = this.getAccount()
    return account?.address ? [account.address] : []
  }

  async sendTransaction(transactions: any) {
    try {
      const account = this.getAccount()
      if (!account) {
        logger.error(NoWalletFoundError, {
          tags: { file: 'EmbeddedWalletProvider.ts', function: 'sendTransaction' },
        })
        throw NoWalletFoundError
      }

      const publicClient = this.getPublicClient(this.chainId)

      const [currentGasData, nonce] = await Promise.all([
        publicClient.estimateFeesPerGas({ chain: getChainInfo(this.chainId) }),
        publicClient.getTransactionCount({ address: account.address }),
      ])

      const tx = {
        ...transactions[0],
        gas: (BigInt(Number(transactions[0].gas ?? 0)) * BigInt(12)) / BigInt(10), // +20% buffer
        value: BigInt(transactions[0].value ?? 0),
        chainId: this.chainId,
        maxFeePerGas: BigInt(transactions[0].maxFeePerGas ?? currentGasData.maxFeePerGas),
        maxPriorityFeePerGas: BigInt(transactions[0].maxPriorityFeePerGas ?? currentGasData.maxPriorityFeePerGas),
        nonce: transactions[0].nonce ?? nonce,
      }

      const signedTx = await account.signTransaction(tx)
      const txHash = await publicClient.sendRawTransaction({ serializedTransaction: signedTx })
      return txHash
    } catch (e: any) {
      logger.debug('EmbeddedWalletProvider.ts', 'sendTransaction', e, transactions)
      return undefined
    }
  }

  updateChainId(chainId: UniverseChainId) {
    this.chainId = chainId
    localStorage.setItem('embeddedUniswapWallet.chainId', `${chainId}`)

    // EIP-1193 expects hex string chainId for chainChanged
    this.emit('chainChanged', this.getChainIdHex())
  }

  getChainIdHex() {
    return this.toHex(this.chainId)
  }

  async getCode(args: RequestArgs) {
    const client = this.getPublicClient(this.chainId)
    const data = await client.getBytecode({
      address: args.params?.[0],
    })
    return data
  }

  async getBlockNumber() {
    const client = this.getPublicClient(this.chainId)
    return await client.getBlockNumber()
  }

  async getBlockNumberHex() {
    const bn = await this.getBlockNumber()
    return this.toHex(bn)
  }

  async getBlockByNumber(blockTagOrHex?: any, includeTransactions?: any) {
    const client = this.getPublicClient(this.chainId)
    const withTxs = Boolean(includeTransactions)

    if (!blockTagOrHex || blockTagOrHex === 'latest') {
      return await client.getBlock({ includeTransactions: withTxs })
    }

    const bn = this.parseHexQuantityToBigInt(blockTagOrHex)
    if (typeof bn !== 'undefined') {
      return await client.getBlock({ blockNumber: bn, includeTransactions: withTxs })
    }

    // Fallback to latest
    return await client.getBlock({ includeTransactions: withTxs })
  }

  async getTransactionByHash(hash: Hash) {
    const client = this.getPublicClient(this.chainId)

    try {
      const rest = await client.getTransaction({ hash })
      // fixes a type mismatch where type was expected to be a BigNumber
      return { ...rest, type: rest.typeHex }
    } catch (e: any) {
      if (e.name === 'TransactionNotFoundError') {
        return null
      }
      logger.error(e, {
        tags: { file: 'EmbeddedWalletProvider.ts', function: 'getTransactionByHash' },
      })
      throw e
    }
  }

  async getTransactionReceipt(hash: Hash) {
    const client = this.getPublicClient(this.chainId)

    try {
      const { ...rest } = await client.getTransactionReceipt({ hash })
      return rest
    } catch (e: any) {
      if (e.name === 'TransactionNotFoundError') {
        return null
      }
      logger.error(e, {
        tags: { file: 'EmbeddedWalletProvider.ts', function: 'getTransactionReceipt' },
      })
      throw e
    }
  }

  async signMessage(args: RequestArgs) {
    const account = this.getAccount()
    if (!account) {
      logger.error(NoWalletFoundError, {
        tags: { file: 'EmbeddedWalletProvider.ts', function: 'signMessage' },
      })
      throw NoWalletFoundError
    }

    // personal_sign params are typically [message, address]
    return await account.signMessage({ message: args.params?.[0] })
  }

  async sign(args: RequestArgs) {
    const account = this.getAccount()
    if (!account) {
      logger.error(NoWalletFoundError, {
        tags: { file: 'EmbeddedWalletProvider.ts', function: 'sign' },
      })
      throw NoWalletFoundError
    }

    // eth_sign params are typically [address, message]
    // Your previous code used signMessage directly; keep consistent but pick message param safely.
    const msg = args.params?.[1] ?? args.params?.[0]
    return await account.signMessage({ message: msg })
  }

  async signTypedData(args: RequestArgs) {
    const account = this.getAccount()
    if (!account) {
      logger.error(NoWalletFoundError, {
        tags: { file: 'EmbeddedWalletProvider.ts', function: 'signTypedData' },
      })
      throw NoWalletFoundError
    }

    if (!args.params) {
      throw new Error('Missing params')
    }

    // common eth_signTypedData_v4 params: [address, jsonString]
    const typedDataJson = args.params?.[1]
    if (!typedDataJson) {
      throw new Error('Missing typed data')
    }

    return await account.signTypedData(JSON.parse(typedDataJson))
  }
}

export const embeddedWalletProvider = EmbeddedWalletProvider.getInstance()
