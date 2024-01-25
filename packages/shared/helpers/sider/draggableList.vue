<template>
  <VueDraggable
    v-bind="$attrs"
    :disabled="disabled"
    class="h-full select-none"
    v-model="model"
  >
    <TransitionGroup name="sider">
      <template v-if="enableContextMenu">
        <div
          v-for="(comp, index) of model"
          :key="comp.id || index"
          :class="['mb-2', selectedId === comp.id && 'sider-selected']"
        >
          <ADropdown :trigger="['contextmenu']">
            <div>
              <component
                :is="materials[comp.material.type]"
                :key="comp.id"
                v-bind="comp.material.props"
              />
            </div>

            <template #overlay>
              <AMenu>
                <AMenuItem key="edit" @click="onEdit(comp)">编辑</AMenuItem>
                <AMenuItem key="remove" @click="onRemove(index, comp)">
                  删除
                </AMenuItem>
              </AMenu>
            </template>
          </ADropdown>
        </div>
      </template>

      <template v-else>
        <component
          v-for="(comp, index) of model"
          :key="comp.id || index"
          :class="['mb-2', selectedId === comp.id && 'sider-selected']"
          :is="materials[comp.material.type]"
          v-bind="comp.material.props"
        />
      </template>
    </TransitionGroup>

    <AEmpty
      v-if="!model.length"
      :description="
        disabled ? '请在右侧选择菜单' : '拖动“物料栏”中的组件到这里新增'
      "
      class="h-full flex flex-col items-center justify-center"
    />
  </VueDraggable>
</template>

<script setup lang="ts" generic="T extends SiderItem">
import { materials } from '@sp/shared/materials'
import { VueDraggable } from 'vue-draggable-plus'
import type { SiderItem } from '#/business'

withDefaults(
  defineProps<{
    selectedId?: string
    enableContextMenu?: boolean
    disabled?: boolean
  }>(),
  {
    enableContextMenu: false,
    disabled: false,
  },
)

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
</style>
