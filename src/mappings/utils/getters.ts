import { BurnTokenEvent, Context, CreateCollectionEvent, CreateTokenEvent, TransferTokenEvent } from './types'

export function getCreateCollectionEvent(ctx: Context): CreateCollectionEvent {
  return {} as CreateCollectionEvent;
}

export function getCreateTokenEvent(ctx: Context): CreateTokenEvent {
  // const event = new NftInstanceMintedEvent(ctx);

  // const { classId, owner, instanceId, metadata } = event.asLatest;
  // return { collectionId: classId.toString(), caller: addressOf(owner), sn: instanceId.toString(), metadata: metadata.toString() };
  return {} as CreateTokenEvent;
}

export function getTransferTokenEvent(ctx: Context): TransferTokenEvent {
  return {} as TransferTokenEvent;
}

export function getBurnTokenEvent(ctx: Context): BurnTokenEvent {
  return {} as BurnTokenEvent;
}

