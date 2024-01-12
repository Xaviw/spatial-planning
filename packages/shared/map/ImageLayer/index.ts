import { overlayFactory, toolManage, useMapStore } from '@sp/shared/map'
import { message } from 'ant-design-vue'
import { cloneDeep, isEqual } from 'lodash-es'
import { getStaticFile } from '../../utils'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  RectangleProps,
  LayerItem,
  OverlayItem,
  OverlayInstance,
  OverlayType,
  OverlayModule,
} from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

function synchronization(
  mapStore: ReturnType<typeof useMapStore>,
  imageLayer: AMap.ImageLayer,
) {
  if (!(mapStore.activeInstance instanceof window.AMap.Rectangle)) return

  const bounds = mapStore.activeInstance.getBounds()
  const sw = bounds!.getSouthWest()
  const ne = bounds!.getNorthEast()
  const newBounds: AMap.ImageLayerOptions['bounds'] = [
    sw.lng,
    sw.lat,
    ne.lng,
    ne.lat,
  ]

  imageLayer.setBounds(bounds!)

  if (
    !isEqual(
      (mapStore.editData!.props as AMap.ImageLayerOptions).bounds,
      newBounds,
    )
  ) {
    ;(mapStore.editData!.props as AMap.ImageLayerOptions).bounds = newBounds
  }
}

export default {
  type: 'ImageLayer',
  sort: 11,
  defaultZIndex: 6,
  overlay: Overlay,
  form: Form,
  name: '贴图',
  icon: 'i-material-symbols:image-outline',
  drawHelp: [
    '从目标位置点击并拖动，松开鼠标后完成绘制',
    '绘制后在编辑中上传贴图',
    '不能连续绘制',
    '绘制或修改图片链接后加载图片需要时间（根据图片大小而定），请耐心等待',
  ],
  editHelp: ['拖动控制点移动顶点位置', '拖动非控制点移动整体位置'],
  handleDraw: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (open) {
      mapStore.mousetool?.rectangle({
        zIndex: 7,
        cursor: 'pointer',
        fillOpacity: 0,
      })
    } else {
      mapStore.mousetool?.close(false)
    }
  },
  afterDraw: (
    mapStore: ReturnType<typeof useMapStore>,
    obj: OverlayInstance['Rectangle'],
  ) => {
    const bounds = obj.getBounds()!
    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()
    if (sw.lng === ne.lng && sw.lat === ne.lat) {
      message.warn('请拖动扩展覆盖面积！')
      return
    }
    const newImageLayer = overlayFactory('ImageLayer', mapStore.activeLayer!, {
      url: getStaticFile('/imageLayer.png'),
      bounds: [sw.lng, sw.lat, ne.lng, ne.lat],
    })
    mapStore.mapData[mapStore.activeLayerIndex!].overlays.push(newImageLayer)
    mapStore.map?.remove(obj)
    toolManage(mapStore)
  },
  handleEdit: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (!(mapStore.activeInstance instanceof window.AMap.Rectangle)) return

    if (open) {
      const layers: any[] = mapStore.map!.getLayers()
      const imageLayer = layers.find(item => {
        if (!item.getBounds) return
        const layerBounds = item.getBounds()
        const rectangleBounds = (
          mapStore.activeInstance as AMap.Rectangle
        ).getBounds()

        return (
          rectangleBounds?.toString().replace(';', ',') ===
          layerBounds.toString().replace(';', ',')
        )
      })

      mapStore.rectangleEditor?.setTarget(mapStore.activeInstance)
      mapStore.rectangleEditor?.open()
      mapStore.activeInstance.setOptions({ cursor: 'grab' })
      ;(mapStore.rectangleEditor as any).on(
        'addnode',
        synchronization.bind(null, mapStore, imageLayer),
      )
      ;(mapStore.rectangleEditor as any).on(
        'adjust',
        synchronization.bind(null, mapStore, imageLayer),
      )
      ;(mapStore.rectangleEditor as any).on(
        'move',
        synchronization.bind(null, mapStore, imageLayer),
      )
    } else {
      mapStore.rectangleEditor?.close()
      mapStore.activeInstance.setOptions({ cursor: 'pointer' })
      ;(mapStore.rectangleEditor as any).clearEvents()
    }
  },
  cancelEdit: (
    mapStore: ReturnType<typeof useMapStore>,
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Rectangle'>,
  ) => {
    if (
      (mapStore.editData!.props as RectangleProps).bounds &&
      !isEqual(
        (mapStore.editData!.props as RectangleProps).bounds,
        (mapStore.activeOverlay!.props as RectangleProps).bounds,
      )
    ) {
      ;(layer.overlays[index].props as RectangleProps).bounds = cloneDeep(
        (overlay.props as RectangleProps).bounds,
      )
    }
  },
} as OverlayModule
