import { EvmLogHandlerContext } from '@subsquid/substrate-evm-processor'
import { BlockHandlerContext, Store } from '@subsquid/substrate-processor'
import md5 from 'md5'
import {
  CollectionEntity as CE, Event,
  MetadataEntity as Metadata,
  NFTEntity as NE
} from '../model'
import { plsBe, real, remintable } from './utils/consolidator'
import { create, get, getOrCreate } from './utils/entity'
import { createTokenId, unwrap } from './utils/extract'
import {
  getBurnTokenEvent, getCreateCollectionEvent,
  getCreateTokenEvent, getTransferTokenEvent
} from './utils/getters'
import { isEmpty } from './utils/helper'
import logger, { logError, metaLog } from './utils/logger'
import { fetchMetadata } from './utils/metadata'
import {
  attributeFrom,
  BaseCall, Context, ensure,
  eventFrom,
  eventId,
  Interaction, Optional,
  TokenMetadata
} from './utils/types'
import { decode721Transfer, whatIsThisTransfer } from './utils/evm'
import { EMPTY_ADDRESS } from './utils/constants'
import { serializer } from './utils/serializer'
import { ContractsMap } from '../processable'

async function handleMetadata(
  id: string,
  store: Store
): Promise<Optional<Metadata>> {
  const meta = await get<Metadata>(store, Metadata, id)
  if (meta) {
    return meta
  }

  const metadata = await fetchMetadata<TokenMetadata>({ metadata: id })
  if (isEmpty(metadata)) {
    return null
  }

  const partial: Partial<Metadata> = {
    id,
    description: metadata.description || '',
    image: metadata.image,
    animationUrl: metadata.animation_url,
    attributes: metadata.attributes?.map(attributeFrom) || [],
    name: metadata.name || '',
  }

  const final = create<Metadata>(Metadata, id, partial)
  await store.save(final)
  return final
}

export async function handleCollectionCreate(context: Context): Promise<void> {
  logger.pending(`[COLECTTION++]: ${context.substrate.block.height}`)
  const event = unwrap(context, getCreateCollectionEvent)
  logger.debug(`collection: ${JSON.stringify(event, serializer, 2)}`)
  const final = await getOrCreate<CE>(context.store, CE, event.id, {})
  plsBe(remintable, final)

  final.id = event.id
  final.issuer = event.caller
  final.currentOwner = event.caller
  final.blockNumber = BigInt(event.blockNumber)
  // final.metadata = event.metadata || 'ipfs://ipfs/bafkreiazeqysfmeuzqcnjp6rijxfu5h7sj3t4h2rxehi7rlyegzfy7lxeq'
  final.burned = false
  final.createdAt = event.timestamp
  final.updatedAt = event.timestamp


  logger.debug(`metadata: ${event.metadata}`)

  if (final.metadata) {
    const metadata = await handleMetadata(final.metadata, context.store)
    final.meta = metadata
    final.name = metadata?.name
  }

  logger.success(`[COLLECTION] ${final.id}`)
  await context.store.save(final)
  // await createCollectionEvent(final, Interaction.MINT, event, '', context.store)
}

export async function handleTokenCreate(context: Context): Promise<void> {
  logger.pending(`[NFT++]: ${context.substrate.block.height}`)
  const event = unwrap(context, getCreateTokenEvent)
  logger.debug(`nft: ${JSON.stringify(event, serializer, 2)}`)
  const id = createTokenId(event.collectionId, event.sn)
  const collection = ensure<CE>(
    await get<CE>(context.store, CE, event.collectionId)
  )
  const final = await getOrCreate<NE>(context.store, NE, id, {})
  plsBe(real, collection)
  plsBe(remintable, final)

  final.id = id
  final.hash = md5(id)
  final.issuer = event.caller
  final.currentOwner = event.caller
  final.blockNumber = BigInt(event.blockNumber)
  final.collection = collection
  final.sn = event.sn
  final.price = BigInt(0);
  final.metadata = await event.metadata
  final.burned = false
  final.createdAt = event.timestamp
  final.updatedAt = event.timestamp

  logger.debug(`metadata: ${final.metadata}`)

  if (final.metadata) {
    const metadata = await handleMetadata(final.metadata, context.store)
    final.meta = metadata
    final.name = metadata?.name
  }

  logger.success(`[MINT] ${final.id}`)
  await context.store.save(final)
  await createEvent(final, Interaction.MINTNFT, event, '', context.store)
}

