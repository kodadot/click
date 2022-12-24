import { BlockHandlerContext } from '@subsquid/substrate-processor'
import md5 from 'md5'
import { isERC721 } from '../contract'
import {
  CollectionEntity as CE, CollectionType, Event,
  MetadataEntity as Metadata,
  NFTEntity as NE
} from '../model'
import { ContractsMap } from '../processable'
import { created, plsBe, real, remintable } from './utils/consolidator'
import { BIGINT_ZERO, EMPTY_ADDRESS } from './utils/constants'
import { create, get, getOrCreate } from './utils/entity'
import { decode1155MultiTransfer, decode1155SingleTransfer, decode721Transfer, RealTransferEvent, whatIsThisTransfer } from './utils/evm'
import { createFungibleTokenId, createTokenId, unwrap } from './utils/extract'
import {
  getBurnTokenEvent, getCreateCollectionEvent,
  getCreateTokenEvent, getMultiBurnTokenEvent, getMultiCreateTokenEvent, getMultiTransferTokenEvent, getSingleBurnTokenEvent, getSingleCreateTokenEvent, getSingleTransferTokenEvent, getTokenUriChangeEvent, getTransferTokenEvent
} from './utils/getters'
import { isEmpty } from './utils/helper'
import logger, { logError, transferDebug } from './utils/logger'
import { fetchMetadata } from './utils/metadata'
import { findAll1155Tokens } from './utils/query'
import { serializer } from './utils/serializer'
import {
  attributeFrom,
  BaseCall, Context, ensure,
  eventFrom,
  eventId,
  Interaction, Optional,
  TokenMetadata,
  Store
} from './utils/types'

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
  logger.pending(`[COLECTTION++]: ${context.block.height}`)
  const event = unwrap(context, getCreateCollectionEvent)
  // logger.debug(`collection: ${JSON.stringify(event, serializer, 2)}`)
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


  // logger.debug(`metadata: ${event.metadata}`)

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
  logger.pending(`[NFT++]: ${context.block.height}`)
  const event = unwrap(context, getCreateTokenEvent)
  // metaLog('Non-fungible', event)
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
  final.count = event.count

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

export async function handleSingleTokenCreate(context: Context, fromTransfer: boolean = false): Promise<void> {
  if (!fromTransfer) {
    logger.pending(`[Single NFT++]: ${context.block.height}`)
  }
  const event = unwrap(context, getSingleCreateTokenEvent)
  // metaLog('Fungible', event)
  const id = createFungibleTokenId(event.collectionId, event.sn, event.caller)
  const collection = ensure<CE>(
    await get<CE>(context.store, CE, event.collectionId)
  )
  const final = await getOrCreate<NE>(context.store, NE, id, {})
  plsBe(real, collection)

  if (created(final)) {
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
    final.count = event.count
  
    logger.debug(`metadata: ${final.metadata}`)
  
    if (final.metadata) {
      const metadata = await handleMetadata(final.metadata, context.store)
      final.meta = metadata
      final.name = metadata?.name
    }
    logger.success(`[MINT] ${final.id}`)
  } else {
    final.count += event.count
    final.burned = false
    logger.success(`[TRANSFER] Add ${event.count} tokens to ${event.caller}`)
  }

  
  await context.store.save(final)
  await createEvent(final, Interaction.MINTNFT, event, '', context.store)
}

export async function handleMultiTokenCreate(context: Context, fromTransfer: boolean = false): Promise<void> {
  if (!fromTransfer) {
    logger.pending(`[Single NFT++]: ${context.block.height}`)
  }
  const event = unwrap(context, getMultiCreateTokenEvent)
  // metaLog('Fungible', event)
  const collection = ensure<CE>(
    await get<CE>(context.store, CE, event.collectionId)
  )

  plsBe(real, collection)

  for (const index in event.snList) {
    const id = createFungibleTokenId(event.collectionId, event.snList[index], event.caller)
    const final = await getOrCreate<NE>(context.store, NE, id, {})
    if (created(final)) {
      final.id = id
      final.hash = md5(id)
      final.issuer = event.caller
      final.currentOwner = event.caller
      final.blockNumber = BigInt(event.blockNumber)
      final.collection = collection
      final.sn = event.snList[index]
      final.price = BigInt(0);
      final.metadata = await (event.metadata[index])
      final.burned = false
      final.createdAt = event.timestamp
      final.updatedAt = event.timestamp
      final.count = event.countList[index]
    
      logger.debug(`metadata: ${final.metadata}`)
    
      if (final.metadata) {
        const metadata = await handleMetadata(final.metadata, context.store)
        final.meta = metadata
        final.name = metadata?.name
      }
      logger.success(`[MINT] ${final.id}`)
    } else {
      final.count += event.countList[index]
      final.burned = false
      logger.success(`[TRANSFER] Add ${event.countList[index]} tokens to ${event.caller}`)
    }
  
    
    await context.store.save(final)
    await createEvent(final, Interaction.MINTNFT, event, '', context.store)
  }
}

