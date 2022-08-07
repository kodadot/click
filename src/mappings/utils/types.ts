import { EvmLogHandlerContext, EvmLogHandler } from '@subsquid/substrate-processor'
import md5 from 'md5'
import { nanoid } from 'nanoid'
import { Attribute } from '../../model/generated/_attribute'
import { Interaction } from '../../model/generated/_interaction'
import { createTokenId } from './extract'
import { EvmLogOptions } from '@subsquid/substrate-processor'
import { NoDataSelection } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { EntityManager } from 'typeorm'
export type BaseCall = {
  caller: string;
  blockNumber: string;
  timestamp: Date;
}

export { Interaction }

// export type Store = EntityManager
type OneOfInteraction = Interaction
export type EvmLogHandlerOptions = EvmLogOptions & NoDataSelection


export function eventFrom<T>(interaction: T,  { blockNumber, caller, timestamp }: BaseCall, meta: string, currentOwner?: string): IEvent<T> {
  return {
    interaction,
    blockNumber: BigInt(blockNumber),
    caller,
    currentOwner: currentOwner ?? caller,
    timestamp,
    meta
  }
}

export function attributeFrom(attribute: MetadataAttribute): Attribute {
  return new Attribute({}, {
    display: String(attribute.display_type),
    trait: String(attribute.trait_type),
    value: String(attribute.value)
  })
}

export type Store = EntityManager
export type Context = EvmLogHandlerContext<Store>
// export type Context = EventHandlerContext

export type Optional<T> = T | null

export interface IEvent<T = OneOfInteraction> {
  interaction: T;
  blockNumber: bigint,
  caller: string,
  currentOwner: string,
  timestamp: Date,
  meta: string;
}

// BASE 

export type BaseCollectionEvent = WithCaller & {
  id: string;
}

export type BaseTokenEvent = CollectionId & {
  sn: string;
}

export type OptionalMeta = {
  metadata?: string;
}

export type CreateCollectionEvent = BaseCollectionEvent & OptionalMeta & {
  type: string;
}

export type CreateTokenEvent = BaseTokenEvent & WithCount &  WithCaller & {
  metadata: Promise<string>;
}

export type TransferTokenEvent = BaseTokenEvent & WithCaller & TransferTo

export type BurnTokenEvent = BaseTokenEvent & WithCaller

// 1155 Single

export type TransferSingleTokenEvent = TransferTokenEvent & WithCount

export type BurnSingleTokenEvent = BurnTokenEvent & WithCount

// 1155 Multi

type BaseMultiTokenEvent = CollectionId & WithCaller & TransferBatchList

export type CreateMultiTokenEvent = BaseMultiTokenEvent & {
  metadata: Promise<string>[];
}

export type TransferMultiTokenEvent = BaseMultiTokenEvent & TransferTo

export type BurnMultiTokenEvent = BaseMultiTokenEvent

type TransferBatchList = {
  snList: string[];
  countList: bigint[];
}

export type ChangeMetadataEvent = BaseTokenEvent & OptionalMeta

export type CallWith<T> = BaseCall & T

type TransferTo = {
  to: string;
}

type CollectionId = {
  collectionId: string;
}

export type EntityConstructor<T> = {
  new (...args: any[]): T;
};

export type WithAmount = {
  amount: bigint;
}

export type WithCaller = {
  caller: string;
}

export type SomethingWithMeta = {
  metadata: string
}

export type SomethingWithOptionalMeta = {
  metadata?: string
}

export type WithCount = {
  count: bigint;
}

export type UnwrapFunc<T> = (ctx: Context) => T
export type SanitizerFunc = (url: string) => string

export function ensure<T>(value: any): T {
  return value as T
}

export const eventId = (id: string, event: Interaction) => `${id}-${event}-${nanoid()}`

export const createOfferId = (id: string, caller: string) => `${id}-${caller}`

export const tokenIdOf = (base: BaseTokenEvent) => createTokenId(base.collectionId, base.sn)

export const fungibleTokenIdOf = (base: BaseTokenEvent & WithCaller) => `${createTokenId(base.collectionId, base.sn)}-${md5(base.caller)}`

export type TokenMetadata = {
  name?: string
  description: string
  external_url?: string
  image: string
  animation_url?: string
  attributes?: MetadataAttribute[]
}

export type MetadataAttribute = {
  display_type?: DisplayType
  trait_type?: string
  value: number | string
}

export enum DisplayType {
  null,
  'boost_number',
  'number',
  'boost_percentage',
}
