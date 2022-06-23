import { decode721Transfer } from './evm'
import { contractOf } from './extract'
import { BurnTokenEvent, Context, CreateCollectionEvent, CreateTokenEvent, TransferTokenEvent } from './types'

export function getCreateCollectionEvent(ctx: Context): CreateCollectionEvent {
  return {} as CreateCollectionEvent;
}

export function getCreateTokenEvent(ctx: Context): CreateTokenEvent {
  const { to, tokenId } = decode721Transfer(ctx)
  const collectionId = contractOf(ctx);

  return { collectionId, caller: to, sn: tokenId.toString() };
}

export function getTransferTokenEvent(ctx: Context): TransferTokenEvent {
  const { from, to, tokenId } = decode721Transfer(ctx)
  const collectionId = contractOf(ctx);
  return { collectionId, caller: from, sn: tokenId.toString(), to };
}

export function getBurnTokenEvent(ctx: Context): BurnTokenEvent {
  const { from, tokenId } = decode721Transfer(ctx)
  const collectionId = contractOf(ctx);
  return { collectionId, caller: from, sn: tokenId.toString() };
}

