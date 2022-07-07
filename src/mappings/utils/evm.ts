import { EMPTY_ADDRESS } from './constants'
import * as erc721 from '../../abi/erc721'
import * as erc1155 from '../../abi/erc1155'
import { Context, Interaction } from './types'
import { EvmLogHandlerOptions } from '@subsquid/substrate-evm-processor'

export type RealTransferEvent = erc721.TransferAddressAddressUint256Event | erc1155.TransferSingle0Event | erc1155.TransferBatch0Event


export const isMint = (addrOne: string, addrTwo: string) => {
  return addrOne === EMPTY_ADDRESS && addrTwo !== EMPTY_ADDRESS
}

export const isBurn = (addrOne: string, addrTwo: string) => {
  return addrTwo === EMPTY_ADDRESS && addrOne !== EMPTY_ADDRESS
}

export const isTransfer = (addrOne: string, addrTwo: string) => {
  return !(isMint(addrOne, addrTwo) || isBurn(addrOne, addrTwo))
}

export const whatIsThisTransfer = (transfer: RealTransferEvent): Interaction => {
  const { from, to } = transfer
  if (isMint(from, to)) {
    return Interaction.MINTNFT
  }
  if (isBurn(from, to)) {
    return Interaction.CONSUME
  }

  return Interaction.SEND
}

export function decode721Transfer(event: Context): erc721.TransferAddressAddressUint256Event {
  return erc721.events["Transfer(address,address,uint256)"].decode(event)
}

export function decode1155SingleTransfer(event: Context): erc1155.TransferSingle0Event {
  return erc1155.events["TransferSingle(address,address,address,uint256,uint256)"].decode(event)
}

export function decode1155MultiTransfer(event: Context): erc1155.TransferBatch0Event {
  return erc1155.events["TransferBatch(address,address,address,uint256[],uint256[])"].decode(event)
}

export function decode1155UriChange(event: Context): erc1155.URI0Event {
  return erc1155.events["URI(string,uint256)"].decode(event)
}

export const transferFilter: EvmLogHandlerOptions = {
  filter: [erc721.events["Transfer(address,address,uint256)"].topic],
}

export const singleTransferFilter: EvmLogHandlerOptions = {
  filter: [erc1155.events["TransferSingle(address,address,address,uint256,uint256)"].topic],
}

export const multiTransferFilter: EvmLogHandlerOptions = {
  filter: [erc1155.events["TransferBatch(address,address,address,uint256[],uint256[])"].topic],
}

export const uriChangeFilter: EvmLogHandlerOptions = {
  filter: [erc1155.events["URI(string,uint256)"].topic],
}