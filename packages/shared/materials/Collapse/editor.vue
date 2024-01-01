<template>
  <div class="relative z-1 border border-[#d9d9d9] border-solid">
    <Toolbar
      class="border-0 border-b border-[#d9d9d9] border-solid"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="simple"
    />
    <Editor
      class="min-h-[300px] overflow-auto"
      v-model="model"
      :defaultConfig="editorConfig"
      mode="simple"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script lang="ts" setup>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { message } from 'ant-design-vue'
import '@wangeditor/editor/dist/css/style.css'
import type { IToolbarConfig, IEditorConfig } from '@wangeditor/editor'
import type { AlertType } from 'ant-design-vue/es/alert'

const model = defineModel<string>()

const editorRef = shallowRef()
const toolbarConfig: Partial<IToolbarConfig> = { modalAppendToBody: true }
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容...',
  scroll: false,
  customAlert(info: string, type: AlertType) {
    switch (type) {
      case 'success':
        message.success(info)
        break
      case 'info':
        message.info(info)
        break
      case 'warning':
        message.warning(info)
        break
      case 'error':
        message.error(info)
        break
      default:
        message.info(info)
        break
    }
  },
}

onBeforeUnmount(() => {
  if (!editorRef.value) return
  editorRef.value?.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor
}

defineExpose({
  async validate() {
    await nextTick()
    const empty = editorRef.value.isEmpty()
    const text = editorRef.value.getText().trim()

    if (empty && !text) {
      return Promise.reject()
    }
    return Promise.resolve()
  },
})
</script>
