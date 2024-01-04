import { ContentWrapper } from '@sp/shared/components'
import { useModal } from '@sp/shared/hooks'
import { components } from '@sp/shared/materials'
import { cloneDeep, isEqual, isNil, merge } from 'lodash-es'
import { useMapStore } from './mapStore'
import type {
  BezierCurveProps,
  CircleProps,
  EllipseProps,
  LayerItem,
  MarkerProps,
  OverlayItem,
  OverlayType,
  PolylineProps,
  RectangleProps,
  TextProps,
} from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const { open, close } = useModal('OverlayDetail')
/** 覆盖物详情弹窗 */
export function openDetail(data: OverlayItem<OverlayType>) {
  open(
    h(
      ContentWrapper,
      {
        title: data.detailTitle || `${data.name}详情`,
        onClose: close,
        style: { width: data.detailWidth || '25rem' },
      },
      () =>
        h(
          'div',
          {
            style: {
              maxHeight: '80vh',
              overflow: 'auto',
              backgroundColor: '#001231',
              color: '#fff',
            },
          },
          data.details.map(comp =>
            h(
              components[comp.type],
              merge(cloneDeep(comp.props), {
                style: { marginBottom: '0.5rem' },
              }),
            ),
          ),
        ),
    ),
  )
}

/** 在地图数据中查找覆盖物，返回图层、覆盖物、覆盖物下标 */
export function findOverlay(
  mapData: LayerItem<OverlayType>[],
  overlayId: string,
) {
  for (let i = 0; i < mapData.length; i++) {
    const layer = mapData[i]
    for (let j = 0; j < layer.overlays.length; j++) {
      const overlay = layer.overlays[j]
      if (overlay.id === overlayId) {
        return {
          overlay,
          layer,
          index: j,
        }
      }
    }
  }
}

/** 移动覆盖物到其他图层 */
export function moveOverlayToOtherLayer(
  mapData: LayerItem<OverlayType>[],
  overlayId: string,
  layerId: string,
) {
  const { layer, index, overlay } = findOverlay(mapData, overlayId) || {}
  // 目标图层等于原图层，不操作
  if (layer && layer.id !== layerId && index && overlay) {
    layer.overlays.splice(index, 1)
    const layerIndex = mapData.findIndex(item => item.id === layerId)
    mapData[layerIndex].overlays.push(overlay)
  }
}

/**
 * 编辑覆盖物时需要触发的地图编辑操作
 * @param enable 开启或关闭
 */
export function handleOverlayEdit(enable: boolean) {
  const {
    polylineEditor,
    activeInstance,
    editData,
    polygonEditor,
    bezierCurveEditor,
    rectangleEditor,
    circleEditor,
    ellipseEditor,
  } = storeToRefs(useMapStore())
  if (activeInstance.value instanceof window.AMap.Marker) {
    activeInstance.value.setDraggable(enable)
    enable
      ? activeInstance.value.setCursor('grab')
      : activeInstance.value.setCursor('pointer')

    if (!enable) {
      const pos = activeInstance.value.getPosition()!
      const newPos: [number, number] = [pos.lng, pos.lat]

      if (!isEqual((editData.value!.props as MarkerProps).position, newPos)) {
        ;(editData.value!.props as MarkerProps).position = newPos
      }
    }
  } else if (activeInstance.value instanceof window.AMap.Polyline) {
    if (enable) {
      activeInstance.value.setOptions({ cursor: 'grab', draggable: true })
      polylineEditor.value?.setTarget(activeInstance.value)
      polylineEditor.value?.open()
    } else {
      polylineEditor.value?.close()
      activeInstance.value.setOptions({ cursor: 'pointer', draggable: false })

      const path = activeInstance.value.getPath() as AMap.LngLat[]
      const newPath: AMap.Vector2[] = path.map(item => [item.lng, item.lat])

      if (!isEqual((editData.value!.props as PolylineProps).path, newPath)) {
        ;(editData.value!.props as PolylineProps).path = newPath
      }
    }
  } else if (activeInstance.value instanceof window.AMap.Polygon) {
    if (enable) {
      activeInstance.value.setOptions({ cursor: 'grab', draggable: true })
      polygonEditor.value?.setTarget(activeInstance.value)
      polygonEditor.value?.open()
    } else {
      polygonEditor.value?.close()
      activeInstance.value.setOptions({ cursor: 'pointer', draggable: false })

      const path = activeInstance.value.getPath() as AMap.LngLat[]
      const newPath: AMap.Vector2[] = path.map(item => [item.lng, item.lat])

      if (!isEqual((editData.value!.props as PolylineProps).path, newPath)) {
        ;(editData.value!.props as PolylineProps).path = newPath
      }
    }
  } else if (activeInstance.value instanceof window.AMap.BezierCurve) {
    if (enable) {
      activeInstance.value.setOptions({ cursor: 'grab', draggable: true })
      bezierCurveEditor.value?.setTarget(activeInstance.value)
      bezierCurveEditor.value?.open()
    } else {
      bezierCurveEditor.value?.close()
      activeInstance.value.setOptions({ cursor: 'pointer', draggable: false })

      const path = activeInstance.value.getPath() as AMap.Vector[]

      if (!isEqual((editData.value!.props as BezierCurveProps).path, path)) {
        ;(editData.value!.props as BezierCurveProps).path = path
      }
    }
  } else if (activeInstance.value instanceof window.AMap.Rectangle) {
    if (enable) {
      activeInstance.value.setOptions({ cursor: 'grab', draggable: true })
      rectangleEditor.value?.setTarget(activeInstance.value)
      rectangleEditor.value?.open()
    } else {
      rectangleEditor.value?.close()
      activeInstance.value.setOptions({ cursor: 'pointer', draggable: false })

      const bounds = activeInstance.value.getBounds()
      const sw = bounds!.getSouthWest()
      const ne = bounds!.getNorthEast()
      const newBounds: AMap.Vector2[] = [
        [sw.lng, sw.lat],
        [ne.lng, ne.lat],
      ]

      if (
        !isEqual((editData.value!.props as RectangleProps).bounds, newBounds)
      ) {
        ;(editData.value!.props as RectangleProps).bounds = newBounds
      }
    }
  } else if (activeInstance.value instanceof window.AMap.Circle) {
    if (enable) {
      activeInstance.value.setOptions({ cursor: 'grab', draggable: true })
      circleEditor.value?.setTarget(activeInstance.value)
      circleEditor.value?.open()
    } else {
      circleEditor.value?.close()
      activeInstance.value.setOptions({ cursor: 'pointer', draggable: false })

      const center = activeInstance.value.getCenter()
      const radius = activeInstance.value.getRadius()

      const newCenter: AMap.Vector2 = [center.lng, center.lat]

      if (!isEqual((editData.value!.props as CircleProps).center, newCenter)) {
        ;(editData.value!.props as CircleProps).center = newCenter
      }

      if (!isEqual((editData.value!.props as CircleProps).radius, radius)) {
        ;(editData.value!.props as CircleProps).radius = radius
      }
    }
  } else if (activeInstance.value instanceof window.AMap.Ellipse) {
    if (enable) {
      ellipseEditor.value?.setTarget(activeInstance.value)
      ellipseEditor.value?.open()
    } else {
      ellipseEditor.value?.close()

      const center = activeInstance.value.getCenter()
      const radius = activeInstance.value.getRadius()

      const newCenter: AMap.Vector2 = [center.lng, center.lat]

      if (!isEqual((editData.value!.props as EllipseProps).center, newCenter)) {
        ;(editData.value!.props as EllipseProps).center = newCenter
      }

      if (!isEqual((editData.value!.props as EllipseProps).radius, radius)) {
        ;(editData.value!.props as EllipseProps).radius = radius
      }
    }
  } else if (activeInstance.value instanceof window.AMap.Text) {
    activeInstance.value.setDraggable(enable)
    enable
      ? activeInstance.value.setCursor('grab')
      : activeInstance.value.setCursor('pointer')

    if (!enable) {
      const pos = activeInstance.value.getPosition()!
      const newPos: [number, number] = [pos.lng, pos.lat]

      if (!isEqual((editData.value!.props as TextProps).position, newPos)) {
        ;(editData.value!.props as TextProps).position = newPos
      }
    }
  }
}

