export function createLegendProxy(
  opts: Loca.LegendProps,
  loca: Loca.Container,
) {
  let legend: Loca.Legend

  const styleHandler = <
    T extends Loca.LegendStyle | Loca.LegendTitle,
  >(): ProxyHandler<T> => ({
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      legend.setStyle(legendProxy)
      return result
    },
  })

  const style = new Proxy(opts.style || {}, styleHandler<Loca.LegendStyle>())
  const title = new Proxy(opts.title || {}, styleHandler<Loca.LegendTitle>())

  const dataMap = new Proxy(opts.dataMap, {
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      render()
      return result
    },
  })

  const legendProxy = new Proxy(
    { style, title, dataMap },
    {
      set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver)
        if (key === 'title' || key === 'style') {
          legend.setStyle(legendProxy)
        } else if (key === 'dataMap') {
          render()
        }
        return result
      },
    },
  )

  render()

  function render() {
    legend?.remove()
    legend = new Loca.Legend({ ...legendProxy, loca })
  }

  return legendProxy
}
