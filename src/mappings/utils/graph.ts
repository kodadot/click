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

const unwrap = ({ data }: { data: { token: { uri: string } } }) => data.token.uri
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

export const tokenUriOf = (contract: string, tokenId: string): Promise<string> => {
  const endpoint = baseUrl[contract as Contracts]
  if (!endpoint) {
    return Promise.resolve('')
  }

  return api.post(baseUrl[contract as Contracts], {
    query,
    variables: { id: tokenId }
  }).then(unwrap)
  .catch(logFail)
}