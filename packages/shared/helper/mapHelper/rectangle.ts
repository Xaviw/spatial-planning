export interface RectangleData extends Omit<AMap.RectangleOptions, 'bounds'> {
  bounds?: [[number, number], [number, number]]
}

export function createRectangleProxy(config: RectangleData, map?: AMap.Map) {
  const source: RectangleData = {
    ...config,
  }

  const proxySource: RectangleData = {
    ...config,
  }

  const proxy = new Proxy(proxySource, {
    set(target, key, value, receiver) {
      if (key === 'bounds') {
        source[key] = value
        const result = Reflect.set(target, key, createPropProxy(key), receiver)
        instance.setBounds(new AMap.Bounds(value))
        return result
      } else if (key === 'strokeDasharray') {
        source[key] = value
        return Reflect.set(target, key, createPropProxy(key), receiver)
      } else if (key === 'extData') {
        source[key] = value
        const result = Reflect.set(target, key, value, receiver)
        instance.setExtData(value)
        return result
      } else if (typeof key === 'string') {
        source[key as keyof RectangleData] = value
        const result = Reflect.set(target, key, value, receiver)
        instance.setOptions(proxy as AMap.RectangleOptions)
        return result
      }
      return Reflect.set(target, key, value, receiver)
    },
  })

  let instance = new AMap.Rectangle({
    ...proxy,
    bounds: new AMap.Bounds(proxy.bounds),
  })
  if (map) {
    map.add(instance)
  }

  function createPropProxy<
    T extends keyof Pick<RectangleData, 'strokeDasharray' | 'bounds'>,
  >(key: T): RectangleData[T] {
    if (Array.isArray(source[key])) {
      return new Proxy(source[key] as any[], {
        set(target, key, value, receiver) {
          const result = Reflect.set(target, key, value, receiver)
          if (key === 'bounds') {
            instance.setBounds(new AMap.Bounds(value))
          } else {
            instance.setOptions(proxy as AMap.RectangleOptions)
          }
          return result
        },
      }) as any
    }
    return source[key]
  }

  /** 替换实例，用于手动绘制时替换数据生成的实例 */
  function replaceInstance(newInstance: AMap.Rectangle) {
    instance = newInstance
  }

  /** 替换原数据，用于手动调整覆盖物时同步原数据 */
  function replaceSource(config: RectangleData) {
    for (const key in config) {
      if ((key === 'strokeDasharray' || key === 'bounds') && config[key]) {
        source[key] = config[key] as any
        proxySource[key] = createPropProxy(key) as any
      } else {
        source[key as keyof RectangleData] = config[key as keyof RectangleData]

        proxySource[key as keyof RectangleData] =
          config[key as keyof RectangleData]

        if (key === 'extData') {
          instance.setExtData(config[key])
        }
      }
    }
  }

  return { proxy, instance, replaceInstance, replaceSource }
}
