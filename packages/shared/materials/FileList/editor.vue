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
          help="支持图片、音频、视频、Office文件的在线预览"
        >
          <Upload v-model="item.src" :maxCount="1" />
        </AFormItem>
        <AFormItem label="封面图片" help="默认显示文件类型对应图片" name="img">
          <Upload v-model="item.img" :maxCount="1" accept="image/*" />
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
import { CssSizeInput, Upload } from '@sp/shared/components'
import { is } from 'ramda'
import type { FileListItem } from '#/materials'

const model = defineModel<FileListItem[]>({ default: [] })

const refs = ref<any[]>([])

function onAdd() {
  model.value.push({} as FileListItem)
}

function onRemove(index: number) {
  model.value.splice(index, 1)
}

defineExpose({
  validate() {
    const events: Promise<any>[] = []
    for (const instance of refs.value) {
      if (is(Function, instance?.validate)) {
        events.push(instance.validate())
      }
    }
    return Promise.all(events)
  },
})
</script>
