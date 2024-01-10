import { findOverlay, overlays, toolManage, useMapStore } from '@sp/shared/map'
import { modal } from '@sp/shared/utils'
import { message } from 'ant-design-vue'
import { isEqual } from 'lodash-es'
import type { MapEvent } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

let contextMenu: AMap.ContextMenu

export function bindRightClickEvent(overlay: AMap.Eventable) {
  const mapStore = useMapStore()
  const {
    mapData,
    activeId,
    activeOverlay,
    layerModalOpen,
    activeInstance,
    activeTool,
  } = storeToRefs(mapStore)
  const { cancelEdit } = mapStore

  if (!contextMenu) {
    contextMenu = new window.AMap.ContextMenu()
    contextMenu.addItem(
      '编辑',
      async () => {
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
          message.success('已复制，复制的覆盖物与原覆盖物重叠，请编辑！')
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
        const { layer, index, overlay } =
          findOverlay(mapData.value, activeId.value!) || {}
        if (layer && overlay) {
          layer.overlays.splice(index!, 1)
          if (overlay.id === activeOverlay.value?.id) {
            cancelEdit()
          }
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
        const { layer, index, overlay } =
          findOverlay(mapData.value, activeId.value!) || {}
        if (layer && overlay) {
          layer.overlays[index!].props.zIndex =
            (layer.overlays[index!].props.zIndex ||
              overlays[overlay.type].defaultZIndex!) + 1
        }
        contextMenu.close()
      },
      0,
    )
    contextMenu.addItem(
      '下移一层',
      () => {
        const { layer, index, overlay } =
          findOverlay(mapData.value, activeId.value!) || {}
        if (layer && overlay) {
          layer.overlays[index!].props.zIndex =
            (layer.overlays[index!].props.zIndex ||
              overlays[overlay.type].defaultZIndex!) - 1
        }
        contextMenu.close()
      },
      0,
    )
  }

  overlay.on('rightclick', (e: MapEvent) => {
    // 右击时关闭覆盖物编辑和绘制，避免单击选项时产生多余绘制操作
    if (activeOverlay.value) {
      overlays[activeOverlay.value.type]?.handleEdit?.(mapStore, false)
    }
    if (activeTool.value) {
      toolManage(mapStore)
    }
    activeInstance.value = e.target
    activeId.value = (e.target as any).getExtData()
    contextMenu.open(e.target._map, [e.lnglat.lng, e.lnglat.lat])
  })
}