export async function handleTokenTransfer(context: Context): Promise<void> {
  logger.pending(`[SEND]: ${context.substrate.block.height}`)
  const event = unwrap(context, getTransferTokenEvent)
  logger.debug(`send: ${JSON.stringify(event, serializer, 2)}`)
  const id = createTokenId(event.collectionId, event.sn)
  const entity = ensure<NE>(await get(context.store, NE, id))
  plsBe(real, entity)

  const currentOwner = entity.currentOwner
  entity.currentOwner = event.to
  logger.success(
    `[SEND] ${id} from ${event.caller} to ${event.to}`
  )
  await context.store.save(entity)
  await createEvent(entity, Interaction.SEND, event, event.to || '', context.store, currentOwner)
}

export async function handleTokenBurn(context: Context): Promise<void> {
  logger.pending(`[BURN]: ${context.substrate.block.height}`)
  const event = unwrap(context, getBurnTokenEvent)
  logger.debug(`burn: ${JSON.stringify(event, serializer, 2)}`)
  const id = createTokenId(event.collectionId, event.sn)
  const entity = ensure<NE>(await get(context.store, NE, id))
  plsBe(real, entity)

  entity.burned = true
  entity.currentOwner = EMPTY_ADDRESS

  logger.success(`[BURN] ${id} by ${event.caller}`)
  await context.store.save(entity)
  const meta = entity.metadata ?? ''
  await createEvent(entity, Interaction.CONSUME, event, meta, context.store)
}

// async function markOfferExpired(collectionId: string, sn: string, blockNumber: bigint, store: Store): Promise<void> {
// }

async function createEvent(
  final: NE,
  interaction: Interaction,
  call: BaseCall,
  meta: string,
  store: Store,
  currentOwner?: string
) {
  try {
    const newEventId = eventId(final.id, interaction)
    const event = create<Event>(
      Event,
      newEventId,
      eventFrom(interaction, call, meta, currentOwner)
    )
    event.nft = final
    await store.save(event)
  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[[${interaction}]]: ${final.id} Reason: ${e.message}`)
    )
  }
}


export async function forceCreateContract(ctx: BlockHandlerContext) {
  const contracts = Object.entries(ContractsMap).map(([id, contract]) => {
    metaLog('Building CONTRACT', { id, name: contract.name })
    return new CE({
      id,
      ...contract
    })
  })

  metaLog('CONTRACT DONE', { count: contracts.length })
  
  await ctx.store.save(contracts);
}

export async function mainFrame(ctx: EvmLogHandlerContext): Promise<void> {
    const transfer = decode721Transfer(ctx)
    switch (whatIsThisTransfer(transfer)) {
      case Interaction.MINTNFT:
        metaLog(Interaction.MINTNFT, transfer)
        await handleTokenCreate(ctx)
        break
      case Interaction.SEND:
        metaLog(Interaction.SEND, transfer)
        await handleTokenTransfer(ctx)
        break
      case Interaction.CONSUME:
        metaLog(Interaction.CONSUME, transfer)
        await handleTokenBurn(ctx)
        break
      default:
        logger.warn(`Unknown transfer: ${JSON.stringify(transfer, null, 2)}`)
    }
}


// export async function contractLogsHandler(
//   ctx: EvmLogHandlerContext
// ): Promise<void> {
//   const transfer =
//     erc721.events["Transfer(address,address,uint256)"].decode(ctx);

//   let from = await ctx.store.get(Owner, transfer.from);
//   if (from == null) {
//     from = new Owner({ id: transfer.from, balance: 0n });
//     await ctx.store.save(from);
//   }

//   let to = await ctx.store.get(Owner, transfer.to);
//   if (to == null) {
//     to = new Owner({ id: transfer.to, balance: 0n });
//     await ctx.store.save(to);
//   }

//   let token = await ctx.store.get(Token, transfer.tokenId.toString());
//   if (token == null) {
//     token = new Token({
//       id: transfer.tokenId.toString(),
//       uri: await contract.tokenURI(transfer.tokenId),
//       contract: await getContractEntity(ctx),
//       owner: to,
//     });
//     await ctx.store.save(token);
//   } else {
//     token.owner = to;
//     await ctx.store.save(token);
//   }

//   await ctx.store.save(
//     new Transfer({
//       id: ctx.txHash,
//       token,
//       from,
//       to,
//       timestamp: BigInt(ctx.substrate.block.timestamp),
//       block: ctx.substrate.block.height,
//       transactionHash: ctx.txHash,
//     })
//   );
// }
