import { Contract, ethers } from "ethers"
import * as erc721 from "./abi/erc721"
import * as erc1155 from "./abi/erc1155"
import { CollectionType } from "./model"
import { Contracts, ContractsMap } from "./processable"
import { contractHasGraph, tokenUriOf as tokenMetaOf } from './mappings/utils/graph'
 
export const CHAIN_NODE = "wss://public-rpc.pinknode.io/moonriver"
export const HTTP_NODE = "https://moonriver.api.onfinality.io/public"

export const provider = new ethers.providers.StaticJsonRpcProvider(HTTP_NODE, {
  chainId: 1285,
  name: 'moonriver'
})
// export const CHAIN_NODE = "wss://wss.api.moonriver.moonbeam.network";

export const contract = new ethers.Contract(
  "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a",
  erc721.abi,
  provider
);

export const multiContract = new ethers.Contract(
  "0x1974eeaf317ecf792ff307f25a3521c35eecde86",
  erc1155.abi,
  provider
);

export const tokenUriOf = (contract: string, tokenId: string): Promise<string> => {
  return contractHasGraph(contract) ? tokenMetaOf(contract, tokenId) : contractify(contract).tokenURI(tokenId).catch(() => "");
  // return contractify(contract).tokenURI(tokenId).catch(() => "");
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
  return eitherOr(type, contract.attach(address), multiContract.attach(address));
}

export function eitherOr<T>(type = CollectionType.ERC721, one: T, two: T): T {
  return isERC721(type) ? one : two;
}

export function isERC721(type: CollectionType): boolean {
  return type === CollectionType.ERC721;
}