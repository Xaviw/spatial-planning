import { isEmpty, isString, isObject } from 'lodash-es'
import { createReactiveOverlay } from '../util'
import type { ReactiveOverlayExtData, OverlayItem } from '#/request'

export function createMarker(
  opts: OverlayItem<'Marker'>,
  map?: AMap.Map,
): ReactiveOverlayExtData<'Marker'> {
  let instance = new AMap.Marker(opts.props)
  if (map) {
    map.add(instance)
  }

  const { proxy, replaceSource } = createReactiveOverlay(opts.props, {
    position() {
      if (Array.isArray(proxy.position)) {
        instance.setPosition(proxy.position)
      }
    },
    icon() {
      if (isEmpty(proxy.icon)) return
      if (isString(proxy.icon)) {
        instance.setIcon(proxy.icon)
      } else if (isObject(proxy.icon as unknown as AMap.IconOpts)) {
        instance.setIcon(new AMap.Icon(proxy.icon as unknown as AMap.IconOpts))
      }
    },
    content(value) {
      instance.setContent(value)
    },
    title(value) {
      instance.setTitle(value)
    },
    visible(value) {
      if (value) {
        instance.show()
      } else {
        instance.hide()
      }
    },
    zIndex(value) {
      instance.setzIndex(value)
    },
    offset() {
      if (Array.isArray(proxy.offset)) {
        instance.setOffset(proxy.offset)
      }
    },
    anchor(value) {
      instance.setAnchor(value)
    },
    angle(value) {
      instance.setAngle(value)
    },
    clickable(value) {
      instance.setClickable(value)
    },
    draggable(value) {
      instance.setDraggable(value)
    },
    cursor(value) {
      instance.setCursor(value)
    },
    topWhenClick(value) {
      instance.setTop(value)
    },
    label() {
      if (isObject(proxy.label)) {
        instance.setLabel(proxy.label)
      }
    },
    extData() {
      instance.setExtData(proxy.extData)
    },
  })

  function replaceInstance(newInstance: AMap.Marker) {
    instance.destroy()
    instance = newInstance
  }

  opts.props = proxy

  const ro: ReactiveOverlayExtData<'Marker'> = {
    ...opts,
    instance,
    replaceSource,
    replaceInstance,
  }

  instance.setExtData(ro)

  return ro
}
