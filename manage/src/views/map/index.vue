<!-- <template>
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

    <div class="w-120 flex flex-col">
      <div class="mb-2 bg-white p-4">
        <div class="mb-2 flex">
          <div class="flex-1">
            <AButton danger>撤销</AButton>
            <AButton type="primary" class="mx-2" ghost>重做</AButton>
          </div>
          <div>
            <AButton type="primary" @click="onSubmit">提交</AButton>
          </div>
        </div>

        <AAlert showIcon>
          <template #message>
            <div>拖拽“左栏”、“右栏”中的组件移动位置；</div>
            <div>右击“左栏”、“右栏”中的组件进行编辑或删除；</div>
            <div>拖拽“物料栏”中的组件到“左栏”、“右栏”中进行新增；</div>
          </template>
        </AAlert>

        <div class="mt-2 flex items-center">
          <span>选择菜单：</span>
          <ATreeSelect
            :fieldNames="{ label: 'name', value: 'id' }"
            :filterTreeNode="onMenuFilter"
            placeholder="选择或搜索菜单进行筛选"
            v-model:searchValue="menuSearchValue"
            :value="selectedMenu"
            @update:value="$emit('update:selectedMenu', $event)"
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

      <Layer
        class="mb-2 bg-white"
        :visibleIds="visibleLayers"
        v-model="layers"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getMap } from '@sp/shared/apis'
import { Loading } from '@sp/shared/components'
// import { createReactiveLayer } from '@sp/shared/helper/mapHelper'
import { useMap, useMenuTree } from '@sp/shared/hooks'
import { useRequest } from 'alova'
import { debounce, omit } from 'lodash-es'
import Layer from './layer.vue'
import Toolbar from './toolbar.vue'
import type { ToolKeys } from './data'
import { LayerItem } from '#/request'

const layers = ref<Omit<LayerItem, 'overlays'>[]>([])
const visibleLayers = ref<string[]>([])

const { menuData, menuSearchValue, onMenuDropdown, onMenuFilter } =
  useMenuTree()
const selectedMenu = ref<string>()
function onMenuChange(id: string) {
  send(id)
}

const container = ref<HTMLDivElement | null>(null)
const properties = reactive<{
  map: AMap.Map
  loca: Loca.Container
  mousetool: AMap.MouseTool
  proxy: AMap.MarkerOptions
}>({} as any)
const zoom = ref<number>()

const { loading, onSuccess, send } = useRequest(
  (id: string) => getMap(id, true),
  { immediate: false, initialData: [] },
)

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
  (map, loca) => {
    properties.map = map
    properties.loca = loca

    zoom.value = map.getZoom()
    map.on('zoomchange', debounce(onZoomChange, 300))

    const mousetool = new AMap.MouseTool(map)
    mousetool.on('draw', e => {
      console.log(e)
    })
    properties.mousetool = mousetool

    onSuccess(({ data }) => {
      layers.value = []
      data.forEach(item => {
        layers.value.push(omit(item, 'overlays'))
        // try {
        //   createReactiveLayer(item.overlays, map)
        // } catch (error) {
        //   console.log('error: ', error)
        // }
      })
      map.setFitView()
    })
  },
)

function onToolChange(key?: ToolKeys) {
  if (key) {
    properties.map.setDefaultCursor('crosshair')
    if (key !== 'text') {
      properties.mousetool?.[key]({})
    }
  } else {
    properties.map.setDefaultCursor('inherit')
    if (key !== 'text') {
      properties.mousetool?.close(false)
    }
  }
}

function onZoomChange() {
  zoom.value = properties.map.getZoom()
}

function onSubmit() {}
</script> -->
<template>
  <div class="flex flex-col">
    {{ history.length }}
    <AButton
      @click="
        () => {
          list.push({ id: mock.Random.id(), value: mock.Random.increment() })
          commit()
        }
      "
    >
      +
    </AButton>
    <AButton
      @click="
        () => {
          list.pop()
          commit()
        }
      "
    >
      -
    </AButton>
    <AButton @click="redo">redo</AButton>
    <AButton @click="undo">undo</AButton>
    <AButton @click="list[0].value = 999">change</AButton>
  </div>
</template>

<script setup lang="ts">
import { toRawValue } from '@sp/shared/utils'
import mock from 'mockjs'

const list = ref<any[]>([])
const { redo, undo, commit, history } = useRefHistory(list, { deep: true })
watchArray(
  list,
  (newList, oldList, newItem, removedItem) => {
    console.log('newList', toRawValue(newList))
    console.log('oldList', toRawValue(oldList))
    console.log('newItem', toRawValue(newItem))
    console.log('removedItem', toRawValue(removedItem))
    console.log('-------------------------')
  },
  { deep: true },
)
</script>
