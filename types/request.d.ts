import { ResCode } from '../packages/shared/utils/enums'

export interface Res<T> {
  code: ResCode
  data: T
  message: string
}
