import Axios from 'axios'
import { Contracts } from '../../processable'
import logger from './logger'

export const BASE_URL = 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/'

const api = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

const query = `
query MyQuery($id: ID!) {
  token(id: $id) {
    uri
  }
}
`

const unwrap = ({ data }: { data: { token: null | { uri: string } } }) => data.token ? data.token.uri : ''
const logFail = (err: any) => {
  logger.warn('Failed to get token URI', err)
  return ''
}

type MapFn = (id: string) => string
const sameVal: MapFn = (id: string) => id
const hexify: MapFn = (id: string) => '0x' + Number(id).toString(16)

const baseUrl: Record<string, string> = {
  [Contracts.Moonsama]: 'nft',
  [Contracts.Pondsama]: '',
  [Contracts.Moonx]: 'nft-1155-mx',
  [Contracts.Factory]: 'nft-1155-factory',
  [Contracts.Art]: 'nft-1155-multiverseart',
  [Contracts.Plot]: 'nft-721-mmplots1',
  [Contracts.Box]: 'nft-1155-samabox',
  [Contracts.Embassy]: 'nft-1155-embassy',
}


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
  // [Contracts.BlvckMarket]: undefined,
  [Contracts.BlvckSnakesForrest]: (id: string) => `ipfs://QmYSThWjHh3swx2qXxGM6MMdv35hvCmaptNZFDXZisUHzi/${id}.json`,
  [Contracts.CryptoButchers]: (id: string) => `ipfs://QmVBDKihHMMnbMysmazLzZck5ySE2wJjbHChFVC7qzAw5W/${id}.json`,
  [Contracts.MoonShroomiz]: (id: string) => `ipfs://ipfs/QmXvfjHAiaJHTu5692YofHZunvRJdZiPpcepw8pu4B3wuf/${id}.json`,
  [Contracts.Moonsama]: hexify,
  [Contracts.Pondsama]: sameVal,
  [Contracts.Moonx]: sameVal,
  [Contracts.Factory]: sameVal,
  [Contracts.Art]: sameVal,
  [Contracts.Plot]: hexify,
  [Contracts.Box]: sameVal,
  [Contracts.Embassy]: sameVal,
}

export const contractHasGraph = (contract: Contracts | string): boolean =>  mappers[contract as Contracts] !== undefined

export const tokenUriOf = (contract: string, tokenId: string): Promise<string> => {
  const mapper = mappers[contract as Contracts]
  if (!mapper) {
    return Promise.resolve('')
  }

  if (baseUrl[contract as Contracts]) {
    return processAsGraph(contract, tokenId)
  }

  return Promise.resolve(mapper(tokenId))
}

export const processAsGraph = (contract: string, tokenId: string): Promise<string> => {
  const endpoint = baseUrl[contract as Contracts]
  const idMapper = mappers[contract as Contracts]
  if (!endpoint || !idMapper ) {
    return Promise.resolve('')
  }

  const id = idMapper(tokenId)
  return api.post(endpoint, {
    query,
    variables: { id }
  })
  .then(({ data }) =>  data)
  .then(unwrap)
  .catch(logFail)
}