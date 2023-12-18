export function createBezierCurveProxy(
  config: AMap.BezierCurveOptions,
  map?: AMap.Map,
) {
  const source: AMap.BezierCurveOptions = {
    ...config,
    path: config.path || [],
  }

  const proxySource: AMap.BezierCurveOptions = {
    ...config,
    path: createPathProxy(),
  }

  const proxy = new Proxy(proxySource, {
    set(target, key, value, receiver) {
      if (key === 'path') {
        source[key] = value
        return Reflect.set(target, key, createPathProxy(), receiver)
      } else if (key === 'extData') {
        source[key] = value
        const result = Reflect.set(target, key, value, receiver)
        instance.setExtData(value)
        return result
      } else if (typeof key === 'string') {
        source[key as keyof AMap.BezierCurveOptions] = value
        const result = Reflect.set(target, key, value, receiver)
        instance.setOptions(proxy)
        return result
      }
      return Reflect.set(target, key, value, receiver)
    },
  })

  let instance = new AMap.BezierCurve(proxy)
  if (map) {
    map.add(instance)
  }

  function createPathProxy() {
    return new Proxy(source.path!, {
      set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver)
        instance.setPath(source.path)
        return result
      },
    })
  }

  /** 替换实例，用于手动绘制时替换数据生成的实例 */
  function replaceInstance(newInstance: AMap.BezierCurve) {
    instance = newInstance
  }

  /** 替换原数据，用于手动调整覆盖物时同步原数据 */
  function replaceSource(config: AMap.BezierCurveOptions) {
    for (const key in config) {
      if (key === 'path') {
        source.path = config.path || []
        proxySource.path = createPathProxy()
      } else {
        source[key as keyof AMap.BezierCurveOptions] =
          config[key as keyof AMap.BezierCurveOptions]

        proxySource[key as keyof AMap.BezierCurveOptions] =
          config[key as keyof AMap.BezierCurveOptions]

        if (key === 'extData') {
          instance.setExtData(config[key])
        }
      }
    }
  }

  return { proxy, instance, replaceInstance, replaceSource }
}
