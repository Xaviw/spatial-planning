import { getMap } from '@sp/shared/apis'
import { overlays } from '@sp/shared/map'
import { useRequest } from 'alova'
import { message } from 'ant-design-vue'
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
