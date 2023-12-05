<template>
  <Form
    v-for="(item, index) of modelValue"
    :model="item"
    :key="index"
    class="mb-2"
    :ref="el => refs.push(el)"
  >
    <div class="editor-block">
      <div class="mr-4 flex-1">
        <Form.Item
          label="名称"
          name="label"
          :rules="{ required: true, message: '请填写名称！' }"
        >
          <Input v-model:value="item.label" class="w-30" />
        </Form.Item>
        <Form.Item
          label="内容"
          name="value"
          :rules="{ required: true, message: '请填写内容！' }"
        >
          <Input.TextArea
            v-model:value="item.value"
            :autoSize="{ minRows: 1 }"
          />
        </Form.Item>
      </div>
      <Form.Item>
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
      </Form.Item>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { Form, Input } from 'ant-design-vue'
import { ref } from 'vue'
import type { DescriptionItemProps } from '#/components'

const props = withDefaults(
  defineProps<{
    modelValue?: DescriptionItemProps[]
  }>(),
  { modelValue: () => [] },
)

const emits = defineEmits<{
  (e: 'update:modelValue', data: DescriptionItemProps[]): void
}>()

const refs = ref<any[]>([])

function onAdd() {
  emits('update:modelValue', [...props.modelValue, {} as DescriptionItemProps])
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
      if (typeof instance.validate === 'function') {
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
