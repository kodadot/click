import { tokenUriOf, uriOf } from '../../contract'
import { decode1155SingleTransfer, decode1155UriChange, decode721Transfer } from './evm'
import { contractOf } from './extract'
import {
  BurnSingleTokenEvent,
  BurnTokenEvent,
  ChangeMetadataEvent,
  Context,
  CreateCollectionEvent,
  CreateTokenEvent,
  TransferSingleTokenEvent,
  TransferTokenEvent,
} from './types'

export function getCreateCollectionEvent(ctx: Context): CreateCollectionEvent {
  // const collectionId = contractOf(ctx);
  return {} as CreateCollectionEvent
}

export function getCreateTokenEvent(ctx: Context): CreateTokenEvent {
  const { to, tokenId } = decode721Transfer(ctx)
  const collectionId = contractOf(ctx)
  // const metadata = tokenUriOf(collectionId, tokenId.toString())
  const metadata = Promise.resolve('')

  return { collectionId, caller: to, sn: tokenId.toString(), metadata, count: 1 }
}

export function getSingleCreateTokenEvent(ctx: Context): CreateTokenEvent {
  const { to, id: tokenId, value } = decode1155SingleTransfer(ctx)
  const collectionId = contractOf(ctx)
  // const metadata = uriOf(collectionId, tokenId.toString())
  const metadata = Promise.resolve('')

  return { collectionId, caller: to, sn: tokenId.toString(), metadata, count: value.toNumber() }
}

export function getTransferTokenEvent(ctx: Context): TransferTokenEvent {
  const { from, to, tokenId } = decode721Transfer(ctx)
  const collectionId = contractOf(ctx)
  return { collectionId, caller: from, sn: tokenId.toString(), to }
}

export function getBurnTokenEvent(ctx: Context): BurnTokenEvent {
  const { from, tokenId } = decode721Transfer(ctx)
  const collectionId = contractOf(ctx)
  return { collectionId, caller: from, sn: tokenId.toString() }
}

export function getTokenUriChangeEvent(ctx: Context): ChangeMetadataEvent {
  const { id, value } = decode1155UriChange(ctx)
  const collectionId = contractOf(ctx)
  return { collectionId, sn: id.toString(), metadata: value }
}

export function getSingleTransferTokenEvent(ctx: Context): TransferSingleTokenEvent {
  const { from, to, id, value } = decode1155SingleTransfer(ctx)
  const collectionId = contractOf(ctx)
  return { collectionId, caller: from, sn: id.toString(), to, count: value.toNumber() }
}

export function getSingleBurnTokenEvent(ctx: Context): BurnSingleTokenEvent {
  const { from, id, value } = decode1155SingleTransfer(ctx)
  const collectionId = contractOf(ctx)
  return { collectionId, caller: from, sn: id.toString(), count: value.toNumber() }
}

// export function getMultiTransferTokenEvent(ctx: Context): TransferSingleTokenEvent[] {
//   const { from, to, ids, values } = decode1155MutliTransfer(ctx)
//   const collectionId = contractOf(ctx)
//   return { collectionId, caller: from, sn: id.toString(), to, count: value.toNumber() }
// }