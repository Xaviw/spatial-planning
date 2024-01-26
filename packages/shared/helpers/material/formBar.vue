<template>
  <div class="min-h-0 flex flex-col">
    <!-- 顶部 -->
    <div class="mb-2 bg-white p-4">
      <div class="mb-2 flex">
        <div class="flex-1">
          <AButton danger @click="$emit('undo')" :disabled="!canUndo">
            撤销
          </AButton>
          <AButton
            type="primary"
            class="mx-2"
            ghost
            @click="$emit('redo')"
            :disabled="!canRedo"
          >
            重做
          </AButton>
        </div>
        <AButton type="primary" :disabled="!canUndo" @click="$emit('submit')">
          提交
        </AButton>
      </div>

      <slot name="alert" />

      <div class="flex items-center" v-if="showMenu">
        <span>选择菜单：</span>
        <ATreeSelect
          :fieldNames="{ label: 'name', value: 'id' }"
          :filterTreeNode="onMenuFilter"
          placeholder="选择或搜索菜单进行筛选"
          v-model:searchValue="menuSearchValue"
          v-model:value="selectedMenu"
          treeDefaultExpandAll
          showSearch
          :treeData="menuData"
          @dropdownVisibleChange="onMenuDropdown"
          @change="$emit('menuChange', $event)"
          class="flex-1"
        />
      </div>
    </div>

    <!-- 表单 -->
    <div class="flex flex-1 flex-col overflow-hidden bg-white p-4">
      <template v-if="selectedItem">
        <div class="flex-1 overflow-x-hidden overflow-y-auto pr-2">
          <BaseForm ref="baseFormEl" />

          <component
            :is="materialForms[(selectedItem as T).type]"
            :key="(selectedItem as T).id"
            ref="materialFormEl"
          />
        </div>

        <div class="flex">
          <AButton class="mr-4 flex-1" type="primary" @click="onConfirm">
            确定
          </AButton>
          <AButton
            class="flex-1"
            danger
            @click="$emit('cancel', getFormModel())"
          >
            取消
          </AButton>
        </div>
      </template>
      <AEmpty
        v-else
        description="请右击组件，选择“编辑”"
        class="h-full flex flex-col items-center justify-center"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends MaterialLike">
import { BaseForm } from '@sp/shared/helpers/material'
import { useMenuTree } from '@sp/shared/hooks'
import { materialForms } from '@sp/shared/materials'
import { cloneDeep } from '@sp/shared/utils'
import type { FormEl } from '#/business'
import type { MaterialLike } from '#/materials'

const props = defineProps<{
  canRedo: boolean
  canUndo: boolean
  showMenu?: boolean
  selectedItem?: T
}>()

const emits = defineEmits<{
  (e: 'redo'): void
  (e: 'undo'): void
  (e: 'submit'): void
  (e: 'menuChange', id: string): void
  (e: 'confirm', value: T): void
  (e: 'cancel', value: T): void
}>()

const {
  menuData,
  menuSearchValue,
  onMenuDropdown,
  onMenuFilter,
  selectedMenu,
} = useMenuTree()

const baseFormEl = ref<FormEl | null>(null)
const materialFormEl = ref<FormEl | null>(null)

watch(
  () => props.selectedItem,
  item => {
    if (item) {
      nextTick(() => {
        if (!baseFormEl.value || !materialFormEl.value) {
          throw new Error('为获取到实例')
        }
        baseFormEl.value.formModel = cloneDeep(item)
        materialFormEl.value.formModel = cloneDeep(item.props)
      })
    }
  },
)

async function onConfirm() {
  if (!baseFormEl.value || !materialFormEl.value) return
  await baseFormEl.value.validate()
  await materialFormEl.value.validate()
  emits('confirm', getFormModel())
}

function getFormModel() {
  if (!baseFormEl.value || !materialFormEl.value) {
    throw new Error('为获取到实例')
  }
  return {
    ...baseFormEl.value.formModel,
    props: materialFormEl.value.formModel,
  } as T
}

defineExpose({
  formModel: getFormModel,
})
</script>

<style>
.editor-block {
  @apply max-w-100 flex items-center border border-[#d9d9d9] border-dashed p-2 pb-0;
}

.editor-btn {
  @apply flex items-center justify-center border border-[#d9d9d9] rounded border-solid p-2 cursor-pointer;
}
</style>
