import singale from 'signale'
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

export default singale
