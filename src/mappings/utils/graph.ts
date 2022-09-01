import { Contracts } from '../../processable'

type MapFn = (id: string) => string
const sameVal: MapFn = (id: string) => id
const hexify: MapFn = (id: string) => '0x' + Number(id).toString(16)

const mappers: Record<Contracts, MapFn | undefined> = {
  [Contracts.DPS]: (id: string) => `ipfs://QmPxvsXf97jd1ZdHAFfmbrH8CvBXw5nQPeB1HA47odRbLz/${id}`,
  [Contracts.Beanies]: (id: string) => `ipfs://ipfs/QmU4GvDw8VX9We7wg5QrxLmukV4ZWUuGCgxjX9ninDCXMP/${id}.json`,
  [Contracts.BUDS]: (id: string) => `ipfs://ipfs/QmWH8RUZebD5JfsmzYHA8rT6zirXZrHpa5HFA8n7q7SZNz/${id}.json`,
  [Contracts.NCR1]: undefined,
  [Contracts.NCR2]: (id: string) => `https://neoncrisis.io/api/hero/${id}`,
  [Contracts.MoonRiverQuest]: (id: string) => `ipfs://QmV6kfJg6C9BrvyqSLE4aFfWLnwiGh7FCBebPcG8JbovZs`,
  [Contracts.BadDads]: (id: string) => `ipfs://QmaJaejKSMGeRvEmaUZmjQzsK849X76Z42eBR937n8THqu/${id}.json`,
  [Contracts.BAYMAP]: undefined,
  [Contracts.BYPC]: (id: string) => `ipfs://QmVEGva1f6d8HXHuwaMLGfxyVEpvkc4XWnbwbcmyD8M1ug/${id}.json`,
  [Contracts.BlvckMarketCyan]: (id: string) => `ipfs://QmQHd7Wa4FZv4N36MSNNHLvbqjTgkf5XZrUfc6ap97cQoC/${id}.json`,
  [Contracts.BlvckMarket]: undefined,
  [Contracts.BlvckSnakesForrest]: undefined,
  [Contracts.CryptoButchers]: (id: string) => `ipfs://QmVBDKihHMMnbMysmazLzZck5ySE2wJjbHChFVC7qzAw5W/${id}.json`,
  [Contracts.MBAYC]: (id: string) => `ipfs://ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${id}`,
  [Contracts.MoonShroomiz]: (id: string) => `ipfs://ipfs/QmXvfjHAiaJHTu5692YofHZunvRJdZiPpcepw8pu4B3wuf/${id}.json`,
}

export const contractHasGraph = (contract: Contracts | string): boolean =>  mappers[contract as Contracts] !== undefined

export const tokenUriOf = (contract: string, tokenId: string): Promise<string> => {
  const mapper = mappers[contract as Contracts]
  if (!mapper) {
    return Promise.resolve('')
  }

  return Promise.resolve(mapper(tokenId))
}