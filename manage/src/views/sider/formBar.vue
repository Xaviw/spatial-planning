<template>
  <div class="flex flex-col">
    <template v-if="selectedItem">
      <div class="flex-1 overflow-x-hidden overflow-y-auto">
        <BaseForm ref="baseFormEl" />

        <component
          :is="materials[selectedItem.material.type].form"
          :key="selectedItem.id"
          ref="materialFormEl"
        />
      </div>

      <div class="flex">
        <AButton class="mr-4 flex-1" type="primary" @click="onConfirm">
          确定
        </AButton>
        <AButton class="flex-1" danger @click="onCancel">取消</AButton>
      </div>
    </template>
    <AEmpty
      v-else
      description="请右击“左栏”、“右栏”中的组件，选择“编辑”"
      class="h-full flex flex-col items-center justify-center"
    />
  </div>
</template>

<script setup lang="ts">
import { useSiderStore } from '@sp/shared/helpers/sider'
import { materials } from '@sp/shared/materials'
import BaseForm from './baseForm.vue'

const baseFormEl = ref<InstanceType<typeof BaseForm> | null>(null)
const materialFormEl = ref<any | null>(null)

watchEffect(() => {
  if (baseFormEl.value && materialFormEl.value) {
    bf.value = baseFormEl.value
    mf.value = materialFormEl.value
  }
})

const siderStore = useSiderStore()
const {
  selectedItem,
  baseFormEl: bf,
  materialFormEl: mf,
} = storeToRefs(siderStore)

function onConfirm() {}

function onCancel() {}
</script>
