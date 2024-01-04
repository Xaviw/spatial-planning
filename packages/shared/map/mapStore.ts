import { getMap } from '@sp/shared/apis'
import { modal } from '@sp/shared/utils'
import { useRequest } from 'alova'
import { message } from 'ant-design-vue'
import { isEqual } from 'lodash-es'
import { findOverlay, handleOverlayEdit, openDetail } from './utils'
import type {
  OverlayType,
  OverlayItem,
  OverlayInstance,
  MapEvent,
  ToolKeys,
  ToolItem,
} from '#/business'
import type { Loca } from '#/loca'
import type { AMap } from '@amap/amap-jsapi-types'

export const useMapStore = defineStore('map', () => {
  const {
    data: mapData,
    loading,
    send: getMapData,
    onSuccess,
  } = useRequest((id: string) => getMap(id, false), {
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
  const polylineEditor = ref<AMap.PolylineEditor>()
  const polygonEditor = ref<AMap.PolygonEditor>()
  const bezierCurveEditor = ref<AMap.BezierCurveEditor>()
  const rectangleEditor = ref<AMap.RectangleEditor>()
  const circleEditor = ref<AMap.CircleEditor>()
  const ellipseEditor = ref<AMap.EllipseEditor>()

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

  function toolManage(item?: ToolItem) {
    if (activeOverlay.value) {
      message.warn('请先完成编辑再绘制新覆盖物！')
      return
    }
    if (!item || activeTool.value === item.key) {
      map.value?.setDefaultCursor('inherit')
      activeTool.value = undefined
      mousetool.value?.close(false)
    } else {
      if (!activeLayer.value) {
        message.warn('请先新增图层！')
        return
      }
      map.value?.setDefaultCursor('crosshair')
      activeTool.value = item.key
      item.handler()
    }
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
      contextMenu.addItem(
        '隐藏',
        () => {
          activeInstance.value?.hide()
          message.success('可通过切换图层隐藏、显示恢复覆盖物显示')
          contextMenu.close()
        },
        0,
      )
      contextMenu.addItem(
        '上移一层',
        () => {
          const { layer, index } =
            findOverlay(mapData.value, activeId.value!) || {}
          if (layer) {
            layer.overlays[index!].props.zIndex =
              (layer.overlays[index!].props.zIndex || 10) + 1
          }
          contextMenu.close()
        },
        0,
      )
      contextMenu.addItem(
        '下移一层',
        () => {
          const { layer, index } =
            findOverlay(mapData.value, activeId.value!) || {}
          if (layer) {
            layer.overlays[index!].props.zIndex =
              (layer.overlays[index!].props.zIndex || 10) - 1
          }
          contextMenu.close()
        },
        0,
      )
    }

    overlay.on('rightclick', (e: MapEvent) => {
      // 右击时关闭覆盖物编辑和绘制，避免单击选项时产生多余绘制操作
      if (activeOverlay.value) {
        handleOverlayEdit(false)
      }
      if (activeTool.value) {
        toolManage()
      }
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
    polylineEditor,
    polygonEditor,
    toolManage,
    bezierCurveEditor,
    rectangleEditor,
    circleEditor,
    ellipseEditor,
  }
})
