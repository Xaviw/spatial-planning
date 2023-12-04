<template>
  <VueDraggable
    v-bind="$attrs"
    class="h-full select-none"
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
            <div>
              <component
                v-show="show(comp)"
                :is="components[comp.type]"
                :key="comp.id"
                v-bind="comp.props"
              />
            </div>

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
          v-show="show(comp)"
          :is="components[comp.type]"
          v-bind="comp.props"
        />
      </template>
    </TransitionGroup>
  </VueDraggable>
</template>

<script setup lang="ts" generic="T extends SiderItem | DetailItem">
import { components } from '@sp/shared/components'
import { cloneDeep } from 'lodash-es'
import { unref } from 'vue'
import { VueDraggable, type UseDraggableOptions } from 'vue-draggable-plus'
import type { DetailItem, SiderItem, SiderChangeParams } from '#/request'

type Add = NonNullable<Pick<UseDraggableOptions<any>, 'onAdd'>['onAdd']>

const props = withDefaults(
  defineProps<{
    modelValue: T[]
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
  (e: 'mutative', params: SiderChangeParams): void
  (e: 'edit', item: T, index: number): void
}>()

const show = (item: T) => {
  if (!props.filterMenu) return true
  if ((item as SiderItem).menuIds) {
    return (item as SiderItem).menuIds.includes(props.filterMenu)
  }
  return true
}

function onChange(e: Parameters<Add>[0]) {
  let original: T
  for (let symbol of Object.getOwnPropertySymbols(e.item)) {
    if (symbol.toString() === 'Symbol(cloneElement)') {
      original = (e.item as any)[symbol]
    }
  }
  if (e.from.id === 'material') {
    emits('mutative', {
      name: 'add',
      to: e.to.id,
      newIndex: e.newIndex,
      data: original!,
    })
  } else if (e.to.id === 'temp') {
    emits('mutative', {
      name: 'remove',
      from: e.from.id,
      oldIndex: e.oldIndex,
      data: original!,
    })
  } else {
    emits('mutative', {
      name: 'move',
      from: e.from.id,
      to: e.to.id,
      newIndex: e.newIndex,
      oldIndex: e.oldIndex,
      data: original!,
    })
  }
}

function onEdit(item: T, index: number) {
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
  transform: translateY(-30px);
}
</style>
