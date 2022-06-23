import { EMPTY_ADDRESS } from './constants'


export const isMint = (addrOne: string, addrTwo: string) => {
  return addrOne === EMPTY_ADDRESS && addrTwo !== EMPTY_ADDRESS
}


export const isBurn = (addrOne: string, addrTwo: string) => {
  return addrTwo === EMPTY_ADDRESS && addrOne !== EMPTY_ADDRESS
}

export const isTransfer = (addrOne: string, addrTwo: string) => {
  return !(isMint(addrOne, addrTwo) || isBurn(addrOne, addrTwo))
}