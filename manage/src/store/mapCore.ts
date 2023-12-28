// import { getMap } from '@sp/shared/apis'
// import { createMarker } from '@sp/shared/helper/mapHelper'
import { useMap } from '@sp/shared/hooks'
import { debounce } from 'lodash-es'
import { MaybeRef, ref } from 'vue'
// import type { ReactiveOverlayExtData, OverlayType } from '#/request'
import type { ToolKeys } from '../views/map/data'

export const useMapCoreStore = (container: MaybeRef<HTMLDivElement | null>) =>
  defineStore('mapCore', () => {
    const map = ref<AMap.Map>()
    const loca = ref<Loca.Container>()
    const zoom = ref<number>()
    const mousetool = ref<AMap.MouseTool>()
    // const activeOverlay = ref<ReactiveOverlayExtData<OverlayType>>()
    // let contextMenu: AMap.ContextMenu
    // const strategies: any = {
    //   Marker: createMarker,
    // }

    useMap(
      container,
      {
        mapOptions: {
          viewMode: '3D',
          mapStyle: 'amap://styles/blue',
          zooms: [5, 24],
          zoom: 18,
        },
        loaderOptions: {
          plugins: [
            'AMap.MouseTool',
            'AMap.MoveAnimation',
            'AMap.PolylineEditor',
            'AMap.PolygonEditor',
            'AMap.RectangleEditor',
            'AMap.CircleEditor',
            'AMap.EllipseEditor',
            'AMap.BezierCurveEditor',
          ],
        },
        enableLoca: true,
      },
      (_map, _loca) => {
        map.value = _map
        loca.value = _loca

        handleZoom(_map)
        handleMousetool(_map)
      },
    )

    function handleZoom(map: AMap.Map) {
      handler()
      map.on('zoomchange', debounce(handler, 300))
      function handler() {
        zoom.value = map.getZoom()
      }
    }

    function handleMousetool(map: AMap.Map) {
      mousetool.value = new AMap.MouseTool(map)
      mousetool.value.on('draw', e => {
        console.log(e)
      })
    }

    function onToolChange(key?: ToolKeys) {
      if (key) {
        map.value?.setDefaultCursor('crosshair')
        if (key !== 'text') {
          mousetool.value?.[key]({})
        }
      } else {
        map.value?.setDefaultCursor('inherit')
        if (key !== 'text') {
          mousetool.value?.close(false)
        }
      }
    }

    // function fetchLayers(menuId: string) {
    //   return getMap(menuId, false)
    //     .send()
    //     .then(layers => {
    //       map.value?.clearMap()
    //     })
    // }

    // function createContextMenu() {
    //   const contextMenu = new AMap.ContextMenu()
    //   contextMenu.addItem(
    //     '编辑',
    //     () => {
    //       console.log(activeRO)
    //     },
    //     0,
    //   )
    //   contextMenu.addItem('复制', () => {}, 0)
    //   contextMenu.addItem('移动至...图层', () => {}, 0)
    //   contextMenu.addItem('删除', () => {}, 0)
    //   return contextMenu
    // }

    // function onRightClick(e: any) {
    //   contextMenu.open(e.target._map, e.lnglat)
    //   activeRO = e.target.getExtData()
    // }

    return { map, loca, zoom, mousetool, onToolChange }
  })
