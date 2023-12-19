import { reactiveOverlay } from './index'

export function createLegendProxy(
  config: Loca.LegendProps,
  loca?: Loca.Container,
) {
  let instance = new Loca.Legend(config)

  if (loca) {
    instance.addTo(loca)
  }

  const { proxy, replaceSource } = reactiveOverlay(config, {
    style() {
      instance.setStyle(proxy)
    },
    title() {
      instance.setStyle(proxy)
    },
    dataMap() {
      instance?.remove()
      instance = new Loca.Legend(proxy)
      if (loca) {
        instance.addTo(loca)
      }
    },
  })

  return {
    proxy,
    instance,
    replaceSource,
    replaceInstance(newInstance: Loca.Legend) {
      instance = newInstance
    },
  }
}
