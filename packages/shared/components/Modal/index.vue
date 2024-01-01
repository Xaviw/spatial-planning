<template>
  <AModal
    centered
    :footer="null"
    :closable="false"
    width="auto"
    :bodyStyle="{
      padding: 0,
      background: 'transparent',
    }"
    wrapClassName="sp-modal"
    v-bind="$attrs"
    v-model:open="model"
  >
    <AConfigProvider :locale="zhCN">
      <slot />
    </AConfigProvider>
  </AModal>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'

const model = defineModel<boolean>({ required: true })
</script>

<style>
.sp-modal .ant-modal-content {
  padding: 0 !important;
}
</style>
