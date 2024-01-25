<template>
  <div class="sidebar">
    <div class="materials-modal-header">
      <i
        :class="[
          position === 'left'
            ? 'i-ant-design:pic-left-outlined'
            : 'i-ant-design:pic-right-outlined',
          'mr-2',
        ]"
      />
      {{ position === 'left' ? '左' : '右' }}栏
    </div>

    <div class="flex-1 overflow-auto">
      <DraggableList
        v-model="modelList"
        group="sider"
        id="left"
        enableContextMenu
        :disabled="!selectedMenu"
        @edit="edit"
        @remove="onRemove"
        :selectedId="selectedItem?.id"
        :filterMenu="selectedMenu"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DraggableList, useSiderStore } from '@sp/shared/helpers/sider'
import type { SiderPosition } from '#/business'

const props = defineProps<{
  position: SiderPosition
}>()

const siderStore = useSiderStore()
const { list, selectedItem, selectedMenu } = storeToRefs(siderStore)
const { edit } = siderStore

const modelList = computed(() => list.value[props.position])

function onRemove(index: number) {
  modelList.value.splice(index, 1)
}
</script>
