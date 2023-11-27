<template>
  <VueDraggable
    v-bind="$attrs"
    class="select-none"
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @add="onChange"
    @update="onChange"
  >
    <TransitionGroup name="sider">
      <template v-if="enableContextMenu">
        <div
          v-for="(comp, index) of modelValue"
          :key="comp.id"
          :class="['mb-2', selectedId === comp.id && 'sider-selected']"
        >
          <ADropdown :trigger="['contextmenu']">
            <component
              v-show="!filterMenu || comp.menuIds.includes(filterMenu)"
              :is="components[comp.type]"
              :key="comp.id"
              v-bind="comp.props"
            />

            <template #overlay>
              <AMenu>
                <AMenuItem key="edit" @click="onEdit(comp, index)">
                  编辑
                </AMenuItem>
              </AMenu>
            </template>
          </ADropdown>
        </div>
      </template>

      <template v-else>
        <component
          v-for="comp of modelValue"
          :key="comp.id"
          :class="['mb-2', selectedId === comp.id && 'sider-selected']"
          v-show="!filterMenu || comp.menuIds.includes(filterMenu)"
          :is="components[comp.type]"
          v-bind="comp.props"
        />
      </template>
    </TransitionGroup>
  </VueDraggable>
</template>

<script setup lang="ts">
import { components } from '@sp/shared/components'
import { cloneDeep } from 'lodash-es'
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
    modelValue: SiderItem[]
    selectedId?: string
    filterMenu?: string
    enableContextMenu?: boolean
  }>(),
  {
    modelValue: () => [],
    enableContextMenu: false,
  },
)

const emits = defineEmits<{
  (e: 'update:modelValue', newList: any[]): void
  (e: 'immer', params: SiderChangeParams): void
  (e: 'edit', item: SiderItem, index: number): void
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

function onEdit(item: SiderItem, index: number) {
  emits('edit', cloneDeep(unref(item)), index)
}
</script>

<style>
.sortable-chosen,
.sortable-ghost,
.sider-selected {
  box-shadow: 0 0 3px 3px #ffffff55;
}

.sider-enter-active,
.sider-leave-active {
  transition: all 0.3s ease;
}
.sider-enter-from,
.sider-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
