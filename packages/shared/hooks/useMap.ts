import AMapLoader from '@amap/amap-jsapi-loader'
import { is } from 'ramda'
import type { AMap } from '@amap/amap-jsapi-types'
import type { MaybeRef, Ref } from 'vue'

interface UseMapOptions {
  loaderOptions?: Partial<Parameters<typeof AMapLoader.load>[0]>
  mapOptions?: Partial<AMap.MapOptions>
}

export function useMap(
  container: MaybeRef<HTMLDivElement | null> | string,
  { loaderOptions = {}, mapOptions = {} }: UseMapOptions = {},
  onComplete?: (map: AMap.Map) => void,
): { map: Ref<AMap.Map> } {
  const map = ref<AMap.Map>()

  onMounted(async () => {
    window._AMapSecurityConfig = {
      securityJsCode: import.meta.env.VITE_AMAP_SECURITY_KEY,
    }

    const AMap: typeof window.AMap = await AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY,
      version: '2.0',
      ...loaderOptions,
    })

    const containerElement = is(String, container)
      ? (document.querySelector(container) as HTMLDivElement)
      : unref(container)

    if (!containerElement) throw new Error('未获取到地图容器！')

    map.value = new AMap.Map(containerElement, mapOptions)

    if (onComplete) {
      map.value.on('complete', onComplete.bind(null, map.value))
    }
  })

  onUnmounted(() => {
    map.value?.destroy()
  })

  return { map } as { map: Ref<AMap.Map> }
}
