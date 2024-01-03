<template>
  <div class="flex flex-col items-center">
    <template v-for="item of list" :key="item.key">
      <ATooltip :title="item.name" placement="right">
        <div
          :class="[
            'h-10',
            'w-10',
            'flex',
            'items-center',
            'justify-center',
            'text-xl',
            'hover:bg-blue',
            'hover:text-white',
            item.key === activeTool && 'bg-blue text-white',
          ]"
          :style="item.style"
          @click="onClick(item)"
        >
          <i :class="item.icon" />
        </div>
      </ATooltip>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '@sp/shared/map'
import { message } from 'ant-design-vue'
import type { MapEvent, ToolKeys } from '#/business'

interface ToolItem {
  icon: string
  name: string
  key: ToolKeys
  style?: string
  handler: Fn
}

const { activeTool, mousetool, map, activeLayer, mapData } = storeToRefs(
  useMapStore(),
)

const list: ToolItem[] = [
  {
    icon: 'i-material-symbols:location-on',
    name: '点',
    key: 'marker',
    handler: () => {
      mousetool.value?.marker({})
    },
  },
  {
    icon: 'i-material-symbols:polyline-outline',
    name: '线',
    key: 'polyline',
    handler: () => {},
  },
  { icon: 'i-ph:polygon', name: '多边形', key: 'polygon', handler: () => {} },
  {
    icon: 'i-mdi:vector-rectangle',
    name: '矩形',
    key: 'rectangle',
    handler: () => {},
  },
  {
    icon: 'i-mdi:circle-outline',
    name: '圆',
    key: 'circle',
    handler: () => {},
  },
  { icon: 'i-ph:text-t', name: '文字', key: 'text', handler: () => {} },
  {
    icon: 'i-material-symbols:image-outline',
    name: '贴图',
    key: 'image',
    style: 'border-bottom: 3px solid #666',
    handler: () => {},
  },
  { icon: 'i-ph:ruler', name: '距离测量', key: 'rule', handler: () => {} },
  {
    icon: 'i-radix-icons:ruler-square',
    name: '面积测量',
    key: 'measureArea',
    handler: () => {},
  },
]

function onClick(item: ToolItem) {
  if (activeTool.value === item.key) {
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

watchEffect(() => {
  if (mousetool.value) {
    ;(mousetool.value as any).on(
      'draw',
      ({ obj }: { obj: MapEvent['target'] }) => {
        if (obj instanceof window.AMap.Marker) {
          const pos = obj.getPosition()!
          const layerIndex = mapData.value.findIndex(
            item => item.id === activeLayer.value,
          )
          mapData.value[layerIndex].overlays.push({
            createTime: new Date().toLocaleString(),
            details: [],
            id: `add_${Date.now()}`,
            layerId: activeLayer.value!,
            name: '',
            props: { position: [pos.lng, pos.lat] },
            status: true,
            type: 'Marker',
          })
          obj.destroy()
        }
      },
    )
  }
})
</script>
