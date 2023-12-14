import AMapLoader from '@amap/amap-jsapi-loader'
import '@amap/amap-jsapi-types'
import type { MaybeRef } from 'vue'

interface UseMapOptions {
  container: MaybeRef<HTMLDivElement | null> | string
  loaderOptions?: Partial<Parameters<typeof AMapLoader.load>[0]>
  mapOptions?: Partial<AMap.MapOptions>
  onComplete?: (map: AMap.Map, loca: any) => void
  enableLoca?: boolean
}

export function useMap({
  container,
  loaderOptions = {},
  mapOptions = {},
  onComplete,
  enableLoca,
}: UseMapOptions) {
  const loca = ref<typeof window.Loca>()
  const map = ref<AMap.Map>()

  onMounted(async () => {
    window._AMapSecurityConfig = {
      securityJsCode: import.meta.env.VITE_AMAP_SECURITY_KEY,
    }

    const AMap: typeof window.AMap = await AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY,
      version: '2.0',
      Loca: enableLoca ? { version: '2.0.0' } : undefined,
      ...loaderOptions,
    })

    const containerElement =
      typeof container === 'string'
        ? (document.querySelector(container) as HTMLDivElement)
        : unref(container)

    if (!containerElement) throw new Error('未获取到地图容器！')

    map.value = new AMap.Map(containerElement, mapOptions)

    if (enableLoca) {
      loca.value = new window.Loca.Container({ map: map.value })
    }

    if (onComplete) {
      map.value.on('complete', onComplete.bind(null, map.value, loca.value))
    }
  })

  onUnmounted(() => {
    loca.value?.destroy()
    map.value?.destroy()
  })

  return { map, loca }
}
