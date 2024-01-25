import { AMap } from '@amap/amap-jsapi-types'
import { useMapStore } from '@sp/shared/helpers/map'
import { overlays } from '@sp/shared/overlays'
import { isNumber, uuid } from '@sp/shared/utils'
import { message } from 'ant-design-vue'
import type {
  LayerItem,
  OverlayItem,
  OverlayOptions,
  OverlayType,
  ToolType,
} from '#/business'
import type { InjectionKey, Ref } from 'vue'

export const mapKey: InjectionKey<Ref<AMap.Map | undefined>> = Symbol('map')

export const hasRightMenuKey: InjectionKey<boolean> = Symbol('hasRightMenu')

export const labelsLayerKey: InjectionKey<Ref<AMap.LabelsLayer | undefined>> =
  Symbol('labelsLayer')

export function toolManage(
  mapStore: ReturnType<typeof useMapStore>,
  item?: ToolType,
) {
  if (mapStore.activeOverlay) {
    message.warn('请先完成编辑再绘制新覆盖物！')
    return
  }

  if (!item || mapStore.activeTool === item) {
    // 未传递参数，或item是已开启的工具，关闭
    mapStore.map?.setDefaultCursor('inherit')
    overlays[mapStore.activeTool!]?.handleDraw?.(mapStore, false)
    mapStore.activeTool = undefined
  } else {
    if (!mapStore.activeLayer) {
      message.warn('请先新增图层！')
      return
    }

    // 有已开启的工具时，关闭已开启的
    if (mapStore.activeTool) {
      mapStore.map?.setDefaultCursor('inherit')
      overlays[mapStore.activeTool!]?.handleDraw?.(mapStore, false)
      mapStore.activeTool = undefined
    }

    // 开启当前选中的工具
    mapStore.map?.setDefaultCursor('crosshair')
    mapStore.activeTool = item
    overlays[mapStore.activeTool!]?.handleDraw?.(mapStore, true)
  }
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
  if (layer && layer.id !== layerId) {
    layer.overlays.splice(index!, 1)
    const layerIndex = mapData.findIndex(item => item.id === layerId)
    mapData[layerIndex].overlays.push(overlay!)
  }
}

/**
 * @param type 覆盖物类型
 * @param layerId 图层id
 * @param props 覆盖物props
 * @returns 覆盖物对象
 */
export function overlayFactory<T extends OverlayType>(
  type: T,
  layerId: string,
  props: OverlayOptions[T],
): OverlayItem<T> {
  const key = uuid()
  return {
    createTime: new Date().toLocaleString(),
    details: [],
    id: `add_${key}`,
    layerId,
    name: `新增覆盖物_${key}`,
    props,
    status: true,
    type,
  }
}

export const anchorOptions = [
  { value: 'top-left', label: '左上角' },
  { value: 'top-center', label: '顶部中点' },
  { value: 'top-right', label: '右上角' },
  { value: 'middle-left', label: '左侧中点' },
  { value: 'center', label: '中点' },
  { value: 'middle-right', label: '右侧中点' },
  { value: 'bottom-left', label: '左下角' },
  { value: 'bottom-center', label: '底部中点' },
  { value: 'bottom-right', label: '右下角' },
]

export const directionOptions = [
  { label: '顶部', value: 'top' },
  { label: '右侧', value: 'right' },
  { label: '底部', value: 'bottom' },
  { label: '左侧', value: 'left' },
  { label: '居中', value: 'center' },
]

export function arrayToPosition(arr: any[]) {
  const result: Recordable = {}
  if (isNumber(arr[0])) result.top = arr[0] + 'px'
  if (isNumber(arr[1])) result.left = arr[1] + 'px'
  if (isNumber(arr[2])) result.right = arr[2] + 'px'
  if (isNumber(arr[3])) result.bottom = arr[3] + 'px'
  return result
}
