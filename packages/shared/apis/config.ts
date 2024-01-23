import 'alova/GlobalFetch'
import { request } from '@sp/shared/utils'
import type { Config } from '#/business'

export function getConfig() {
  return request.Get<Config>('/config')
}

export function setConfig(data: Config) {
  return request.Put('/config', data)
}
