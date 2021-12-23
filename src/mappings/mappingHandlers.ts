import { SubstrateBlock, SubstrateExtrinsic, SubstrateEvent } from '@subql/types'
import { createBlock } from '../handlers/block';
import {createEvent} from "../handlers/event";
import {createExtrinsic} from "../handlers/extrinsic";
export async function handleBlock(block: SubstrateBlock): Promise<void> {
    await createBlock(block);
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    await createEvent(event)
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
    await createExtrinsic(extrinsic)
}
