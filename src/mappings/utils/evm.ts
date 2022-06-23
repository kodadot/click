import { EMPTY_ADDRESS } from './constants'
import * as erc721 from '../../abi/erc721'
import { Context } from './types'


export const isMint = (addrOne: string, addrTwo: string) => {
  return addrOne === EMPTY_ADDRESS && addrTwo !== EMPTY_ADDRESS
}


export const isBurn = (addrOne: string, addrTwo: string) => {
  return addrTwo === EMPTY_ADDRESS && addrOne !== EMPTY_ADDRESS
}

export const isTransfer = (addrOne: string, addrTwo: string) => {
  return !(isMint(addrOne, addrTwo) || isBurn(addrOne, addrTwo))
}

export function decode721Transfer(event: Context): erc721.TransferAddressAddressUint256Event {
  return erc721.events["Transfer(address,address,uint256)"].decode(event)
}