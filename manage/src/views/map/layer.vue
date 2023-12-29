<!-- prettier-ignore -->
<template>
  <div class="p-2">
    <div class="mb-2 flex items-center justify-between">
      <span>图层</span>
      <AButton type="primary" size="small" @click="onAdd" :disabled="disabled">新增</AButton>
    </div>
    <VueDraggable
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
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
          <template v-if="modelValue?.length">
            <LayerItemVue
              v-for="layer of modelValue"
              :key="layer.id"
              :layer="layer"
              :removeable="modelValue.length > 1"
              @remove="onRemove"
              @save="onSave"
            >
              <template #default="{ visible }">
                <Marker
                  v-for="overlay of layer.overlays"
                  :key="overlay.id"
                  :visible="visible"
                  :layerId="layer.id"
                  :props="(overlay.props as MarkerProps)"
                  :id="overlay.id"
                  :details="overlay.details"
                />
              </template>
            </LayerItemVue>
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
import { Marker } from '@sp/shared/map'
import { Empty } from 'ant-design-vue'
import { VueDraggable } from 'vue-draggable-plus'
import LayerItemVue from './layerItem.vue'
import type { LayerItem, OverlayType, MarkerProps } from '#/business'

const props = defineProps<{
  modelValue: LayerItem<OverlayType>[]
  disabled?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: LayerItem<OverlayType>[]): void
}>()

function onRemove(id: string) {
  const index = props.modelValue.findIndex(item => item.id === id)
  const clone = [...props.modelValue]
  clone.splice(index, 1)
  emits('update:modelValue', clone)
}

function onSave(data: Omit<LayerItem<OverlayType>, 'overlays'>) {
  const index = props.modelValue.findIndex(item => item.id === data.id)
  const clone = [...props.modelValue]
  clone[index] = { ...clone[index], ...data }
  emits('update:modelValue', clone)
}

function onAdd() {
  emits('update:modelValue', [
    ...props.modelValue,
    {
      id: `add_${Date.now()}`,
      asLegend: false,
      name: '新增图层',
      overlays: [],
      status: true,
    } as unknown as LayerItem<OverlayType>,
  ])
}
</script>

<style scoped>
thead th {
  padding: 0 0 7px 0;
  background-color: #fff;
}
</style>