export async function handleSingleTokenTransfer(context: Context): Promise<void> {
  logger.pending(`[SEND]: ${context.block.height}`)
  const event = unwrap(context, getSingleTransferTokenEvent)
  if (event.count === BIGINT_ZERO) {
    logger.warn(`[SEND] ${event.caller} sent 0 tokens`)
    return
  }

  logger.debug(`[SEND]: DO BURN`)
  await handleSingleTokenBurn(context, true)
  logger.debug(`[SEND]: DO CREATE`)
  await handleSingleTokenCreate(context, true)
  logger.success(
    `[SEND] from ${event.caller} to ${event.to}`
  )
}

export async function handleMultiTokenTransfer(context: Context): Promise<void> {
  logger.pending(`[SEND]: ${context.block.height}`)
  const event = unwrap(context, getMultiTransferTokenEvent)

  logger.debug(`[SEND]: DO BURN`)
  await handleMultiTokenBurn(context, true)
  logger.debug(`[SEND]: DO CREATE`)
  await handleMultiTokenCreate(context, true)
  logger.success(
    `[SEND] from ${event.caller} to ${event.to}`
  )
}

export async function handleSingleTokenBurn(context: Context, fromTransfer: boolean = false): Promise<void> {
  if (!fromTransfer) {
    logger.pending(`[BURN]: ${context.block.height}`)
  }
  const event = unwrap(context, getSingleBurnTokenEvent)
  // logger.debug(`burn: ${JSON.stringify(event, serializer, 2)}`)
  const id = createFungibleTokenId(event.collectionId, event.sn, event.caller)
  const entity = ensure<NE>(await get(context.store, NE, id))
  plsBe(real, entity)

  entity.count -= event.count

  if (entity.count === BIGINT_ZERO) {
    entity.burned = true
  }

  if (!fromTransfer) {
    logger.success(`[BURN] ${id} by ${event.caller}`)
  } else {
    logger.success(`[TRANSFER] Substract ${event.count} tokens from ${event.caller}`)
  }
  
  await context.store.save(entity)
  const meta = String(event.count)
  await createEvent(entity, Interaction.CONSUME, event, meta, context.store)
}

export async function handleMultiTokenBurn(context: Context, fromTransfer: boolean = false): Promise<void> {
  if (!fromTransfer) {
    logger.pending(`[BURN]: ${context.block.height}`)
  }
  const event = unwrap(context, getMultiBurnTokenEvent)
  // logger.debug(`burn: ${JSON.stringify(event, serializer, 2)}`)

  for (const index in event.snList) {
    const id = createFungibleTokenId(event.collectionId, event.snList[index], event.caller)
    const entity = ensure<NE>(await get(context.store, NE, id))
    plsBe(real, entity)

    entity.count -= event.countList[index]

    if (entity.count === BIGINT_ZERO) {
      entity.burned = true
    }

    if (!fromTransfer) {
      logger.success(`[BURN] ${id} by ${event.caller}`)
    } else {
      logger.success(`[TRANSFER] Substract ${event.countList[index]} tokens from ${event.caller}`)
    }
    
    await context.store.save(entity)
    const meta = String(event.countList[index])
    await createEvent(entity, Interaction.CONSUME, event, meta, context.store)
  }
}

