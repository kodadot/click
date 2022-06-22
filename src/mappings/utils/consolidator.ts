import { CollectionEntity, NFTEntity } from '../../model/generated'

type Entity = CollectionEntity | NFTEntity
type AbstractEntity = Entity

export function real<T>(entity: T | undefined): boolean {
  return !!entity
}

export function burned({ burned }: Entity): boolean {
  return burned || false
}

export function created(entity: Entity): boolean {
  return Object.keys(entity).length === 1 && entity.id !== undefined
}

export function entityOf(entity: AbstractEntity): string {
  if (entity instanceof CollectionEntity) {
    return 'Collection'
  }

  if (entity instanceof NFTEntity) {
    return 'NFT'
  }

  return ''
}

export function remintable(entity: Entity): boolean {
  return burned(entity) || created(entity)
}

export function plsBe<T extends AbstractEntity>(
  callback: (arg: T) => boolean,
  entity: T
) {
  return needTo(callback, entity, true)
}

export function plsNotBe<T extends AbstractEntity>(
  callback: (arg: T) => boolean,
  entity: T
) {
  return needTo(callback, entity, false)
}

export function needTo<T extends AbstractEntity>(
  callback: (arg: T) => boolean,
  entity: T,
  positive: boolean = true
) {
  const entityName = entityOf(entity)
  if (positive ? !callback(entity) : callback(entity)) {
    throw new ReferenceError(
      `[PROBLEM] Entity ${entityName} needs ${positive ? '' : 'not'}to be ${
        callback.name
      }`
    )
  }
}
