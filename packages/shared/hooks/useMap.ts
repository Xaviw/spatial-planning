import AMapLoader from '@amap/amap-jsapi-loader'
import type { Loca } from '#/loca'
import type { AMap } from '@amap/amap-jsapi-types'
import type { MaybeRef, Ref } from 'vue'

interface UseMapOptions<T extends boolean> {
  loaderOptions?: Partial<Parameters<typeof AMapLoader.load>[0]>
  mapOptions?: Partial<AMap.MapOptions>
  enableLoca?: T
}

export function useMap<T extends boolean = false>(
  container: MaybeRef<HTMLDivElement | null> | string,
  { loaderOptions = {}, mapOptions = {}, enableLoca }: UseMapOptions<T> = {},
  onComplete?: (
    map: AMap.Map,
    loca: T extends true ? Loca.Container : undefined,
  ) => void,
): T extends true
  ? { map: Ref<AMap.Map>; loca: Ref<Loca.Container> }
  : { map: Ref<AMap.Map> } {
  const loca = ref<Loca.Container>()
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
      map.value.on(
        'complete',
        onComplete.bind(
          null,
          map.value,
          enableLoca ? loca.value : (undefined as any),
        ),
      )
    }
  })

  onUnmounted(() => {
    loca.value?.destroy()
    map.value?.destroy()
  })

  return { map, loca: enableLoca ? loca : undefined } as any
}
