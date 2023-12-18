export function createCircleMarkerProxy(
  config: AMap.CircleMarkerOptions,
  map?: AMap.Map,
) {
  const source: AMap.CircleMarkerOptions = config

  const proxy = new Proxy(source, {
    set(target, key, value, receiver) {
      if (key === 'extData') {
        const result = Reflect.set(target, key, value, receiver)
        instance.setExtData(value)
        return result
      } else if (typeof key === 'string') {
        const result = Reflect.set(target, key, value, receiver)
        instance.setOptions(proxy)
        return result
      }
      return Reflect.set(target, key, value, receiver)
    },
  })

  let instance = new AMap.CircleMarker(proxy)
  if (map) {
    map.add(instance)
  }

  /** 替换实例，用于手动绘制时替换数据生成的实例 */
  function replaceInstance(newInstance: AMap.CircleMarker) {
    instance = newInstance
  }

  /** 替换原数据，用于手动调整覆盖物时同步原数据 */
  function replaceSource(config: AMap.CircleMarkerOptions) {
    for (const key in config) {
      source[key as keyof AMap.CircleMarkerOptions] =
        config[key as keyof AMap.CircleMarkerOptions]

      if (key === 'extData') {
        instance.setExtData(config[key])
      }
    }
  }

  return { proxy, instance, replaceInstance, replaceSource }
}
