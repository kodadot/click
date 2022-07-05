
import { BaseCall, CallWith, Context, UnwrapFunc } from './types'

function toBaseEvent(event: Context): BaseCall {
  const caller = event.substrate.extrinsic?.signer.toString() || ''; 
  const blockNumber = event.substrate.block.height.toString();
  const timestamp = new Date(event.substrate.block.timestamp);

  return { caller, blockNumber, timestamp };
}

export function contractOf(event: Context): string {
  return event.contractAddress
}


export function unwrap<T>(ctx: Context, unwrapFn: UnwrapFunc<T>): CallWith<T> {
  const baseCall = toBaseEvent(ctx);
  const unwrapped = unwrapFn(ctx);
  return { ...baseCall, ...unwrapped };
}

export const createTokenId = (collection: string, id: string) => `${collection}-${id}`

export const createFungibleTokenId = (collection: string, id: string, caller: string) => `${createTokenId(collection, id)}-${caller}`

