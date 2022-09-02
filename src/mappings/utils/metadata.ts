import Axios from 'axios'
import { ensure } from './types'
import logger from './logger'
import { SanitizerFunc, SomethingWithMeta } from './types'

// import { access, readFile } from 'node:fs/promises'
// import { join } from 'node:path'
// import { ASSET_DIR } from './constants'
// import { constants } from 'node:fs'

export const BASE_URL = 'https://nftstorage.link/'

const api = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

export const sanitizeIpfsUrl = (ipfsUrl: string): string => {

  const rr = /^ipfs:\/\/ipfs/
  if (rr.test(ipfsUrl)) {
    return ipfsUrl.replace('ipfs://', BASE_URL)
  }

  const r = /^ipfs:\/\//
  if (r.test(ipfsUrl)) {
    return ipfsUrl.replace('ipfs://', `${BASE_URL}ipfs/`)
  }

  return ipfsUrl
}

export const fetchMetadata = async <T>(
  { metadata }: SomethingWithMeta,
  sanitizer: SanitizerFunc = sanitizeIpfsUrl
): Promise<T> => {
  try {
    if (!metadata) {
      return ensure<T>({})
    }

    const url = sanitizer(metadata)

    // const cached = await fetchFromCache<T>(url)
    // if (cached) {
    //   return cached
    // }

    const { status, data } = await api.get<T>(url)
    logger.watch('[IPFS]', status, metadata)
    if (status < 400) {
      return data
    }
  } catch (e) {
    logger.warn('[IPFS] ERROR', metadata, (e as Error).message)
    return ensure<T>({})
  }

  return ensure<T>({})
}

// const shave = (url: string) => url.replace(BASE_URL + 'ipfs/', '')
// const makeSureItEndsWithJson = (url: string) => {
//   if (!url.endsWith('.json')) {
//     return url + '.json'
//   }
//   return url
// }

// const fetchFromCache = async <T>(metadata: string): Promise<Optional<T>> => {
//   try {
//     const path = join(ASSET_DIR, makeSureItEndsWithJson(shave(metadata)))
//     logger.info('[CACHE]', path)
//     await access(path, constants.R_OK)
//     logger.star('[CACHE]', metadata)
//     return readFile(path, 'utf-8').then(JSON.parse)
//   } catch (e) {
//     return null
//   }
// }

export const fetchMimeType = async (ipfsLink?: string, sanitizer: SanitizerFunc = sanitizeIpfsUrl): Promise<string | undefined> => {
  if (!ipfsLink) {
    return undefined
  }

  const assetUrl = sanitizer(ipfsLink)

  try {
    const { headers } = await api.head(assetUrl)
    return headers['content-type']
  } catch (e: any) {
    logger.warn(`[MIME TYPE] Unable to access type of ${assetUrl}\n\nReason ${e.message}`)
    return undefined
  }
}


export default api