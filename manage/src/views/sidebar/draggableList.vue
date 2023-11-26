<template>
  <VueDraggable
    v-bind="$attrs"
    class="select-none"
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @add="onAdd"
  >
    <component
      v-for="comp of modelValue"
      :key="comp.id"
      :is="components[comp.type]"
      v-bind="comp.props"
      class="mb-2"
    />
  </VueDraggable>
</template>

<script setup lang="ts">
import { components } from '@sp/shared/components'
import { VueDraggable, type UseDraggableOptions } from 'vue-draggable-plus'

type Add = NonNullable<Pick<UseDraggableOptions<any>, 'onAdd'>['onAdd']>

const props = withDefaults(
  defineProps<{
    modelValue: any[]
    relationMenuIds?: string[]
  }>(),
  {
    componentList: () => [],
    relationMenuIds: () => [],
  },
)

defineEmits<{
  (e: 'update:modelValue', newList: any[]): void
}>()

function onAdd(e: Parameters<Add>[0]) {
  const index = e.newIndex!
  const params = {
    id: undefined,
    prevId: index > 0 ? props.modelValue[index - 1].id : undefined,
    nextId: props.modelValue[index + 1]?.id,
    index,
  }
  for (let symbol of Object.getOwnPropertySymbols(e.item)) {
    if (symbol.toString() === 'Symbol(cloneElement)') {
      params.id = (e.item as any)[symbol].id
    }
  }
  console.log('params', params)
}
</script>

<style>
.sortable-chosen {
  transform: scale(1.2);
  transform-origin: left center;
}

/* .sortable-drag {} */

.sortable-ghost {
  /* background: blue; */
  box-shadow: 0 0 3px 3px #ffffff55;
}
</style>
