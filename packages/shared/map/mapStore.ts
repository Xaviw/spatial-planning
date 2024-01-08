import { getMap } from '@sp/shared/apis'
import { overlays, rightMenu } from '@sp/shared/map'
import { modal } from '@sp/shared/utils'
import { useRequest } from 'alova'
import { message } from 'ant-design-vue'
import { isEqual } from 'lodash-es'
import { findOverlay, openDetail } from './utils'
import type {
  OverlayType,
  OverlayItem,
  OverlayInstance,
  ToolType,
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
  const labelsLayer = ref<AMap.LabelsLayer>()
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
  const activeTool = ref<ToolType>()
  const activeLayer = ref<string>()
  const activeLayerIndex = computed(() => {
    if (activeLayer.value) {
      return mapData.value.findIndex(item => item.id === activeLayer.value)
    }
  })

  const selectedMenu = ref<string>()
  const layerModalOpen = ref(false)

  function cancelEdit() {
    activeOverlay.value = undefined
    activeInstance.value = undefined
    activeId.value = undefined
    editData.value = undefined
  }

  function toolManage(item?: ToolType) {
    if (activeOverlay.value) {
      message.warn('请先完成编辑再绘制新覆盖物！')
      return
    }

    if (!item || activeTool.value === item) {
      // 未传递参数，或item是已开启的工具，关闭
      map.value?.setDefaultCursor('inherit')
      overlays[activeTool.value!]?.handleDraw?.(false)
      activeTool.value = undefined
    } else {
      if (!activeLayer.value) {
        message.warn('请先新增图层！')
        return
      }

      // 有已开启的工具时，关闭已开启的
      if (activeTool.value) {
        map.value?.setDefaultCursor('inherit')
        overlays[activeTool.value!]?.handleDraw?.(false)
        activeTool.value = undefined
      }

      // 开启当前选中的工具
      map.value?.setDefaultCursor('crosshair')
      activeTool.value = item
      overlays[activeTool.value!]?.handleDraw?.(true)
    }
  }

  const bindMenu = rightMenu({
    async edit() {
      // 查找要编辑的覆盖物
      const { overlay } = findOverlay(mapData.value, activeId.value!) || {}
      if (overlay) {
        // 正在编辑，不做操作
        if (activeOverlay.value && activeOverlay.value.id === overlay.id) {
          return
        }
        // 有其他编辑中的覆盖物，且已有改动，提示
        if (activeOverlay.value && !isEqual(activeOverlay.value, overlay)) {
          await modal('confirm', {
            title: '提示！',
            content: '您有正在编辑的覆盖物还未保存，是否直接切换？',
            okText: '切换',
          })
        }
        activeOverlay.value = overlay
      }
    },
    copy() {
      const { layer, overlay } =
        findOverlay(mapData.value, activeId.value!) || {}
      if (layer && overlay) {
        layer.overlays.push({ ...overlay, id: `add_${Date.now()}` })
        message.success('已复制，复制的覆盖物与原覆盖物重叠，请编辑！')
      }
    },
    move() {
      layerModalOpen.value = true
    },
    remove() {
      const { layer, index } = findOverlay(mapData.value, activeId.value!) || {}
      if (layer) {
        layer.overlays.splice(index!, 1)
      }
    },
    hide() {
      activeInstance.value?.hide()
      message.success('可通过切换图层隐藏、显示恢复覆盖物显示')
    },
    moveUp() {
      const { layer, index, overlay } =
        findOverlay(mapData.value, activeId.value!) || {}
      if (layer && overlay) {
        layer.overlays[index!].props.zIndex =
          (layer.overlays[index!].props.zIndex ||
            overlays[overlay.type].defaultZIndex!) + 1
      }
    },
    moveDown() {
      const { layer, index, overlay } =
        findOverlay(mapData.value, activeId.value!) || {}
      if (layer && overlay) {
        layer.overlays[index!].props.zIndex =
          (layer.overlays[index!].props.zIndex ||
            overlays[overlay.type].defaultZIndex!) - 1
      }
    },
    click(e) {
      const id = (e.target as any).getExtData()
      const { overlay } = findOverlay(mapData.value, id) || {}
      if (overlay?.details.length) {
        openDetail(overlay)
      }
    },
    rightClick(e) {
      // 右击时关闭覆盖物编辑和绘制，避免单击选项时产生多余绘制操作
      if (activeOverlay.value) {
        overlays[activeOverlay.value.type]?.handleEdit?.(false)
      }
      if (activeTool.value) {
        toolManage()
      }
      activeInstance.value = e.target
      activeId.value = (e.target as any).getExtData()
    },
  })

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
    activeLayerIndex,
    labelsLayer,
  }
})
