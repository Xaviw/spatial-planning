<template>
  <div class="from-[#043563] to-[#04356305] bg-gradient-to-r">
    <ACollapse
      v-bind="props"
      expandIconPosition="end"
      ghost
      v-model:activeKey="activeKey"
    >
      <ACollapsePanel :header="title" :key="1">
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
import { ref } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import type { CollapseProps } from '#/components'

const props = withDefaults(defineProps<CollapseProps>(), {
  defaultOpen: false,
})

const activeKey = ref(props.defaultOpen ? 1 : undefined)
</script>

<style scoped>
:deep(.ant-collapse-header) {
  align-items: center !important;
  color: #fff !important;
}

:deep(.ant-collapse-header-text) {
  color: #ffd15c;
  font-size: 1.25rem;
  font-weight: bold;
}

:deep(.ant-collapse-content-box) {
  padding: 0 16px 12px 16px !important;
}

:deep(.w-e-text-container) {
  background-color: transparent !important;
  color: #fff !important;
}
</style>