export async function handleTokenTransfer(context: Context): Promise<void> {
  logger.pending(`[SEND]: ${context.block.height}`)
  const event = unwrap(context, getTransferTokenEvent)

  const id = createTokenId(event.collectionId, event.sn)
  const mayEntity = await get(context.store, NE, id)
  logger.debug(`ENTITY IS: ${JSON.stringify((mayEntity || {}), serializer, 2)}`)
  const entity = ensure<NE>(mayEntity)
  plsBe(real, entity)

  const currentOwner = entity.currentOwner
  entity.currentOwner = event.to
  logger.success(`[SEND] ${id} from ${event.caller} to ${event.to}`)
  await context.store.save(entity)
  await createEvent(
    entity,
    Interaction.SEND,
    event,
    event.to || '',
    context.store,
    currentOwner
  )
}

export async function handleTokenBurn(context: Context): Promise<void> {
  logger.pending(`[BURN]: ${context.block.height}`)
  const event = unwrap(context, getBurnTokenEvent)
  // logger.debug(`burn: ${JSON.stringify(event, serializer, 2)}`)
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


export async function forceCreateContract(ctx: BlockHandlerContext<Store>) {
  const meta = await Promise.all(Object.values(ContractsMap).map(({ metadata }) => metadata).map(m => handleMetadata(m, ctx.store)))
  const contracts = Object.entries(ContractsMap).map(([id, contract], index) => {
    logger.pending(`Building`, id, contract.name)
    return new CE({
      id,
      ...contract,
      meta: meta[index]
    })
  })

  logger.complete('[FORCE] CONTRACTS', contracts.length)
  
  await ctx.store.save(contracts);
}

export async function mainFrame(ctx: Context): Promise<void> {
  console.log('mainFrame', ctx.event.evmTxHash)
  const transfer = decode721Transfer(ctx)
  return technoBunker(ctx, transfer)
}


export function singleMainFrame(ctx: Context): Promise<void> {
  const transfer = decode1155SingleTransfer(ctx)
  return technoBunker(ctx, transfer, CollectionType.ERC1155)
}

export async function mutliMainFrame(ctx: Context): Promise<void> {
  const transfer = decode1155MultiTransfer(ctx)
  switch (whatIsThisTransfer(transfer)) {
    case Interaction.MINTNFT:
      transferDebug(Interaction.MINTNFT, transfer)
      await handleMultiTokenCreate(ctx)
      break
    case Interaction.SEND:
      transferDebug(Interaction.SEND, transfer)
      await handleMultiTokenTransfer(ctx)
      break
    case Interaction.CONSUME:
      transferDebug(Interaction.CONSUME, transfer)
      await handleMultiTokenBurn(ctx)
      break
    default:
      logger.warn(`Unknown transfer: ${JSON.stringify(transfer, null, 2)}`)
  }
}

async function technoBunker(ctx: Context, transfer: RealTransferEvent, type = CollectionType.ERC721) {
  switch (whatIsThisTransfer(transfer)) {
    case Interaction.MINTNFT:
      transferDebug(Interaction.MINTNFT, transfer)
      const createCb = isERC721(type) ? handleTokenCreate : handleSingleTokenCreate
      await createCb(ctx)
      break
    case Interaction.SEND:
      transferDebug(Interaction.SEND, transfer)
      const transferCb = isERC721(type) ? handleTokenTransfer : handleSingleTokenTransfer
      await transferCb(ctx)
      break
    case Interaction.CONSUME:
      transferDebug(Interaction.CONSUME, transfer)
      const burnCb = isERC721(type) ? handleTokenBurn : handleSingleTokenBurn
      await burnCb(ctx)
      break
    default:
      logger.warn(`Unknown transfer: ${JSON.stringify(transfer, null, 2)}`)
  }
}


export async function handleUriChnage(context: Context): Promise<void> {
  logger.pending(`[NEW URI]: ${context.block.height}`)
  const event = unwrap(context, getTokenUriChangeEvent)
  logger.debug('NEW URI', event.metadata)
  if (!event.metadata) {
    logger.warn(`No metadata for ${event.collectionId}`)
    return
  }
  const tokens = await findAll1155Tokens(context.store, event.collectionId, event.sn)
  const metadata = await handleMetadata(event.metadata, context.store)
  await context.store.save(metadata)
  tokens.forEach((token) => {
    token.metadata = event.metadata
    token.updatedAt = event.timestamp
    token.meta = metadata
  })
  // const entity = ensure<NE>(await get(context.store, NE, id))
  // plsBe(real, entity)

  await context.store.save(tokens);
}

