<template>
  <AForm
    v-for="(item, index) of model"
    :model="item"
    :key="index"
    class="mb-2"
    :ref="el => (refs[index] = el)"
  >
    <div class="editor-block">
      <div class="mr-4 flex-1">
        <AFormItem
          label="名称"
          name="label"
          :rules="{ required: true, message: '请填写名称！' }"
        >
          <AInput v-model:value="item.label" class="w-30" />
        </AFormItem>
        <AFormItem
          label="内容"
          name="value"
          :rules="{ required: true, message: '请填写内容！' }"
        >
          <ATextarea v-model:value="item.value" :autoSize="{ minRows: 1 }" />
        </AFormItem>
      </div>
      <AFormItem>
        <div
          class="editor-btn"
          v-if="index === model.length - 1"
          @click="onAdd"
        >
          <i class="i-ant-design:plus-outlined" />
        </div>
        <div @click="onRemove(index)" v-else class="editor-btn">
          <i class="i-ant-design:close-outlined text-red" />
        </div>
      </AFormItem>
    </div>
  </AForm>
</template>

<script setup lang="ts">
import { isFunction } from '@sp/shared/utils'
import type { DescriptionItemProps } from '#/materials'

const model = defineModel<DescriptionItemProps[]>({ default: [] })

const refs = ref<any[]>([])

function onAdd() {
  model.value.push({} as DescriptionItemProps)
}

function onRemove(index: number) {
  model.value.splice(index, 1)
}

defineExpose({
  validate() {
    const events: Promise<any>[] = []
    for (const instance of refs.value) {
      if (isFunction(instance?.validate)) {
        events.push(instance.validate())
      }
    }
    return Promise.all(events)
  },
})
</script>

<style scoped>
.btn {
  @apply flex items-center justify-center border border-[#d9d9d9] rounded border-solid p-2 cursor-pointer;
}
</style>
