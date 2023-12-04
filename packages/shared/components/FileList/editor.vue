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
          label="标题"
          name="title"
          :rules="{ required: true, message: '请填写标题！' }"
        >
          <Input v-model:value="item.title" />
        </Form.Item>
        <Form.Item
          label="文件链接"
          name="src"
          :rules="{ required: true, message: '请上传文件！' }"
        >
          <Input v-model:value="item.src" />
        </Form.Item>
        <Form.Item label="封面图片" help="默认显示文件类型对应图片" name="img">
          <Input v-model:value="item.img" />
        </Form.Item>
        <Form.Item
          label="图片宽度"
          help="默认保持比例自适应宽度"
          name="imgWidth"
        >
          <Input v-model:value="item.imgWidth" />
        </Form.Item>
        <Form.Item label="图片高度" name="imgHeight">
          <Input v-model:value="item.imgHeight" />
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
import type { FileListItem } from '#/components'

const props = withDefaults(
  defineProps<{
    modelValue?: FileListItem[]
  }>(),
  { modelValue: () => [] },
)

const emits = defineEmits<{
  (e: 'update:modelValue', data: FileListItem[]): void
}>()

const refs = ref<any[]>([])

function onAdd() {
  emits('update:modelValue', [...props.modelValue, {} as FileListItem])
}

function onRemove(index: number) {
  const clone = [...props.modelValue]
  clone.splice(index, 1)
  emits('update:modelValue', clone)
}

defineExpose({
  validate() {
    for (const instance of refs.value) {
      instance?.validate()
    }
  },
})
</script>
