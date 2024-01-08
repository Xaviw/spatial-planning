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

    <AAlert showIcon>
      <template #message>
        <div>右击覆盖物进行操作</div>
      </template>
    </AAlert>

    <div class="my-2 flex items-center">
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

    <div class="flex items-center">
      <span>搜索覆盖物：</span>
      <AInputSearch
        class="flex-1"
        placeholder="请输入覆盖物名称"
        v-model:value="searchValue"
        :disabled="!selectedMenu"
        @search="onSearch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { setMap } from '@sp/shared/apis'
import { useMenuTree } from '@sp/shared/hooks'
import { useMapStore } from '@sp/shared/map'
import { getOperationsFromDiff, modal } from '@sp/shared/utils'
import { message } from 'ant-design-vue'
import { isEqual, omit } from 'lodash-es'

const mapStore = useMapStore()

const {
  canRedo,
  canUndo,
  selectedMenu,
  loading,
  sourceData,
  mapData,
  map,
  activeOverlay,
  activeInstance,
} = storeToRefs(mapStore)

const { menuData, menuSearchValue, onMenuDropdown, onMenuFilter } =
  useMenuTree()

function onMenuChange(id: string) {
  mapStore.getMapData(id).then(() => {
    nextTick(mapStore.clear)
  })
}

const searchValue = ref<string>()

async function onSearch() {
  if (!searchValue.value) {
    message.warn('请输入覆盖物名称！')
    return
  }

  const instances = map.value?.getAllOverlays()
  if (!instances?.length) {
    message.warn('当前没有任何覆盖物！')
    return
  }

  for (let layer of mapData.value) {
    for (let overlay of layer.overlays) {
      if (overlay.name.includes(searchValue.value)) {
        const id = overlay.id
        const instance = instances.find(
          instance => instance?.getExtData?.() === id,
        )

        // 正在编辑，不做操作
        if (activeOverlay.value && activeOverlay.value.id === id) {
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
        activeInstance.value = instance
        map.value?.setFitView([instance])
        return
      }
    }
  }

  message.warn('未找到对应覆盖物！')
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
