export function createPolylineProxy(
  config: AMap.PolylineOptions,
  map?: AMap.Map,
) {
  const source: AMap.PolylineOptions = {
    ...config,
    path: config.path || [],
  }

  const proxySource: AMap.PolylineOptions = {
    ...config,
    path: createPropProxy('path'),
  }

  const proxy = new Proxy(proxySource, {
    set(target, key, value, receiver) {
      if (key === 'path' || key === 'strokeDasharray') {
        source[key] = value
        return Reflect.set(target, key, createPropProxy(key), receiver)
      } else if (key === 'extData') {
        source[key] = value
        const result = Reflect.set(target, key, value, receiver)
        instance.setExtData(value)
        return result
      } else if (typeof key === 'string') {
        source[key as keyof AMap.PolylineOptions] = value
        const result = Reflect.set(target, key, value, receiver)
        instance.setOptions(proxy)
        return result
      }
      return Reflect.set(target, key, value, receiver)
    },
  })

  let instance = new AMap.Polyline(proxy)
  if (map) {
    map.add(instance)
  }

  function createPropProxy<
    T extends keyof Pick<AMap.PolylineOptions, 'path' | 'strokeDasharray'>,
  >(key: T): AMap.PolylineOptions[T] {
    if (key === 'path' && Array.isArray(source[key])) {
      return new Proxy(source.path!, {
        set(target, key, value, receiver) {
          const result = Reflect.set(target, key, value, receiver)
          instance.setPath(source.path)
          return result
        },
      }) as any
    } else if (Array.isArray(source[key])) {
      return new Proxy(source[key] as any[], {
        set(target, key, value, receiver) {
          const result = Reflect.set(target, key, value, receiver)
          instance.setOptions(proxy)
          return result
        },
      }) as any
    }
    return source[key]
  }

  /** 替换实例，用于手动绘制时替换数据生成的实例 */
  function replaceInstance(newInstance: AMap.Polyline) {
    instance = newInstance
  }

  /** 替换原数据，用于手动调整覆盖物时同步原数据 */
  function replaceSource(config: AMap.PolylineOptions) {
    for (const key in config) {
      if ((key === 'path' || key === 'strokeDasharray') && config[key]) {
        source[key] = config[key] as any
        proxySource[key] = createPropProxy(key) as any
      } else {
        source[key as keyof AMap.PolylineOptions] =
          config[key as keyof AMap.PolylineOptions]

        proxySource[key as keyof AMap.PolylineOptions] =
          config[key as keyof AMap.PolylineOptions]

        if (key === 'extData') {
          instance.setExtData(config[key])
        }
      }
    }
  }

  return { proxy, instance, replaceInstance, replaceSource }
}
