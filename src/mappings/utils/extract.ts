
import { BaseCall, CallWith, Context, UnwrapFunc } from './types'
import { BigNumber } from 'ethers'

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

export const matcher = (
  ids: string[],
  counts: number[]
): Record<string, number> => {
  const map: Record<string, number> = {};
  ids.forEach((val, index) => {
    if (counts[index] === 0) {
      return;
    }
    if (!map[val]) {
      map[val] = counts[index];
    } else {
      map[val] += counts[index];
    }
  });

  return map;
};


export function stringOf(bn: BigNumber): string {
  return bn.toString();
}

export function numberOf(bn: BigNumber): number {
  return bn.toNumber();
}