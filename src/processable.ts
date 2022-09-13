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
  Moonfit = '0x6758053c0b27e478ede1e4882adff708fc4fa72d',
  CanaryNetworkAgency = '0x139e9ba28d64da245ddb4cf9943aa34f6d5abfc5',
  MoonFitBeastandBeauty = '0x02a6dec99b2ca768d638fcd87a96f6069f91287c',
  BoredPuppetYachtClub = '0xd364fb95989f5a47ddb9665149dd750782d37c7f',
  TheUltimateHarvestMoonCampaign = '0x51737fa634e26f5687e45c6ca07604e064076350',
  // Groomlins = '0xf27a6c72398eb7e25543d19fda370b7083474735',
  // EXRMintPass = '0x3507fd182dc5bd1b29214950fdcde40bd167114f',
  // EXRInventory = '0xa0b48010ff75136bbb5c8a12fedfa37160819834',
}

export const ContractsMap: Record<string, any> = {
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
  [Contracts.Moonfit]: toMap('MoonFit Mint Pass', 'MFMP', 1806, '0xC280b576e92212b0450558094969f7Cc928892e4', 'bafybeiaqkklaps635kujsuzb34wbyds2maihfa5hcanmutawixu6ny56de/1.json'),
  [Contracts.CanaryNetworkAgency]: toMap('Canary Network Agency', 'CNA', 697, '0xa25b6FefE3e397E179DB42837a5e424120243E6A', 'QmYKUkwXHCrMxX9MVQkaFc7Sbe2bhTJ7qF1aBSx3tqFMCa'),
  [Contracts.MoonFitBeastandBeauty]: toMap('MoonFit Beast and Beauty', 'MFBB', 500, '0xC280b576e92212b0450558094969f7Cc928892e4', 'bafybeigexr53jlkwvyiinqt23haux3sthoo236yjnjhzvyoqbelvvlhoga/1.json'),
  [Contracts.BoredPuppetYachtClub]: toMap('Bored Puppet Yacht Club', 'BPYC', 1130, '0x28dBe185a9eCB314cAA02ec315082a6527638D73', 'QmdfZuWPf5AizhEoVN7LEE1QZ57Sx4U3rze4rhCDzakUgo/1.json'),
  [Contracts.TheUltimateHarvestMoonCampaign]: toMap('Ultimate Harvest Moon Campaign', 'NFT (Project Galaxy)', 41532, '0xD2c31F9D511391AE98826d39dB908b2fB351C47C', ''),
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