<!-- prettier-ignore -->
<template>
  <div class="p-2">
    <div class="mb-2 flex items-center justify-between text-base">
      <span class="mr-2">图层</span>
      <ATag color="processing" class="text-base">新增覆盖物将放于选中图层中</ATag>
      <div class="flex-1 text-end">
        <AButton type="primary" @click="onAdd" :disabled="disabled" class="text-base">新增</AButton>
      </div>
    </div>
    <VueDraggable
      v-model="model"
      target="tbody"
      class="max-h-60 overflow-auto"
    >
      <table class="w-full">
        <thead class="sticky top-0 z-1">
          <tr class="outline-1 outline-gray-3 outline">
            <th>显隐</th>
            <th>名称</th>
            <th>作为图例</th>
            <th>图例</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="model?.length">
            <LayerItemComponent
              v-for="layer of model"
              :key="layer.id"
              :layer="layer"
              :removeable="model.length > 1"
              @remove="onRemove"
              @save="onSave"
            >
              <template #default="{ visible }">
                <slot :visible="visible" :list="layer.overlays" />
              </template>
            </LayerItemComponent>
          </template>
          <tr v-else>
            <th :colspan="6">
              <AEmpty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
            </th>
          </tr>
        </tbody>
      </table>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '@sp/shared/map'
import { Empty } from 'ant-design-vue'
import { VueDraggable } from 'vue-draggable-plus'
import LayerItemComponent from './layerItem.vue'
import type { LayerItem, OverlayType } from '#/business'

defineProps<{
  disabled?: boolean
}>()

const model = defineModel<LayerItem<OverlayType>[]>({
  default: [],
  required: true,
})

const { activeId } = storeToRefs(useMapStore())

function onRemove(id: string) {
  const index = model.value.findIndex(item => item.id === id)
  model.value.splice(index, 1)
}

function onSave(data: Omit<LayerItem<OverlayType>, 'overlays'>) {
  const index = model.value.findIndex(item => item.id === data.id)
  model.value[index] = { ...model.value[index], ...data }
}

function onAdd() {
  const id = `add_${Date.now()}`
  model.value.push({
    id,
    asLegend: false,
    name: '新增图层',
    overlays: [],
    status: true,
    createTime: new Date().toLocaleString(),
  })
  if (!activeId.value) {
    activeId.value = id
  }
}
</script>

<style scoped>
thead th {
  padding: 0 0 7px 0;
  background-color: #fff;
}
</style>
