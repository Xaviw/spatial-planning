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
          label="标题"
          name="title"
          :rules="{ required: true, message: '请填写标题！' }"
        >
          <AInput v-model:value="item.title" />
        </AFormItem>
        <AFormItem
          label="文件链接"
          name="src"
          :rules="{ required: true, message: '请上传文件！' }"
        >
          <AInput v-model:value="item.src" />
        </AFormItem>
        <AFormItem label="封面图片" help="默认显示文件类型对应图片" name="img">
          <AInput v-model:value="item.img" />
        </AFormItem>
        <AFormItem
          label="图片宽度"
          help="默认保持比例自适应宽度"
          name="imgWidth"
        >
          <CssSizeInput v-model="item.imgWidth" />
        </AFormItem>
        <AFormItem label="图片高度" name="imgHeight">
          <CssSizeInput v-model="item.imgHeight" />
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
import { CssSizeInput } from '@sp/shared/components'
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
