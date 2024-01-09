import { ContentWrapper } from '@sp/shared/components'
import { useModal } from '@sp/shared/hooks'
import { findOverlay, useMapStore } from '@sp/shared/map'
import { components } from '@sp/shared/materials'
import { cloneDeep, merge } from 'lodash-es'
import type { MapEvent, OverlayItem, OverlayType } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const { mapData } = storeToRefs(useMapStore())

export function bindClickEvent(overlay: AMap.Eventable) {
  overlay.on('click', (e: MapEvent) => {
    const id = (e.target as any).getExtData()
    const { overlay } = findOverlay(mapData.value, id) || {}
    if (overlay?.details.length) {
      openDetail(overlay)
    }
  })
}

const { open, close } = useModal('OverlayDetail')

/** 覆盖物详情弹窗 */
function openDetail(data: OverlayItem<OverlayType>) {
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
