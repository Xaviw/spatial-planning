<template>
  <AForm
    v-for="(item, index) of modelValue"
    :model="item"
    :key="index"
    class="mb-2"
    :ref="(el: any) => (refs[index] = el)"
  >
    <div class="editor-block">
      <div class="mr-4 flex-1">
        <AFormItem
          label="名称"
          name="name"
          :rules="{ required: true, message: '请填写名称！' }"
        >
          <AInput v-model:value="item.name" class="w-30" />
        </AFormItem>
        <AFormItem
          label="数值"
          name="value"
          :rules="{ required: true, message: '请填写数值！' }"
        >
          <AInputNumber v-model:value="item.value" :min="0" />
        </AFormItem>
      </div>
      <AFormItem>
        <div
          class="editor-btn"
          v-if="index === modelValue.length - 1"
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
import type { ProgressItem } from '#/components'

const props = withDefaults(
  defineProps<{
    modelValue?: ProgressItem[]
  }>(),
  { modelValue: () => [] },
)

const emits = defineEmits<{
  (e: 'update:modelValue', data: ProgressItem[]): void
}>()

const refs = ref<any[]>([])

function onAdd() {
  emits('update:modelValue', [...props.modelValue, {} as ProgressItem])
}

function onRemove(index: number) {
  const clone = [...props.modelValue]
  clone.splice(index, 1)
  emits('update:modelValue', clone)
}

defineExpose({
  validate() {
    const events: Promise<any>[] = []
    for (const instance of refs.value) {
      if (typeof instance?.validate === 'function') {
        events.push(instance.validate())
      }
    }
    return Promise.all(events)
  },
})
</script>
