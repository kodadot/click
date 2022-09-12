import { CollectionEntity, CollectionType } from './model'

export enum Event {
  executed = 'ethereum.Executed'
}

export enum Contracts {
  ExiledRacersPilots = '0x515e20e6275ceefe19221fc53e77e38cc32b80fb',
  ExilredRacersRacecrafts = '0x104b904e19fbda76bb864731a2c9e01e6b41f855',
  GlmrApes = '0x8fbe243d898e7c88a6724bb9eb13d746614d23d6',
  Moonpets = '0x2159762693c629c5a44fc9bafd484f8b96713467',
  GlmrJungle = '0xcb13945ca8104f813992e4315f8ffefe64ac49ca',
  GlmrPunks = '0x25714fcbc4be731b95ae86483ef97ef6c3deb5ce',
  MoonbeamPunks = '0xfd86d63748a6390e4a80739e776463088811774d',
  MoonbeamLegendaryPunks = '0xadc88ebb18d8f9a54890303c9ba4501b1e8a221e',
  ClipperSurvivorPatch = '0x292cfcb8e1455ac95b45b35bcccd7e09a840fefc',
  GlmrApesBoost = '0xb9f2d4bbfdccad1e2239a4f7b8c917c984e9b863',
  HamstersGang = '0xd105e0da7fdc86192469654fb565c2f584920da0',
  Moonfit = '0x6758053c0b27e478ede1e4882adff708fc4fa72d'
}

export const ContractsMap: Record<Contracts, any> = {
  [Contracts.ExiledRacersPilots]: toMap('Exiled Racers Pilot', 'EXRP', 1656, '0x4929f7cb5977bc07c4DF658086aaF25c20052FbA', 'QmYned7JtjauvTWWP9vWK9bBRceLKzsEXhoe2YHLDWNhjx/1'),
  [Contracts.ExilredRacersRacecrafts]: toMap('Exiled Racers Racecraft', 'EXRR', 1525, '0x4929f7cb5977bc07c4DF658086aaF25c20052FbA', 'QmSau6DDfzzsfMh5q9v8S4TnfFrbVu27NfKfy8dWKrHU8v/1'),
  [Contracts.GlmrApes]: toMap('GlimmerApes', 'GLMA', 1001, '0xbCe5F532Fdba96F131682E97ce4aFEa8b778480C', 'QmUTChL9YohXWWNNNKoqvh6oCpib4eTiPMr5fbGYRedhUv/1.json'),
  [Contracts.Moonpets]: toMap('MOONPETS', 'MOONPETS', 5000, '0x679EB835b6d86416caE179A51dB99c3b2f423eD5', 'QmV56th23uMSxyWRveeriW8ScjnnbPRwQy2XvpumcqX8Qb/1.json'),
  [Contracts.GlmrJungle]: toMap('GLMR JUNGLE', 'GLMJ', 3333, '0xbCe5F532Fdba96F131682E97ce4aFEa8b778480C', 'https://www.glmrjungle.com/nfts/1.json'),
  [Contracts.GlmrPunks]: toMap('GlmrPunks', 'GPUNKS', 1714, '0x1859CE51044d2171AA9ff8016399EDe4d5536257', 'QmXoHd7JKjZ8WaCC6yL38wpsVW1SrFyvimBB6TRWMzx1sz/1.json'),
  [Contracts.MoonbeamPunks]: toMap('Moonbeam Punks', 'PUNK', 4200, '0x5676CFDC6A27D150547f5aa1b37815D15CEc2d75', 'QmPWo92k7yG4KBs9mWxS9LpAg3psobwq5cPVLc218De6HJ/1.json'),
  [Contracts.MoonbeamLegendaryPunks]: toMap('Moonbeam Legendary Punks', 'LPUNK', 800, '0xC9dc772B2196Fc489251288A681843B5bF3F0beb', 'QmWQUM5Wv5aVbidjeoqqmRworW15dr57KfZ1ynLUCJiUdv/1.json'),
  [Contracts.ClipperSurvivorPatch]: toMap('Clipper Survivor NFT (April 2022)', 'CLPSURV0422', 310, '0x960376b3F62f41E7e66809a05D1C5afdFD60A0E9', 'bafybeihtfqplc72hbq4xyoymjltduxk3mepqzydquzmfipmm2r5jn6qrwu/1.json'),
  [Contracts.GlmrApesBoost]: toMap('Bunch Of Bananas', 'BOB', 125, '0xd8C81D0706a027B870c20cC386BBffb15A36815e', 'QmcSR6y8Hmt7oNu4mNVhzp8nusN8RrCyWu3PvvNXgYNPR6/1.json'),
  [Contracts.HamstersGang]: toMap('Hamsters Gang', 'GANG', 1686, '0xb726dEb0AaEA51Efb536075324f2f14B1681d425', 'QmTrje5afpz6ZM8BbY3fpMLL3KG6DJbigLHRBfsryXFtor/1.json'),
  [Contracts.Moonfit]: toMap('MoonFit Mint Pass', 'MFMP', 1806, '0xC280b576e92212b0450558094969f7Cc928892e4', 'https://bafybeiaqkklaps635kujsuzb34wbyds2maihfa5hcanmutawixu6ny56de.ipfs.nftstorage.link/1.json'),
}

function toMap(name: string, symbol: string, max: number, issuer: string, meta: string, type: CollectionType = CollectionType.ERC721): Partial<CollectionEntity> {
  return {
    name,
    symbol,
    max,
    type,
    metadata: meta ? `ipfs://ipfs/${meta}` : undefined,
    currentOwner: issuer,
    issuer,
    updatedAt: new Date(),
    createdAt: new Date(),
  }
}