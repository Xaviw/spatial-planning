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
    :open="modelValue"
    @update:open="(e: boolean) => $emit('update:modelValue', e)"
  >
    <AConfigProvider :locale="zhCN">
      <slot />
    </AConfigProvider>
  </AModal>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<style>
.sp-modal .ant-modal-content {
  padding: 0 !important;
}
</style>
