import { tokenUriOf } from '../../contract'
import { decode1155MultiTransfer, decode1155SingleTransfer, decode1155UriChange, decode721Transfer } from './evm'
import { contractOf, mapAndMatch } from './extract'
import {
  BurnMultiTokenEvent,
  BurnSingleTokenEvent,
  BurnTokenEvent,
  ChangeMetadataEvent,
  Context,
  CreateCollectionEvent,
  CreateMultiTokenEvent,
  CreateTokenEvent,
  TransferMultiTokenEvent,
  TransferSingleTokenEvent,
  TransferTokenEvent
} from './types'

export function getCreateCollectionEvent(ctx: Context): CreateCollectionEvent {
  // const collectionId = contractOf(ctx);
  return {} as CreateCollectionEvent
}

export function getCreateTokenEvent(ctx: Context): CreateTokenEvent {
  const { to, tokenId } = decode721Transfer(ctx)
  const collectionId = contractOf(ctx)
  const metadata = tokenUriOf(collectionId, tokenId.toString())
  // const metadata = Promise.resolve('')

  return { collectionId, caller: to, sn: tokenId.toString(), metadata, count: 1 }
}

export function getSingleCreateTokenEvent(ctx: Context): CreateTokenEvent {
  const { to, id: tokenId, value } = decode1155SingleTransfer(ctx)
  const collectionId = contractOf(ctx)
  // const metadata = uriOf(collectionId, tokenId.toString())
  const metadata = Promise.resolve('')

  return { collectionId, caller: to, sn: tokenId.toString(), metadata, count: value.toNumber() }
}

export function getMultiCreateTokenEvent(
  ctx: Context
): CreateMultiTokenEvent {
  const { to, ids, values } = decode1155MultiTransfer(ctx)
  const collectionId = contractOf(ctx)

  const matches = mapAndMatch(ids, values)
  const snList = Object.keys(matches)

  // const metadata = snList.map((tokenId) => uriOf(collectionId, tokenId))
  const metadata = snList.map(() => Promise.resolve(''))

  return {
    collectionId,
    caller: to,
    snList,
    countList: Object.values(matches),
    metadata,
  }
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

export function getMultiTransferTokenEvent(ctx: Context): TransferMultiTokenEvent {
  const { from, to, ids, values } = decode1155MultiTransfer(ctx)
  const collectionId = contractOf(ctx)
  const matches = mapAndMatch(ids, values)
  return { collectionId, caller: from, snList: Object.keys(matches), to, countList: Object.values(matches) }
}

export function getSingleBurnTokenEvent(ctx: Context): BurnSingleTokenEvent {
  const { from, id, value } = decode1155SingleTransfer(ctx)
  const collectionId = contractOf(ctx)
  return { collectionId, caller: from, sn: id.toString(), count: value.toNumber() }
}

export function getMultiBurnTokenEvent(ctx: Context): BurnMultiTokenEvent {
  const { from, ids, values } = decode1155MultiTransfer(ctx)
  const collectionId = contractOf(ctx)
  const matches = mapAndMatch(ids, values)
  return { collectionId, caller: from, snList: Object.keys(matches), countList: Object.values(matches) }
}

// export function getMultiTransferTokenEvent(ctx: Context): TransferSingleTokenEvent[] {
//   const { from, to, ids, values } = decode1155MutliTransfer(ctx)
//   const collectionId = contractOf(ctx)
//   return { collectionId, caller: from, sn: id.toString(), to, count: value.toNumber() }
// }