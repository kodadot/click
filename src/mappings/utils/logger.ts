import singale from 'signale'
import { RealTransferEvent } from './evm'
import { serializer } from './serializer'

type ErrorCallback = (error: Error) => void

export const logError = (e: Error | unknown, cb: ErrorCallback) => {
  if (e instanceof Error) {
    cb(e)
  }
}

export const metaLog = (
  interaction: string,
  everythingElse: any
) =>
  singale.debug(
    `[[${interaction}]]: ${JSON.stringify(everythingElse, serializer, 2)}`
  )

export const transferDebug = (interaction: string, transfer: RealTransferEvent) => singale.debug(`[[${interaction}]]: [${transfer.from}, ${transfer.to}, ${(transfer as any).tokenId || (transfer as any).id}, ${(transfer as any).value || 1}]`)

export default singale
