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
          :key="comp.id"
          :class="['mb-2', selectedId === comp.id && 'sider-selected']"
        >
          <ADropdown :trigger="['contextmenu']">
            <div>
              <component
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
                <AMenuItem key="remove" @click="onRemove(comp, index)">
                  删除
                </AMenuItem>
              </AMenu>
            </template>
          </ADropdown>
        </div>
      </template>

      <template v-else>
        <component
          v-for="comp of model"
          :key="comp.id"
          :class="['mb-2', selectedId === comp.id && 'sider-selected']"
          :is="components[comp.type]"
          v-bind="comp.props"
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

<script setup lang="ts" generic="T extends MaterialItem">
import { components } from '@sp/shared/materials'
import { toRawValue } from '@sp/shared/utils'
import { cloneDeep } from 'lodash-es'
import { VueDraggable } from 'vue-draggable-plus'
import type { MaterialItem, SiderPosition } from '#/business'

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
  (e: 'edit', item: T, index: number): void
  (e: 'remove', position: SiderPosition, index: number, item: T): void
}>()

const model = defineModel<T[]>({ default: [], required: true })

const attrs = useAttrs()

function onEdit(item: T, index: number) {
  emits('edit', cloneDeep(toRawValue(item)), index)
}

function onRemove(item: T, index: number) {
  emits('remove', attrs.id as SiderPosition, index, cloneDeep(toRawValue(item)))
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
