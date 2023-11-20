import { Method } from 'alova'
import { ResCode } from '../packages/shared/utils/enums'

export interface Res<T> {
  code: ResCode
  data: T
  message: string
}

export interface RequestMeta {
  isReturnNativeResponse?: boolean
  errorMessageMode?: 'message' | 'modal' | 'notify' | 'none'
}

declare module 'alova' {
  export interface Method {
    meta: RequestMeta
  }
}
