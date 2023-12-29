// import { ContentWrapper } from '../components'
// import { useModal } from '../hooks'
import Marker from './marker/index.vue'
import type { OverlayInstance } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'
import type { InjectionKey, Ref } from 'vue'

export { Marker }

export const mapKey: InjectionKey<Ref<AMap.Map | undefined>> = Symbol('map-key')

let contextMenu: AMap.ContextMenu
let activeOverlay: OverlayInstance[keyof OverlayInstance]

export interface MapEvent {
  type: 'edit' | 'copy' | 'move' | 'remove'
  instance: OverlayInstance[keyof OverlayInstance]
}

export const eventHook = createEventHook<MapEvent>()

function triggerEvent(opts: MapEvent) {
  eventHook.trigger(opts)
  contextMenu.close()
}

// const { open, close } = useModal('OverlayDetail')

// function onOpenDetail() {
//   open(
//     h(
//       ContentWrapper,
//       {
//         title: props.modalTitle || `${props.title}详情`,
//         onClose: close,
//         style: { width: props.modalWidth },
//       },
//       () =>
//         h(
//           'div',
//           {
//             style: {
//               maxHeight: '80vh',
//               overflow: 'auto',
//               backgroundColor: '#001231',
//               color: '#fff',
//             },
//           },
//           props.modalData!.map(comp =>
//             h(
//               components[comp.type],
//               merge(cloneDeep(comp.props), {
//                 style: { marginBottom: '0.5rem' },
//               }),
//             ),
//           ),
//         ),
//     ),
//   )
// }

export function bindMenu(overlay: AMap.Eventable) {
  if (!contextMenu) {
    contextMenu = new window.AMap.ContextMenu()
    contextMenu.addItem(
      '编辑',
      () => {
        triggerEvent({ type: 'edit', instance: activeOverlay })
      },
      0,
    )
    contextMenu.addItem(
      '复制',
      () => {
        triggerEvent({ type: 'copy', instance: activeOverlay })
      },
      0,
    )
    contextMenu.addItem(
      '移动到...图层',
      () => {
        triggerEvent({ type: 'move', instance: activeOverlay })
      },
      0,
    )
    contextMenu.addItem(
      '删除',
      () => {
        triggerEvent({ type: 'remove', instance: activeOverlay })
      },
      0,
    )
  }

  overlay.on('rightclick', (e: { lnglat: AMap.LngLat; target: any }) => {
    activeOverlay = e.target
    contextMenu.open(e.target._map, [e.lnglat.lng, e.lnglat.lat])
  })

  // overlay.on('click', (e) => {

  // })
}
