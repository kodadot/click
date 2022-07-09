import Axios from 'axios'
import { Contracts } from '../../processable'
import logger, { metaLog } from './logger'


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

const baseUrl: Record<Contracts, string> = {
  [Contracts.Moonsama]: 'nft',
  [Contracts.Pondsama]: '',
  [Contracts.Moonx]: 'nft-1155-mx',
  [Contracts.Factory]: 'nft-1155-factory',
  [Contracts.Art]: 'nft-1155-multiverseart',
  [Contracts.Plot]: 'nft-721-mmplots1',
  [Contracts.Box]: 'nft-1155-samabox',
  [Contracts.Embassy]: 'nft-1155-embassy',
  [Contracts.Blvck]: ''
}

type MapFn = (id: string) => string
const sameVal: MapFn = (id: string) => id
const hexify: MapFn = (id: string) => '0x' + Number(id).toString(16)

const mappers: Record<Contracts, MapFn> = {
  [Contracts.Moonsama]: hexify,
  [Contracts.Pondsama]: sameVal,
  [Contracts.Moonx]: sameVal,
  [Contracts.Factory]: sameVal,
  [Contracts.Art]: sameVal,
  [Contracts.Plot]: hexify,
  [Contracts.Box]: sameVal,
  [Contracts.Embassy]: sameVal,
  [Contracts.Blvck]: hexify
}

export const tokenUriOf = (contract: string, tokenId: string): Promise<string> => {
  const endpoint = baseUrl[contract as Contracts]
  logger.pending(endpoint)
  if (!endpoint) {
    return Promise.resolve('')
  }

  const id = mappers[contract as Contracts](tokenId)
  return api.post(endpoint, {
    query,
    variables: { id }
  })
  .then(({ data }) => {
    metaLog('METADATA FETCH', data)
    return data
  })
  .then(unwrap)
  .catch(logFail)
}