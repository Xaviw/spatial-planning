<template>
  <div class="sidebar">
    <div class="sidebar-title">
      <slot name="title" />
    </div>

    <div class="flex-1 overflow-auto">
      <VueDraggable
        group="sider"
        v-bind="$attrs"
        :disabled="disabled"
        class="h-full select-none"
        v-model="model"
      >
        <TransitionGroup name="sider">
          <div
            v-for="(m, i) of model"
            :key="m.id || i"
            :class="[
              'mb-2',
              selectedId && selectedId === m.id && 'sider-selected',
            ]"
          >
            <ADropdown
              :trigger="['contextmenu']"
              :disabled="!enableContextMenu"
            >
              <div>
                <component
                  :is="materials[m.type]"
                  :key="m.id"
                  v-bind="m.props"
                />
              </div>

              <template #overlay>
                <AMenu>
                  <AMenuItem key="edit" @click="onEdit(m)">编辑</AMenuItem>
                  <AMenuItem key="remove" @click="onRemove(i, m)">
                    删除
                  </AMenuItem>
                </AMenu>
              </template>
            </ADropdown>
          </div>
        </TransitionGroup>

        <AEmpty
          v-if="!model.length"
          :description="
            disabled ? '请在右侧选择菜单' : '拖动“物料栏”中的组件到这里新增'
          "
          class="h-full flex flex-col items-center justify-center"
        />
      </VueDraggable>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends MaterialLike">
import { materials } from '@sp/shared/materials'
import { VueDraggable } from 'vue-draggable-plus'
import type { MaterialLike } from '#/materials'

defineProps<{
  selectedId?: string
  enableContextMenu?: boolean
  disabled?: boolean
}>()

const emits = defineEmits<{
  (e: 'edit', item: T): void
  (e: 'remove', index: number, item: T): void
}>()

const model = defineModel<T[]>({ default: [], required: true })

function onEdit(item: T) {
  emits('edit', item)
}

function onRemove(index: number, item: T) {
  emits('remove', index, item)
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

.sidebar {
  @apply mr-2 w-100 flex flex-col bg-[#001231] text-white;
}
.sidebar-title {
  @apply border-0 border-b-1 border-white border-solid px-4 py-2 text-lg font-600 text-white flex items-center;
}
</style>
