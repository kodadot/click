import { Store } from '@subsquid/substrate-processor'
import { NFTEntity } from '../../model'

export async function findAll1155Tokens(
  store: Store,
  collection: string,
  sn: string
): Promise<NFTEntity[]> {
  return store.find<NFTEntity>(NFTEntity, {
    where: { 
      collection: { id: collection },
      sn
     },
  })
}