<template>
  <AModal
    :open="modelValue"
    @update:open="(e: boolean) => $emit('update:modelValue', e)"
    centered
    :closable="false"
    :footer="null"
    width="auto"
    :bodyStyle="{
      padding: 0,
      background: 'transparent',
    }"
  ></AModal>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
  }>(),
  {
    modelValue: false,
  },
)

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>