/** 取消覆盖物编辑时，需要判断是否在地图中编辑（例如拖动位置），如果编辑了需要重新赋值来触发视图更新 */
export function restoreOverlayFromEdit() {
  const mapStore = useMapStore()
  const { editData, activeOverlay, mapData } = storeToRefs(mapStore)

  // 暂停历史记录追踪
  mapStore.pause()

  const { layer, index, overlay } =
    findOverlay(mapData.value, editData.value!.id) || {}
  if (!layer || !overlay || isNil(index)) return

  if (
    (editData.value!.props as MarkerProps).position &&
    !isEqual(
      (editData.value!.props as MarkerProps).position,
      (activeOverlay.value!.props as MarkerProps).position,
    )
  ) {
    // 深拷贝触发视图更新
    ;(layer.overlays[index].props as MarkerProps).position = cloneDeep(
      (overlay.props as MarkerProps).position,
    )
  } else if (
    (editData.value!.props as PolylineProps).path &&
    !isEqual(
      (editData.value!.props as PolylineProps).path,
      (activeOverlay.value!.props as PolylineProps).path,
    )
  ) {
    ;(layer.overlays[index].props as PolylineProps).path = cloneDeep(
      (overlay.props as PolylineProps).path,
    )
  } else if (
    (editData.value!.props as RectangleProps).bounds &&
    !isEqual(
      (editData.value!.props as RectangleProps).bounds,
      (activeOverlay.value!.props as RectangleProps).bounds,
    )
  ) {
    ;(layer.overlays[index].props as RectangleProps).bounds = cloneDeep(
      (overlay.props as RectangleProps).bounds,
    )
  } else if (
    (editData.value!.props as CircleProps).center &&
    (editData.value!.props as CircleProps).radius
  ) {
    if (
      !isEqual(
        (editData.value!.props as CircleProps).center,
        (activeOverlay.value!.props as CircleProps).center,
      )
    ) {
      ;(layer.overlays[index].props as CircleProps).center = cloneDeep(
        (overlay.props as CircleProps).center,
      )
    }
    if (
      !isEqual(
        (editData.value!.props as CircleProps).radius,
        (activeOverlay.value!.props as CircleProps).radius,
      )
    ) {
      if (typeof (overlay.props as CircleProps).radius === 'number') {
        layer.overlays[index].props = {
          ...overlay.props,
        }
      } else if (Array.isArray((overlay.props as EllipseProps).radius)) {
        ;(layer.overlays[index].props as EllipseProps).radius = cloneDeep(
          (overlay.props as EllipseProps).radius,
        )
      }
    }
  }

  nextTick(() => {
    mapStore.resume()
  })
}
