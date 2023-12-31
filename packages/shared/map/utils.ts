import { ContentWrapper } from '@sp/shared/components'
import { useModal } from '@sp/shared/hooks'
import { components } from '@sp/shared/materials'
import { cloneDeep, merge } from 'lodash-es'
import type {
  LayerItem,
  OverlayItem,
  OverlayOptions,
  OverlayType,
} from '#/business'

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
  const now = Date.now()
  return {
    createTime: new Date().toLocaleString(),
    details: [],
    id: `add_${now}`,
    layerId,
    name: `新增覆盖物_${now}`,
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
