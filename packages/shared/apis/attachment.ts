import 'alova/GlobalFetch'
import { request } from '@sp/shared/utils'

export function checkHash(hash: string) {
  return request.Get<string | undefined>('/attachment/check', {
    params: { hash },
  })
}

export function upload(data: FormData) {
  return request.Post<string>('/attachment', data, { shareRequest: false })
}

export function mergeUpload(
  key: string,
  name: string,
  extName: string,
  hash: string,
) {
  return request.Get<string>('/attachment/merge', {
    params: { key, name, extName, hash },
  })
}
