<template>
  <div class="from-[#043563] to-[#04356305] bg-gradient-to-r">
    <ACollapse v-bind="props" expandIconPosition="end" ghost>
      <ACollapsePanel :header="title">
        <Editor
          style="background: transparent"
          :modelValue="content"
          :defaultConfig="{
            readOnly: true,
            scroll: false,
          }"
        />
      </ACollapsePanel>
    </ACollapse>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

const props = defineProps<{
  /** 标题 */
  title: string
  /** 富文本内容 */
  content: string
  /**
   * 手风琴模式
   * @default false
   */
  accordion?: boolean
}>()
</script>

<style>
:root {
  --w-e-textarea-bg-color: transparent;
  --w-e-textarea-color: #fff;
}

.ant-collapse-header {
  align-items: center !important;
}

.ant-collapse-header-text {
  color: #ffd15c;
  font-size: 1.25rem;
  font-weight: bold;
}

.ant-collapse-content-box {
  padding: 0 16px 12px 16px !important;
}
</style>
