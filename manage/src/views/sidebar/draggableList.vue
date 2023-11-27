<template>
  <VueDraggable
    v-bind="$attrs"
    class="select-none"
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @add="onChange"
    @update="onChange"
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
import type { SiderItem } from '#/client'

type Add = NonNullable<Pick<UseDraggableOptions<any>, 'onAdd'>['onAdd']>

export interface SiderChangeParams {
  name: 'add' | 'move' | 'remove'
  from?: string
  to?: string
  oldIndex?: number
  newIndex?: number
  data: SiderItem
}

withDefaults(
  defineProps<{
    modelValue: any[]
    relationMenuIds?: string[]
  }>(),
  {
    componentList: () => [],
    relationMenuIds: () => [],
  },
)

const emits = defineEmits<{
  (e: 'update:modelValue', newList: any[]): void
  (e: 'immer', params: SiderChangeParams): void
}>()

function onChange(e: Parameters<Add>[0]) {
  // const index = e.newIndex!
  // const params = {
  //   id: undefined,
  //   prevId: index > 0 ? props.modelValue[index - 1].id : undefined,
  //   nextId: props.modelValue[index + 1]?.id,
  //   index,
  // }
  let original: SiderItem
  for (let symbol of Object.getOwnPropertySymbols(e.item)) {
    if (symbol.toString() === 'Symbol(cloneElement)') {
      original = (e.item as any)[symbol]
    }
  }
  if (e.from.id === 'material') {
    emits('immer', {
      name: 'add',
      to: e.to.id,
      newIndex: e.newIndex,
      data: original!,
    })
  } else if (e.to.id === 'temp') {
    emits('immer', {
      name: 'remove',
      from: e.from.id,
      oldIndex: e.oldIndex,
      data: original!,
    })
  } else {
    emits('immer', {
      name: 'move',
      from: e.from.id,
      to: e.to.id,
      newIndex: e.newIndex,
      oldIndex: e.oldIndex,
      data: original!,
    })
  }
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
