<template>
  <AForm
    v-for="(item, index) of model"
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
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import type { TimelineItem } from '#/materials'

const model = defineModel<TimelineItem[]>({ default: [] })

const refs = ref<any[]>([])

function onAdd() {
  model.value.push({} as TimelineItem)
}

function onRemove(index: number) {
  model.value.splice(index, 1)
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
