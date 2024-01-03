import { ContentWrapper } from '@sp/shared/components'
import { useModal } from '@sp/shared/hooks'
import { components } from '@sp/shared/materials'
import { cloneDeep, isEqual, merge } from 'lodash-es'
import type {
  LayerItem,
  MapEvent,
  MarkerProps,
  OverlayInstance,
  OverlayItem,
  OverlayType,
} from '#/business'

const { open, close } = useModal('OverlayDetail')

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

export function moveOverlayToOtherLayer(
  mapData: LayerItem<OverlayType>[],
  overlayId: string,
  layerId: string,
) {
  const { layer, index, overlay } = findOverlay(mapData, overlayId) || {}
  if (layer && index && overlay) {
    layer.overlays.splice(index, 1)
    const layerIndex = mapData.findIndex(item => item.id === layerId)
    mapData[layerIndex].overlays.push(overlay)
  }
}

export function handleOverlayEdit(
  editData: OverlayItem<OverlayType>,
  instance: ValueTypes<OverlayInstance>,
  enable: boolean,
) {
  if (instance instanceof window.AMap.Marker) {
    instance.setDraggable(enable)
    enable ? instance.setCursor('grab') : instance.setCursor('pointer')

    instance.on('dragend', onMarkerDragend)

    function onMarkerDragend(e: MapEvent) {
      const newPos = [e.lnglat.lng, e.lnglat.lat] as [number, number]

      if (!isEqual((editData.props as MarkerProps).position, newPos)) {
        ;(editData.props as MarkerProps).position = newPos
      }

      instance.off('dragend', onMarkerDragend)
    }
  }
}

export function handleOverlayCancelEdit(
  mapData: LayerItem<OverlayType>[],
  editData: OverlayItem<OverlayType>,
  originData: OverlayItem<OverlayType>,
  pause: Fn,
  resume: Fn,
) {
  if (
    (editData!.props as MarkerProps).position &&
    !isEqual(
      (editData!.props as MarkerProps).position,
      (originData!.props as MarkerProps).position,
    )
  ) {
    pause()
    const { layer, index, overlay } = findOverlay(mapData, editData!.id) || {}
    if (layer && overlay) {
      ;(layer.overlays[index!].props as MarkerProps).position = cloneDeep(
        (overlay.props as MarkerProps).position,
      )
      nextTick(() => {
        resume()
      })
    }
  }
}
