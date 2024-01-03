import { getMap } from '@sp/shared/apis'
import { modal } from '@sp/shared/utils'
import { useRequest } from 'alova'
import { isEqual } from 'lodash-es'
import { findOverlay, openDetail } from './utils'
import type {
  OverlayType,
  OverlayItem,
  OverlayInstance,
  MapEvent,
  ToolKeys,
} from '#/business'
import type { Loca } from '#/loca'
import type { AMap } from '@amap/amap-jsapi-types'

export const useMapStore = defineStore('map', () => {
  const {
    data: mapData,
    loading,
    send: getMapData,
    onSuccess,
  } = useRequest((id: string) => getMap(id, true), {
    immediate: false,
    initialData: [],
  })

  onSuccess(() => {
    activeLayer.value = mapData.value[0]?.id
  })

  const { canRedo, canUndo, clear, redo, undo, history, pause, resume } =
    useRefHistory(mapData, {
      deep: true,
    })

  const sourceData = computed(
    () => history.value[history.value.length - 1]?.snapshot,
  )

  const layers = computed(() => {
    return mapData.value.map(item => ({ label: item.name, value: item.id }))
  })

  const map = ref<AMap.Map>()
  const loca = ref<Loca.Container>()
  const mousetool = ref<AMap.MouseTool>()

  const activeOverlay = ref<OverlayItem<OverlayType>>()
  const activeInstance = ref<ValueTypes<OverlayInstance>>()
  const activeId = ref<string>()
  const editData = ref<OverlayItem<OverlayType>>()
  const activeTool = ref<ToolKeys>()
  const activeLayer = ref<string>()

  const selectedMenu = ref<string>()
  const layerModalOpen = ref(false)

  function cancelEdit() {
    activeOverlay.value = undefined
    activeInstance.value = undefined
    activeId.value = undefined
    editData.value = undefined
  }

  let contextMenu: AMap.ContextMenu
  function bindMenu(overlay: AMap.Eventable) {
    if (!contextMenu) {
      contextMenu = new window.AMap.ContextMenu()
      contextMenu.addItem(
        '编辑',
        async () => {
          const { overlay } = findOverlay(mapData.value, activeId.value!) || {}
          if (overlay) {
            if (activeOverlay.value && !isEqual(activeOverlay.value, overlay)) {
              await modal('confirm', {
                title: '提示！',
                content: '您有正在编辑的覆盖物还未保存，是否直接切换？',
                okText: '切换',
              })
            }
            activeOverlay.value = overlay
          }
          contextMenu.close()
        },
        0,
      )
      contextMenu.addItem(
        '复制',
        () => {
          const { layer, overlay } =
            findOverlay(mapData.value, activeId.value!) || {}
          if (layer && overlay) {
            layer.overlays.push({ ...overlay, id: `add_${Date.now()}` })
          }
          contextMenu.close()
        },
        0,
      )
      contextMenu.addItem(
        '移动到...图层',
        () => {
          layerModalOpen.value = true
          contextMenu.close()
        },
        0,
      )
      contextMenu.addItem(
        '删除',
        () => {
          const { layer, index } =
            findOverlay(mapData.value, activeId.value!) || {}
          if (layer) {
            layer.overlays.splice(index!, 1)
          }
          contextMenu.close()
        },
        0,
      )
    }

    overlay.on('rightclick', (e: MapEvent) => {
      activeInstance.value = e.target
      activeId.value = (e.target as any).getExtData()
      contextMenu.open(e.target._map, [e.lnglat.lng, e.lnglat.lat])
    })

    overlay.on('click', (e: MapEvent) => {
      const id = (e.target as any).getExtData()
      const { overlay } = findOverlay(mapData.value, id) || {}
      if (overlay?.details.length) {
        openDetail(overlay)
      }
    })
  }

  return {
    mapData,
    loading,
    getMapData,
    map,
    loca,
    activeOverlay,
    layers,
    canRedo,
    canUndo,
    clear,
    redo,
    undo,
    selectedMenu,
    bindMenu,
    layerModalOpen,
    activeId,
    activeInstance,
    sourceData,
    editData,
    cancelEdit,
    pause,
    resume,
    mousetool,
    activeTool,
    activeLayer,
  }
})
