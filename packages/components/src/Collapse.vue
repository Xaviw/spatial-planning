<template>
  <div class="from-[#043563] to-[#04356305] bg-gradient-to-r">
    <ACollapse v-bind="props" expandIconPosition="end" ghost>
      <ACollapsePanel
        v-for="(item, index) of data"
        :key="index"
        :header="item.title"
      >
        <!-- <Editor
          style="height: 500px; overflow-y: hidden"
          v-model="item.content"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
        /> -->
      </ACollapsePanel>
    </ACollapse>
  </div>
</template>

<script setup lang="ts">
// import { Editor } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

const props = withDefaults(
  defineProps<{
    data: { title: string; content: string }[]
    /**
     * 手风琴模式
     * @default false
     */
    accordion?: boolean
  }>(),
  {
    data: () => [],
  },
)
</script>

<style>
.ant-collapse-header-text {
  color: #ffd15c;
  font-size: 1.25rem;
  font-weight: bold;
}
</style>
