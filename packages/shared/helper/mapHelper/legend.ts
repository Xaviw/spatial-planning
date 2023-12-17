export function createLegendProxy(
  config: Loca.LegendProps,
  loca: Loca.Container,
) {
  const source: Required<Omit<Loca.LegendProps, 'loca'>> = {
    style: config.style || {},
    title: config.title || {},
    dataMap: config.dataMap || [],
  }

  const proxySource = {
    style: createPropProxy('style'),
    title: createPropProxy('title'),
    dataMap: createPropProxy('dataMap'),
  }

  const proxy = new Proxy(proxySource, {
    set(target, key, value, receiver) {
      if (key === 'style' || key === 'title' || key === 'dataMap') {
        source[key] = value
        const result = Reflect.set(
          target,
          key,
          createPropProxy(key as any),
          receiver,
        )
        if (['style', 'title'].includes(key)) {
          instance.setStyle(proxy)
        } else {
          instance?.remove()
          instance = new Loca.Legend({ ...proxy, loca })
        }
        return result
      }
      return Reflect.set(target, key, value, receiver)
    },
  })

  let instance = new Loca.Legend({ ...proxy, loca })

  function createPropProxy(name: 'style'): Loca.LegendStyle
  function createPropProxy(name: 'title'): Loca.LegendTitle
  function createPropProxy(name: 'dataMap'): Loca.LegendDataMapItem[]
  function createPropProxy(name: 'style' | 'title' | 'dataMap') {
    if (name === 'style' || name === 'title') {
      return new Proxy(source[name], {
        set(target, key, value, receiver) {
          const result = Reflect.set(target, key, value, receiver)
          instance.setStyle(proxy)
          return result
        },
      })
    } else {
      return new Proxy(source.dataMap, {
        set(target, key, value, receiver) {
          const result = Reflect.set(target, key, value, receiver)
          instance?.remove()
          instance = new Loca.Legend({ ...proxy, loca })
          return result
        },
      })
    }
  }

  return { proxy, instance }
}
