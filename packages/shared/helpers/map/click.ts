import { ContentWrapper } from '@sp/shared/components'
import { useModal } from '@sp/shared/hooks'
import { components } from '@sp/shared/materials'
import { cloneDeep, merge } from 'lodash-es'
import type { OverlayItem, OverlayType } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'
import type { Ref } from 'vue'

export function bindClickEvent(
  overlay: AMap.Eventable,
  data: Ref<OverlayItem<OverlayType>>,
) {
  overlay.on('click', () => {
    if (data?.value?.details.length) {
      openDetail(data.value)
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
