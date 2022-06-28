import { CollectionEntity, CollectionType } from './model'

export enum Event {
  executed = 'ethereum.Executed'
}

export enum Contracts {
  Moonsama = '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a', // ERC-721
  Pondsama = '0xe4edcaaea73684b310fc206405ee80abcec73ee0', // ERC-721
  Moonx = '0x1974eeaf317ecf792ff307f25a3521c35eecde86', // ERC-1155
  Factory = '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777', // ERC-1155
  Art = '0xdea45e7c6944cb86a268661349e9c013836c79a2', // ERC-1155
  Plot = '0xa17a550871e5f5f692a69a3abe26e8dbd5991b75', // ERC-721
  Box = '0xd335417999ff2b9b59737244e554370264b3f877', // ERC-1155
  Embassy = '0x0a54845ac3743c96e582e03f26c3636ea9c00c8a', // ERC-1155
  Blvck = '0xfed9e29b276c333b2f11cb1427142701d0d9f7bf', // ERC-721
}

export const ContractsMap: Record<Contracts, any>  = {
  [Contracts.Moonsama]: toMap('Moonsama', 'MSAMA', 1000, 'QmWH3SmNPvHk8wRSojHk4ARLUcfFkvW6dECdTfvaM8APtG'),
  [Contracts.Pondsama]: toMap('Pondsama', 'PONDSAMA', 5715, 'QmTDjazcg4zvvnzvAHnwkpprttFYt3jKzwkAdRVn7XmqVE'),
  [Contracts.Moonx]: toMap('MoonX', 'MX', 0, 'QmdWRvx6GX1WQV4N7S3d8Yv6dqb4FB5NpCPag4DNQsfvp2', CollectionType.ERC1155),
  [Contracts.Factory]: toMap('Moonsama Multiverse Asset Factory', 'MMAF', 0, 'QmPXrp2YcqzzMrUD9VgN5xgQcosxmVpBXyGuFK9FmFNi18', CollectionType.ERC1155),
  [Contracts.Art]: toMap('Moonsama Multiverse Art', 'MMA', 0, 'QmUdFKHa6GhwTxQL5hkeHwxyoHaigcsXrisSRb2EmP5H3S', CollectionType.ERC1155),
  [Contracts.Plot]: toMap('Moonsama Minecraft Plots Season 1', 'MMPLOTS1', 338, 'QmacMxjCTQWY3uhpgDYxDn6xuq2DFXR4fn7RvZtCiUKFUg'),
  [Contracts.Box]: toMap('SamaBox', 'SAMABOX', 0, 'QmVBPfRFPK8Hs7LtZczHRNiacxUxt6NhWNcAaFinVJgewA', CollectionType.ERC1155),
  [Contracts.Embassy]: toMap('MoonsamaEmbassy', 'MEMBASSY', 0, 'Qmb5HvfNRuJAZZxubvpqCDrZ1ubjnSHXird93F43ceF5WW', CollectionType.ERC1155),
  [Contracts.Blvck]: toMap('BlvckMarketNFT', 'BMANFT', 1333, 'QmNzjvkBFQgtmZPJmBdVdEbLokGrb13UY9fNGwwJcPHrZs'),
}

function toMap(name: string, symbol: string, max: number, meta: string, type: CollectionType = CollectionType.ERC721): Partial<CollectionEntity> {
  return {
    name,
    symbol,
    max,
    type,
    metadata: meta ? `ipfs://ipfs/${meta}` : undefined,
    currentOwner: '0x05b9b543328d4c797e1eec747efc65d97de542f2',
    issuer: '0x05b9b543328d4c797e1eec747efc65d97de542f2',
    updatedAt: new Date(),
    createdAt: new Date(),
  }
}