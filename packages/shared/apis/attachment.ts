import 'alova/GlobalFetch'
import { request } from '@sp/shared/utils'
import type { Attachment } from '#/business'

export function getAttachment() {
  return request.Get<Attachment[]>('/attachment')
}

export function checkHash(hash: string) {
  return request.Get<string | null>('/attachment/check', { params: { hash } })
}

export function upload(data: FormData) {
  return request.Post<string>('/attachment', data, { shareRequest: false })
}

export function mergeUpload(name: string, extName: string) {
  return request.Get<string>('/attachment/merge', { params: { name, extName } })
}
