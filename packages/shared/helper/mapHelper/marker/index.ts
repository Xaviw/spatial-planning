import { isEmpty, isString, isObject } from 'lodash-es'
import { reactiveOverlay } from '../index'

export function createMarker(opts: AMap.MarkerOptions, map?: AMap.Map) {
  let instance = new AMap.Marker(opts)
  if (map) {
    map.add(instance)
  }

  const { proxy, replaceSource } = reactiveOverlay(
    opts,
    {
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
          instance.setIcon(
            new AMap.Icon(proxy.icon as unknown as AMap.IconOpts),
          )
        }
      },
      content(value) {
        instance.setContent(value)
      },
      title(value) {
        instance.setTitle(value)
      },
      // visible(value) {
      //   if (value) {
      //     instance.show()
      //   } else {
      //     instance.hide()
      //   }
      // },
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
      // clickable(value) {
      //   instance.setClickable(value)
      // },
      // draggable(value) {
      //   instance.setDraggable(value)
      // },
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
    },
    ['extData'],
  )

  return {
    proxy,
    replaceSource,
    replaceInstance(newInstance: AMap.Marker) {
      instance = newInstance
    },
  }
}
