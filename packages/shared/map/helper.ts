import { InjectionKey, Ref } from 'vue'
import type { AMap } from '@amap/amap-jsapi-types'

export const mapKey: InjectionKey<Ref<AMap.Map>> = Symbol('map-key')
