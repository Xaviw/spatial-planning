import 'alova/GlobalFetch'
import { request } from '@sp/shared/utils'
// import type { Attachment } from '#/business'

export function getAttachment() {
  return request.Get<any>('/attachment')
}

export function upload(data: FormData) {
  return request.Post<string>('/attachment', data, {
    headers: { 'Content-Type': '' },
  })
}
