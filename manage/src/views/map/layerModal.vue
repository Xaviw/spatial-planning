<template>
  <AModal v-model:open="layerModalOpen" title="请选择要移动到的图层" @ok="onOk">
    <ARadioGroup v-model:value="target" :options="layers" />
  </AModal>
</template>

<script setup lang="ts">
import { moveOverlayToOtherLayer, useMapStore } from '@sp/shared/map'

const mapStore = useMapStore()

const { layerModalOpen, layers, mapData, activeId } = storeToRefs(mapStore)

const target = ref<string>()

function onOk() {
  moveOverlayToOtherLayer(mapData.value, activeId.value!, target.value!)
  layerModalOpen.value = false
}
</script>
