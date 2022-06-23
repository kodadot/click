import { assertNotNull, Store } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import * as erc721 from "./abi/erc721";
import { CollectionEntity, CollectionType } from "./model";
 
export const CHAIN_NODE = "wss://wss.api.moonriver.moonbeam.network";

export const contract = new ethers.Contract(
  "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a",
  erc721.abi,
  new ethers.providers.WebSocketProvider(CHAIN_NODE)
);
 
export function createContractEntity(): CollectionEntity {
  return new CollectionEntity({
    id: contract.address,
    name: "Moonsama",
    symbol: "MSAMA",
    max: 1000,
    currentOwner: '0x05b9b543328d4c797e1eec747efc65d97de542f2',
    issuer: '0x05b9b543328d4c797e1eec747efc65d97de542f2',
    updatedAt: new Date(),
    createdAt: new Date(),
    type: CollectionType.ERC721,
  });
}
 
let contractEntity: CollectionEntity | undefined;
 
export async function getContractEntity({
  store,
}: {
  store: Store;
}): Promise<CollectionEntity> {
  if (contractEntity == null) {
    contractEntity = await store.get(CollectionEntity, contract.address);
  }
  return assertNotNull(contractEntity);
}
