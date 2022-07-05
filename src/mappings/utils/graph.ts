import Axios from 'axios'
import { Contract } from 'ethers'
import { Contracts } from '../../processable'


export const BASE_URL = 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/'

const api = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})


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

