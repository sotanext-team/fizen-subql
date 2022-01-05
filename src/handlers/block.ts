import { SubstrateBlock } from '@subql/types'
import { getBlockTimestamp } from '../utils/getBlockTimestamp'
import { Block } from '../types/models'
import {initSystemTokens} from "./tokens";
import {initSystemConsts} from "./system";

export async function ensureBlock (block: SubstrateBlock) {
  const recordId = block.block.hash?.toString()
  let data = await Block.get(recordId)
  if (!data) {
    data = new Block(recordId)
    await data.save()
  }
  return data
}

let isFirstSync = true
export async function createBlock (origin: SubstrateBlock) {
  if (isFirstSync) {
    await initSystemTokens()
    await initSystemConsts()
    isFirstSync = false
  }
  const block = await ensureBlock(origin)
  const blockNumber = origin.block.header.number.toBigInt() || BigInt(0)
  const parentHash = origin.block.header.parentHash?.toString()
  const stateRoot = origin.block.header.stateRoot?.toString()
  const specVersion = origin.specVersion?.toString()
  const extrinsicsRoot = origin.block.header.extrinsicsRoot?.toString()
  const timestamp = getBlockTimestamp(origin.block)

  block.number = blockNumber
  block.parentHash = parentHash
  block.stateRoot = stateRoot
  block.extrinsicRoot = extrinsicsRoot
  block.specVersion = specVersion
  block.timestamp = timestamp
  await block.save()

  return block
}
