<template>
  <div class="relative relative h-full min-w-400 flex">
    <Loading absolute :loading="loading" />

    <Toolbar
      class="absolute left-2 top-2 z-1 rounded bg-white"
      @change="onToolChange"
    />

    <div ref="container" class="relative mr-2 flex-1 bg-white">
      <div class="absolute right-0 top-0 z-1 bg-white px-4 py-2">
        当前缩放等级：{{ zoom }}
      </div>
    </div>

    <div class="w-100 flex flex-col">
      <div class="mb-2 bg-white p-4">
        <div class="mb-2 flex">
          <div class="flex-1">
            <AButton danger @click="undo" :disabled="!canUndo">撤销</AButton>
            <AButton
              type="primary"
              class="mx-2"
              ghost
              @click="redo"
              :disabled="!canRedo"
            >
              重做
            </AButton>
          </div>
          <div>
            <AButton type="primary" :disabled="!canUndo">提交</AButton>
          </div>
        </div>

        <AAlert showIcon>
          <template #message>
            <div>右击地图覆盖物进行操作</div>
          </template>
        </AAlert>

        <div class="mt-2 flex items-center">
          <span>选择菜单：</span>
          <ATreeSelect
            :fieldNames="{ label: 'name', value: 'id' }"
            :filterTreeNode="onMenuFilter"
            placeholder="选择或搜索菜单进行筛选"
            v-model:searchValue="menuSearchValue"
            v-model:value="selectedMenu"
            treeDefaultExpandAll
            showSearch
            :treeData="menuData"
            @dropdownVisibleChange="onMenuDropdown"
            @change="onMenuChange"
            class="flex-1"
          />
        </div>
      </div>

      <div class="mb-2 flex-1 bg-white p-4"></div>

      <Layer class="bg-white" v-model="data" :disabled="!selectedMenu" />
    </div>

    <AModal
      v-model:open="moveModalOpen"
      title="请选择要移动到的图层"
      @ok="onOverlayMove"
    >
      <ARadioGroup v-model:value="moveTarget">
        <ARadio v-for="item of data" :key="item.id" :value="item.id">
          {{ item.name }}
        </ARadio>
      </ARadioGroup>
    </AModal>
  </div>
</template>

<script setup lang="ts">
import { getMap } from '@sp/shared/apis'
import { Loading } from '@sp/shared/components'
import { useMap, useMenuTree } from '@sp/shared/hooks'
import { mapKey, eventHook, type MapEvent } from '@sp/shared/map'
import { loop } from '@sp/shared/utils'
import { useRequest } from 'alova'
import { debounce } from 'lodash-es'
import Layer from './layer.vue'
import Toolbar from './toolbar.vue'
import type { ToolKeys } from './data'
import type { AMap } from '@amap/amap-jsapi-types'
import { OverlayItem, OverlayType } from '#/business'

const { menuData, menuSearchValue, onMenuDropdown, onMenuFilter } =
  useMenuTree()
const selectedMenu = ref<string>()
function onMenuChange(id: string) {
  send(id).then(() => {
    nextTick(clear)
  })
}

const container = ref<HTMLDivElement | null>(null)
const zoom = ref<number>()
const map = ref<AMap.Map>()

provide(mapKey, map)

const { data, loading, send } = useRequest((id: string) => getMap(id, true), {
  immediate: false,
  initialData: [],
})

const { canRedo, canUndo, clear, redo, undo } = useRefHistory(data, {
  deep: true,
})

const moveModalOpen = ref(false)
const moveId = ref<string>()
const moveTarget = ref<string>()
function onOverlayMove() {
  let overlay: OverlayItem<OverlayType> | undefined
  loop(
    data.value,
    'id',
    'overlays',
    (_item, index, _data, parent) => {
      overlay = parent?.overlays?.splice(index, 1)?.[0]
    },
    moveId.value,
  )
  const layerIndex = data.value.findIndex(item => item.id === moveTarget.value)
  // BUG: 最终的数据需要记录图层id
  data.value[layerIndex].overlays.push(overlay!)
  moveModalOpen.value = false
}

eventHook.on((e: MapEvent) => {
  const ext = (e.instance as any).getExtData()
  if (e.type === 'remove') {
    loop(
      data.value,
      'id',
      'overlays',
      (_item, index, _data, parent) => {
        parent?.overlays?.splice(index, 1)
      },
      ext.id,
    )
  } else if (e.type === 'copy') {
    loop(
      data.value,
      'id',
      'overlays',
      (_item, _index, _data, parent) => {
        parent?.overlays?.push({ ...ext, id: `add_${Date.now()}` })
      },
      ext.id,
    )
  } else if (e.type === 'move') {
    moveId.value = ext.id
    moveTarget.value = ext.layerId
    moveModalOpen.value = true
  }
})

useMap(
  container,
  {
    mapOptions: {
      viewMode: '3D',
      mapStyle: 'amap://styles/blue',
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
    watchZoom()
  },
)

function onToolChange(_key?: ToolKeys) {
  // if (key) {
  //   properties.map.setDefaultCursor('crosshair')
  //   if (key !== 'text') {
  //     properties.mousetool?.[key]({})
  //   }
  // } else {
  //   properties.map.setDefaultCursor('inherit')
  //   if (key !== 'text') {
  //     properties.mousetool?.close(false)
  //   }
  // }
}

function watchZoom() {
  zoom.value = map.value?.getZoom()
  map.value?.on(
    'zoomchange',
    debounce(() => {
      zoom.value = map.value?.getZoom()
    }, 500),
  )
}
</script>
