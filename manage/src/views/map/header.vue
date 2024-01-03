<template>
  <div>
    <div class="mb-2 flex">
      <div class="flex-1">
        <AButton danger @click="mapStore.undo" :disabled="!canUndo">
          撤销
        </AButton>
        <AButton
          type="primary"
          class="mx-2"
          ghost
          @click="mapStore.redo"
          :disabled="!canRedo"
        >
          重做
        </AButton>
      </div>
      <div>
        <AButton type="primary" :disabled="!canUndo" @click="onSubmit">
          提交
        </AButton>
      </div>
    </div>

    <AAlert showIcon>
      <template #message>
        <div>右击地图覆盖物进行操作</div>
        <div>点击左侧工具栏中的图标绘制或取消绘制覆盖物</div>
        <div v-if="activeOverlay?.type === 'Marker'">拖动标记点移动位置</div>
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
</template>

<script setup lang="ts">
import { useMenuTree } from '@sp/shared/hooks'
import { useMapStore } from '@sp/shared/map'
import { getOperationsFromDiff } from '@sp/shared/utils'
import { omit } from 'lodash-es'

const mapStore = useMapStore()

const {
  canRedo,
  canUndo,
  selectedMenu,
  loading,
  sourceData,
  mapData,
  activeOverlay,
} = storeToRefs(mapStore)

const { menuData, menuSearchValue, onMenuDropdown, onMenuFilter } =
  useMenuTree()

function onMenuChange(id: string) {
  mapStore.getMapData(id).then(() => {
    nextTick(mapStore.clear)
  })
}

function onSubmit() {
  loading.value = true

  const sourceLayers = []
  const currentLayers = []

  const sourceOverlays = []
  const currentOverlays = []

  const sourceDetails = []
  const currentDetails = []

  for (let layer of sourceData.value) {
    for (let overlay of layer.overlays) {
      for (let detail of overlay.details) {
        sourceDetails.push(detail)
      }
      sourceOverlays.push(omit(overlay, 'details'))
    }
    sourceLayers.push(omit(layer, 'overlays'))
  }

  for (let layer of mapData.value) {
    for (let overlay of layer.overlays) {
      for (let detail of overlay.details) {
        currentDetails.push(detail)
      }
      currentOverlays.push(omit(overlay, 'details'))
    }
    currentLayers.push(omit(layer, 'overlays'))
  }

  const layers = getOperationsFromDiff(currentLayers, sourceLayers, 'sort')
  const overlays = getOperationsFromDiff(currentOverlays, sourceOverlays)
  const details = getOperationsFromDiff(currentDetails, sourceDetails, 'sort')

  console.log({ layers, overlays, details })
  loading.value = false
}
</script>
