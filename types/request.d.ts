export interface Res<T> {
  code: 0 | 1
  data: T
  message: string
}

export interface RequestMeta {
  isReturnNativeResponse?: boolean
  errorMessageMode?: 'message' | 'modal' | 'notify' | 'none'
}
