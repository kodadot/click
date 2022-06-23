import * as ss58 from "@subsquid/ss58";
import { SomethingWithOptionalMeta } from './types'

export function isEmpty(obj: Record<string, any>) {
  for (const _ in obj) { return false; }
  return true;
}

export function addressOf(address: Uint8Array): string {
 return ss58.codec('moonriver').encode(address);
}

export function metadataOf({ metadata }: SomethingWithOptionalMeta): string {
  return metadata ?? '';
 }