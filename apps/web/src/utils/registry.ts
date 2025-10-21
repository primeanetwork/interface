// apps/web/src/utils/registry.ts
import { createPublicClient, http } from 'viem'
import { primea } from 'uniswap/src/features/chains/evm/info/primea'
import addresses from 'primea-protocol-meta/addresses/primea.addresses.json'

// the TokenRegistry contract address from your meta repo
export const registryAddress = addresses.networks['698369'].tokenRegistry

// minimal ABI for the function we need
export const registryAbi = [
  {
    inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
    name: 'isWhitelisted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
]

// viem client for read-only calls to Primea mainnet
export const registryClient = createPublicClient({
  chain: primea,
  transport: http('https://rpc.primeanetwork.com'),
})
