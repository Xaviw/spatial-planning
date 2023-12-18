export function createPolygonProxy(
  config: AMap.PolygonOptions,
  map?: AMap.Map,
) {
  const source: AMap.PolygonOptions = {
    ...config,
    path: config.path || [],
  }

  const proxySource: AMap.PolygonOptions = {
    ...config,
    path: createPropProxy('path'),
  }

  const proxy = new Proxy(proxySource, {
    set(target, key, value, receiver) {
      if (
        key === 'path' ||
        key === 'wallColor' ||
        key === 'roofColor' ||
        key === 'strokeDasharray'
      ) {
        source[key] = value
        return Reflect.set(target, key, createPropProxy(key), receiver)
      } else if (key === 'extData') {
        source[key] = value
        const result = Reflect.set(target, key, value, receiver)
        instance.setExtData(value)
        return result
      } else if (typeof key === 'string') {
        source[key as keyof AMap.PolygonOptions] = value
        const result = Reflect.set(target, key, value, receiver)
        instance.setOptions(proxy)
        return result
      }
      return Reflect.set(target, key, value, receiver)
    },
  })

  let instance = new AMap.Polygon(proxy)
  if (map) {
    map.add(instance)
  }

  function createPropProxy<
    T extends keyof Pick<
      AMap.PolygonOptions,
      'path' | 'wallColor' | 'roofColor' | 'strokeDasharray'
    >,
  >(key: T): AMap.PolygonOptions[T] {
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
  function replaceInstance(newInstance: AMap.Polygon) {
    instance = newInstance
  }

  /** 替换原数据，用于手动调整覆盖物时同步原数据 */
  function replaceSource(config: AMap.PolygonOptions) {
    for (const key in config) {
      if (
        (key === 'path' ||
          key === 'wallColor' ||
          key === 'roofColor' ||
          key === 'strokeDasharray') &&
        config[key]
      ) {
        source[key] = config[key] as any
        proxySource[key] = createPropProxy(key) as any
      } else {
        source[key as keyof AMap.PolygonOptions] =
          config[key as keyof AMap.PolygonOptions]

        proxySource[key as keyof AMap.PolygonOptions] =
          config[key as keyof AMap.PolygonOptions]

        if (key === 'extData') {
          instance.setExtData(config[key])
        }
      }
    }
  }

  return { proxy, instance, replaceInstance, replaceSource }
}
