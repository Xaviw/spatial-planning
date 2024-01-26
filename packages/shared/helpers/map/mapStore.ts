import { getMap } from '@sp/shared/apis'
import { useRequest } from 'alova'
import type {
  OverlayType,
  OverlayItem,
  OverlayInstance,
  ToolType,
} from '#/overlays'
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

  const result = {
    mapData,
    loading,
    getMapData,
    map,
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
    bezierCurveEditor,
    rectangleEditor,
    circleEditor,
    ellipseEditor,
    activeLayerIndex,
    labelsLayer,
  }

  return result
})
