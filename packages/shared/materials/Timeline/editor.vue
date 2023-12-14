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
          label="内容"
          name="content"
          :rules="{ required: true, message: '请填写内容！' }"
        >
          <AInput v-model:value="item.content" class="w-30" />
        </AFormItem>
        <AFormItem label="圆圈颜色" help="默认“蓝色”（blue）" name="color">
          <ColorPicker v-model:pureColor="item.color" />
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
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import type { TimelineItem } from '#/components'

const props = withDefaults(
  defineProps<{
    modelValue?: TimelineItem[]
  }>(),
  { modelValue: () => [] },
)

const emits = defineEmits<{
  (e: 'update:modelValue', data: TimelineItem[]): void
}>()

const refs = ref<any[]>([])

function onAdd() {
  emits('update:modelValue', [...props.modelValue, {} as TimelineItem])
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
