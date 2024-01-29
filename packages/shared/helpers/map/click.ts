import { ContentWrapper } from '@sp/shared/components'
import { useModal } from '@sp/shared/hooks'
import { materials } from '@sp/shared/materials'
import { clone, mergeDeepRight } from 'ramda'
import type { OverlayItem, OverlayType } from '#/overlays'
import type { AMap } from '@amap/amap-jsapi-types'
import type { Ref } from 'vue'

export function bindClickEvent(
  overlay: AMap.Eventable,
  data: Ref<
    Pick<
      OverlayItem<OverlayType>,
      'modalTitle' | 'modalWidth' | 'name' | 'materials'
    >
  >,
) {
  overlay.on('click', () => {
    if (data?.value?.materials.length) {
      openDetail(data.value)
    }
  })
}

const { open, close } = useModal('OverlayDetail')

/** 覆盖物详情弹窗 */
function openDetail(
  data: Pick<
    OverlayItem<OverlayType>,
    'modalTitle' | 'modalWidth' | 'name' | 'materials'
  >,
) {
  open(
    h(
      ContentWrapper,
      {
        title: data.modalTitle || `${data.name}详情`,
        onClose: close,
        style: { width: data.modalWidth || '25rem' },
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
          data.materials.map(comp =>
            h(
              materials[comp.type],
              mergeDeepRight(clone(comp.props), {
                style: { marginBottom: '0.5rem' },
              }),
            ),
          ),
        ),
    ),
  )
}
