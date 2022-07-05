import { assertNotNull, Store } from "@subsquid/substrate-evm-processor"
import { Contract, ethers } from "ethers"
import * as erc721 from "./abi/erc721"
import { CollectionEntity, CollectionType } from "./model"
import { Contracts, ContractsMap } from "./processable"
 
export const CHAIN_NODE = "wss://moonriver.api.onfinality.io/public-ws"
// export const CHAIN_NODE = "wss://wss.api.moonriver.moonbeam.network";

export const contract = new ethers.Contract(
  "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a",
  erc721.abi,
  new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export const tokenUriOf = (contract: string, tokenId: string): Promise<string> => {
  return contractify(contract).tokenURI(tokenId).catch(() => "");
}

export const metadataFromUri = (contract: Contracts | string, tokenId: string): Promise<string> => {
  const { type } = ContractsMap[contract as Contracts];
  return isERC721(type) ? tokenUriOf(contract, tokenId) : uriOf(contract, tokenId);
}

export const uriOf = (contract: string, tokenId: string): Promise<string> => {
  return contractify(contract, CollectionType.ERC1155).uri(tokenId).catch(() => "");
}

export const baseUriOf = (contract: string): Promise<string> => {
  return contractify(contract).baseURI().catch(() => "");
}

function contractify(address: string, type = CollectionType.ERC721): Contract {
  return contract.attach(address);
}

export function eitherOr<T>(type = CollectionType.ERC721, one: T, two: T): T {
  return isERC721(type) ? one : two;
}

export function isERC721(type: CollectionType): boolean {
  return type === CollectionType.ERC721;
}

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
