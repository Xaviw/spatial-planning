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
      <div class="flex items-center">
        <ATooltip placement="bottom">
          <ATag color="processing">
            操作帮助
            <template #icon>
              <i class="i-ant-design:question-circle-outlined" />
            </template>
          </ATag>

          <template #title>
            <div>右击地图覆盖物进行操作；</div>
            <div>点击左侧工具栏中工具绘制覆盖物(再次点击取消)；</div>

            <div v-if="['Marker', 'Text'].includes(activeOverlay?.type || '')">
              拖动移动位置；
            </div>
            <div v-if="activeTool === 'marker'">
              点击地图目标位置新增标记点；
            </div>

            <template
              v-if="['Polyline', 'Polygon'].includes(activeOverlay?.type || '')"
            >
              <div>拖动白色控制点移动端点位置；</div>
              <div>拖动蓝色控制点新增端点；</div>
              <div>点击白色控制点删除端点；</div>
              <div>拖动非控制点移动整体位置；</div>
            </template>
            <div v-if="['polyline', 'polygon'].includes(activeTool || '')">
              点击地图目标位置新增端点，双击目标位置或右击完成绘制；
            </div>

            <template
              v-if="['BezierCurve'].includes(activeOverlay?.type || '')"
            >
              <div>拖动白色控制点移动端点位置；</div>
              <div>拖动蓝色控制点新增端点；</div>
              <div>右击白色控制点新增曲度控制点；</div>
              <div>左击删除控制点；</div>
              <div>拖动非控制点移动整体位置；</div>
            </template>

            <div v-if="['rectangle', 'circle'].includes(activeTool || '')">
              从目标位置开始按住鼠标左键并拖动绘制
            </div>
            <template
              v-if="['Rectangle', 'Circle'].includes(activeOverlay?.type || '')"
            >
              <div>拖动控制点改变尺寸；</div>
              <div>拖动非控制点移动整体位置；</div>
            </template>

            <div v-if="activeOverlay?.type === 'Ellipse'">
              拖动中心控制点改变位置；拖动边缘控制点改变尺寸；
            </div>
          </template>
        </ATooltip>
        <AButton type="primary" :disabled="!canUndo" @click="onSubmit">
          提交
        </AButton>
      </div>
    </div>

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

const {
  canRedo,
  canUndo,
  selectedMenu,
  loading,
  sourceData,
  mapData,
  activeOverlay,
  activeTool,
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
