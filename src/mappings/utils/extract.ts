
import { BaseCall, CallWith, Context, UnwrapFunc } from './types'
import { BigNumber } from 'ethers'
import { BIGINT_ZERO } from './constants'

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


export const mapAndMatch = (ids: BigNumber[], values: BigNumber[]): Record<string, bigint> => {
  const tokenIdList = ids.map(stringOf)
  const counts = values.map(bigintOf)

  return matcher(tokenIdList, counts)
}

export const matcher = (
  ids: string[],
  counts: bigint[]
): Record<string, bigint> => {
  const map: Record<string, bigint> = {};
  ids.forEach((val, index) => {
    if (counts[index] === BIGINT_ZERO) {
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

export function bigintOf(bn: BigNumber): bigint {
  return bn.toBigInt();
}