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
      <AButton type="primary" :disabled="!canUndo" @click="onSubmit">
        提交
      </AButton>
    </div>

    <AAlert showIcon message="右击覆盖物进行操作" />

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
import { setMap } from '@sp/shared/apis'
import { useMenuTree } from '@sp/shared/hooks'
import { useMapStore } from '@sp/shared/map'
import { getOperationsFromDiff } from '@sp/shared/utils'
import { message } from 'ant-design-vue'
import { omit } from 'lodash-es'

const mapStore = useMapStore()

const { canRedo, canUndo, selectedMenu, loading, sourceData, mapData } =
  storeToRefs(mapStore)

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

  setMap({ layers, overlays, details })
    .send()
    .then(() => {
      message.success('提交成功！')
      nextTick(mapStore.clear)
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
