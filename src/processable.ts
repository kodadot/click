import { CollectionEntity, CollectionType } from './model'

export enum Event {
  executed = 'ethereum.Executed'
}

export enum Contracts {
  DPS = '0xb6e9e605aa159017173caa6181c522db455f6661',
  Beanies = '0xd3a9c48df4d9342dc1a0ee2c185ce50588729fa9',
  BUDS = '0x28e0a6c52707d8225ff9b15d85a4ddaea7352e5d',
  NCR1 = '0xa90f3fc517d9126976dd59c5efec8de447f7ff7e',
  NCR2 = '0x2d4a19b306a496be628469de820f0367a13178e5',
  MoonRiverQuest = '0x79c8c73f85ec794f570aa7b768568a7fedb294f8',
  // BAYC  = '0x13387e68eeb2c9d31315b9abc9c02b0624ee68ca',
  BadDads = '0xb43737031be39551fa3805debef0f361b344b06f',
  BAYMAP = '0xad18eea5413f3340ac2d9e2f081114e042398c90',
  BYPC = '0xb8017e9660960c58b63d2deda983de4a7912e379',
  BlvckMarketCyan = '0xd6bc34cfc5f4c5079b0022e4060dba3a6a6b256d',
  // BlvckMarket = '0xfed9e29b276c333b2f11cb1427142701d0d9f7bf',
  BlvckSnakesForrest  = '0x09a7f6e904bd6293ed382e905895efd0983f325f',
  CryptoButchers = '0x0dad866dc0c13fb8e4a91d1b5e83cf3a61d4cee2',
  MoonShroomiz = '0x2f26efdb7233a014715ce6e895aa67d846d93f1e',
}

export const ContractsMap: Record<Contracts, any>  = {
  [Contracts.DPS]: toMap('Damned Pirates Society', 'DPS', 3000, '0xee6a0d688aA4b6a6BCfd4abEfFCB5ff731aFA9A0', 'QmPxvsXf97jd1ZdHAFfmbrH8CvBXw5nQPeB1HA47odRbLz/1'),
  [Contracts.Beanies]: toMap('BEANS NFT', 'Beanies', 462, '0x24312a0b911fE2199fbea92efab55e2ECCeC637D', 'QmU4GvDw8VX9We7wg5QrxLmukV4ZWUuGCgxjX9ninDCXMP/1.json'),
  [Contracts.BUDS]: toMap('BeanieBuds', 'BUDS', 287, '0x24312a0b911fE2199fbea92efab55e2ECCeC637D', 'QmWH8RUZebD5JfsmzYHA8rT6zirXZrHpa5HFA8n7q7SZNz/1.json'),
  [Contracts.NCR1]: toMap('NCR Pack 1', 'NCRPK1', 741, '0x1BFBc0c91287de1A13F164BbbDE61D1C959b9A59', ''),
  [Contracts.NCR2]: toMap('Neon Crisis V2', 'NCR', 1107, '0x1BFBc0c91287de1A13F164BbbDE61D1C959b9A59', ''),
  [Contracts.MoonRiverQuest]: toMap('Moonriver NFT Quest', 'NFTQ', 700, '0x96D189950A64ec5FE286AdE343876b2BEDaa5ab9', 'QmV6kfJg6C9BrvyqSLE4aFfWLnwiGh7FCBebPcG8JbovZs'),
  [Contracts.BadDads]: toMap('BadDads', 'BAD', 445, '0x3Da326715902b2F9c4e24A98a943A6AB80767638', 'QmaJaejKSMGeRvEmaUZmjQzsK849X76Z42eBR937n8THqu/1.json'),
  [Contracts.BAYMAP]: toMap('Bay Island Lost Map', 'BAYMAP', 408, '0xA0374df63cc1C4233F1c4E470F7733B7E2b12626', 'Qmax53G4ajDtU3uTWmswUE2C9FVTEPHhdpfeTkQxGr9WK8'),
  [Contracts.BYPC]: toMap('Bored Puppets Yacht Club', 'BPYC', 303, '0x28dBe185a9eCB314cAA02ec315082a6527638D73', 'QmVEGva1f6d8HXHuwaMLGfxyVEpvkc4XWnbwbcmyD8M1ug/1.json'),
  [Contracts.BlvckMarketCyan]: toMap('BlvckMarketCyan', 'BMACYAN1OF1', 1073, '0x56b0b239508f63C5a38558c6987cca0195d62039', 'QmQHd7Wa4FZv4N36MSNNHLvbqjTgkf5XZrUfc6ap97cQoC/1.json'),
  // [Contracts.BlvckMarket]: toMap('BlvckMarketNFT', 'BMANFT', 1333, '0x56b0b239508f63C5a38558c6987cca0195d62039', 'QmcuV7UqedmTKVzQ9yD2QNm3dhiaN5JXdqRtJTFKqTJEL3'),
  [Contracts.BlvckSnakesForrest]: toMap('BlvckMarketDvrkForest', 'BMADVRKFOREST', 717, '0x56b0b239508f63C5a38558c6987cca0195d62039', 'QmYSThWjHh3swx2qXxGM6MMdv35hvCmaptNZFDXZisUHzi/1.json'),
  [Contracts.CryptoButchers]: toMap('CryptoButchers', 'BUTCHER', 7776, '0xaE9ccb445f793ED458e73505644ef2FADfb17Ac8', 'QmVBDKihHMMnbMysmazLzZck5ySE2wJjbHChFVC7qzAw5W/1.json'),
  [Contracts.MoonShroomiz]: toMap('MoonShroomiz', 'MSHZ', 500, '0xbCe5F532Fdba96F131682E97ce4aFEa8b778480C', 'QmXvfjHAiaJHTu5692YofHZunvRJdZiPpcepw8pu4B3wuf/1.json'),
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