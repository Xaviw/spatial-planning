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

      <div class="mb-2 flex flex-1 flex-col overflow-auto bg-white p-4">
        <template v-if="activeOverlay">
          <div class="flex-1 overflow-auto">
            <BaseForm ref="baseFormEl" />

            <component
              :is="overlayForms[activeOverlay.type]"
              :key="activeOverlay.id"
              ref="overlayFormEl"
            />
          </div>

          <div class="flex">
            <AButton class="mr-4 flex-1" type="primary" @click="onConfirm">
              确定
            </AButton>
            <AButton class="flex-1" danger @click="onCancel">取消</AButton>
          </div>
        </template>
        <AEmpty
          v-else
          description="请右击地图中的覆盖物，选择“编辑”"
          class="h-full flex flex-col items-center justify-center"
        />
      </div>

      <Layer class="bg-white" v-model="data" :disabled="!selectedMenu" />
    </div>

    <AModal
      v-model:open="moveInfo.open"
      title="请选择要移动到的图层"
      @ok="onOverlayMove"
    >
      <ARadioGroup v-model:value="moveInfo.target" :options="layerOptions" />
    </AModal>
  </div>
</template>

<script setup lang="ts">
import { getMap } from '@sp/shared/apis'
import { Loading } from '@sp/shared/components'
import { useMap, useMenuTree } from '@sp/shared/hooks'
import {
  mapKey,
  eventHook,
  overlayForms,
  layerOptionsKey,
  BaseForm,
  type MapEvent,
} from '@sp/shared/map'
import { loop, modal } from '@sp/shared/utils'
import { useRequest } from 'alova'
import { cloneDeep, debounce, isEqual, omit } from 'lodash-es'
import Layer from './layer.vue'
import Toolbar from './toolbar.vue'
import type { ToolKeys } from './data'
import type { AMap } from '@amap/amap-jsapi-types'
import { OverlayItem, OverlayType, ReactiveOverlayExtData } from '#/business'

const baseFormEl = ref<InstanceType<typeof BaseForm> | null>(null)
const overlayFormEl = ref<InstanceType<typeof BaseForm> | null>(null)

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
const activeOverlay = ref<ReactiveOverlayExtData<OverlayType>>()

provide(mapKey, map)

const { data, loading, send } = useRequest((id: string) => getMap(id, true), {
  immediate: false,
  initialData: [],
})

const layerOptions = computed(() => {
  return data.value.map(item => ({ label: item.name, value: item.id }))
})

provide(layerOptionsKey, layerOptions)

const { canRedo, canUndo, clear, redo, undo } = useRefHistory(data, {
  deep: true,
})

eventHook.on(async (e: MapEvent) => {
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
    moveInfo.id = ext.id
    moveInfo.target = ext.layerId
    moveInfo.open = true
  } else if (e.type === 'edit') {
    if (activeOverlay.value) {
      if (ext.id === activeOverlay.value.id) return
      const data = await getData()
      if (!isEqual(data, activeOverlay)) {
        await modal('confirm', {
          title: '提示！',
          content: '您有正在编辑的覆盖物还未保存，是否直接切换？',
          okText: '切换',
        })
      }
    }
    activeOverlay.value = ext
    await nextTick()
    baseFormEl.value!.formModel = cloneDeep(omit(ext, 'props'))
    overlayFormEl.value!.formModel = cloneDeep(ext.props)
  }
})

const moveInfo = reactive<{ open: boolean; id?: string; target?: string }>({
  open: false,
  id: undefined,
  target: undefined,
})
function onOverlayMove() {
  let overlay: OverlayItem<OverlayType> | undefined
  loop(
    data.value,
    'id',
    'overlays',
    (_item, index, _data, parent) => {
      overlay = parent?.overlays?.splice(index, 1)?.[0]
    },
    moveInfo.id,
  )
  const layerIndex = data.value.findIndex(item => item.id === moveInfo.target)
  data.value[layerIndex].overlays.push({
    ...overlay!,
    layerId: data.value[layerIndex].id,
  })
  moveInfo.open = false
}

async function getData() {
  await nextTick()
  return {
    ...baseFormEl.value!.formModel,
    props: overlayFormEl.value!.formModel,
  } as OverlayItem<OverlayType>
}

async function onConfirm() {
  await baseFormEl.value?.validate()
  await overlayFormEl.value?.validate()

  const formData = await getData()
  const equal = isEqual(formData, activeOverlay.value)
  if (!equal) {
    ;(formData.props as any).extData = cloneDeep(formData)
    loop(
      data.value,
      'id',
      'overlays',
      (_item, index, _data, parent) => {
        parent!.overlays[index] = formData
      },
      activeOverlay.value!.id,
    )
  }
  activeOverlay.value = undefined
}

async function onCancel() {
  const data = await getData()
  if (!isEqual(data, activeOverlay.value)) {
    await modal('confirm', {
      title: '警告！',
      content: '您当前的编辑还未保存，是否确定取消？',
    })
  }
  activeOverlay.value = undefined
}

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
