// apps/web/src/utils/registry.ts
import type { Abi } from 'viem'
// import { createPublicClient, http } from 'viem'
// import { primea } from 'uniswap/src/features/chains/evm/info/primea'
// import addresses from 'primea-protocol-meta/addresses/primea.addresses.json'

/**
 * Primea Phase 1 (Primea-only):
 * - You do NOT have TokenRegistry deployed.
 * - Therefore registry must be a SAFE NO-OP.
 * - Keep exports so other code doesn't break, but do not call chain / do not use 0x0 addresses.
 */

// Primea-only stub (no registry deployed)
// const addresses = {
//   networks: {
//     '698369': {
//       tokenRegistry: '0x0000000000000000000000000000000000000000',
//     },
//   },
// } as const

// export const registryAddress = addresses.networks['698369']?.tokenRegistry
export const registryAddress: `0x${string}` | undefined = undefined

// Keep ABI export so imports stay stable.
// export const registryAbi = [ ... ]
export const registryAbi: Abi = [
  {
    inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
    name: 'isWhitelisted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// No client in Phase 1
// export const registryClient = createPublicClient({
//   chain: primea,
//   transport: http('https://rpc.primeanetwork.com'),
// })
export const registryClient = null as const
