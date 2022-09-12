import { NewContracts as Contracts } from '../../processable'

type MapFn = (id: string) => string
const sameVal: MapFn = (id: string) => id
const hexify: MapFn = (id: string) => '0x' + Number(id).toString(16)

const mappers: Record<Contracts, MapFn | undefined> = {
  [Contracts.ExiledRacersPilots]: (id: string) => `ipfs://QmYned7JtjauvTWWP9vWK9bBRceLKzsEXhoe2YHLDWNhjx/${id}`,
  [Contracts.ExilredRacersRacecrafts]: (id: string) => `https://exr.mypinata.cloud/ipfs/QmSau6DDfzzsfMh5q9v8S4TnfFrbVu27NfKfy8dWKrHU8v/${id}`,
  [Contracts.GlmrApes]: (id: string) => `https://gateway.pinata.cloud/ipfs/QmUTChL9YohXWWNNNKoqvh6oCpib4eTiPMr5fbGYRedhUv/${id}.json`,
  [Contracts.Moonpets]: (id: string) => `https://moonpets.mypinata.cloud/ipfs/QmV56th23uMSxyWRveeriW8ScjnnbPRwQy2XvpumcqX8Qb/${id}.json`,
  [Contracts.GlmrJungle]: (id: string) => `https://www.glmrjungle.com/nfts/${id}.json`,
  [Contracts.GlmrPunks]: (id: string) => `ipfs://QmXoHd7JKjZ8WaCC6yL38wpsVW1SrFyvimBB6TRWMzx1sz/${id}.json`,
  [Contracts.MoonbeamPunks]: (id: string) => `ipfs://QmPWo92k7yG4KBs9mWxS9LpAg3psobwq5cPVLc218De6HJ/${id}.json`,
  [Contracts.MoonbeamLegendaryPunks]: (id: string) => `ipfs://QmWQUM5Wv5aVbidjeoqqmRworW15dr57KfZ1ynLUCJiUdv/${id}.json`,
  [Contracts.ClipperSurvivorPatch]: (id: string) => `ipfs://bafybeihtfqplc72hbq4xyoymjltduxk3mepqzydquzmfipmm2r5jn6qrwu/${id}.json`,
  [Contracts.GlmrApesBoost]: (id: string) => `https://gateway.pinata.cloud/ipfs/QmcSR6y8Hmt7oNu4mNVhzp8nusN8RrCyWu3PvvNXgYNPR6/${id}.json`,
  [Contracts.HamstersGang]: (id: string) => `ipfs://QmTrje5afpz6ZM8BbY3fpMLL3KG6DJbigLHRBfsryXFtor/${id}.json`,
  [Contracts.Moonfit]: (id: string) => `https://bafybeiaqkklaps635kujsuzb34wbyds2maihfa5hcanmutawixu6ny56de.ipfs.nftstorage.link/${id}.json`,
}

export const contractHasGraph = (contract: Contracts | string): boolean =>  mappers[contract as Contracts] !== undefined

export const tokenUriOf = (contract: string, tokenId: string): Promise<string> => {
  const mapper = mappers[contract as Contracts]
  if (!mapper) {
    return Promise.resolve('')
  }

  return Promise.resolve(mapper(tokenId))
}