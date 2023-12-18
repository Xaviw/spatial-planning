export function createEllipseProxy(
  config: AMap.EllipseOptions,
  map?: AMap.Map,
) {
  const source: AMap.EllipseOptions = {
    ...config,
  }

  const proxySource: AMap.EllipseOptions = {
    ...config,
  }

  const proxy = new Proxy(proxySource, {
    set(target, key, value, receiver) {
      if (key === 'strokeDasharray') {
        source[key] = value
        return Reflect.set(target, key, createPropProxy(key), receiver)
      } else if (key === 'extData') {
        source[key] = value
        const result = Reflect.set(target, key, value, receiver)
        instance.setExtData(value)
        return result
      } else if (typeof key === 'string') {
        source[key as keyof AMap.EllipseOptions] = value
        const result = Reflect.set(target, key, value, receiver)
        instance.setOptions(proxy)
        return result
      }
      return Reflect.set(target, key, value, receiver)
    },
  })

  let instance = new AMap.Ellipse(proxy)
  if (map) {
    map.add(instance)
  }

  function createPropProxy<
    T extends keyof Pick<AMap.EllipseOptions, 'strokeDasharray'>,
  >(key: T): AMap.EllipseOptions[T] {
    if (Array.isArray(source[key])) {
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
  function replaceInstance(newInstance: AMap.Ellipse) {
    instance = newInstance
  }

  /** 替换原数据，用于手动调整覆盖物时同步原数据 */
  function replaceSource(config: AMap.EllipseOptions) {
    for (const key in config) {
      if (key === 'strokeDasharray' && config[key]) {
        source[key] = config[key] as any
        proxySource[key] = createPropProxy(key) as any
      } else {
        source[key as keyof AMap.EllipseOptions] =
          config[key as keyof AMap.EllipseOptions]

        proxySource[key as keyof AMap.EllipseOptions] =
          config[key as keyof AMap.EllipseOptions]

        if (key === 'extData') {
          instance.setExtData(config[key])
        }
      }
    }
  }

  return { proxy, instance, replaceInstance, replaceSource }
}
