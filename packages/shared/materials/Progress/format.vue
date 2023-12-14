<template>
  <AInputGroup compact>
    <AInput
      v-model:value="before"
      class="text-right!"
      style="width: calc(50% - 25px)"
      placeholder="前置信息"
      @change="onChange"
    />
    <AInput
      v-model:value="after"
      style="width: calc(50% + 25px)"
      placeholder="后置信息"
      addonBefore="数据"
      @change="onChange"
    />
  </AInputGroup>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue?: string }>()

const emits = defineEmits<{
  (e: 'update:modelValue', newValue: string): void
}>()

const before = ref('')
const after = ref('')

watchEffect(() => {
  if (props.modelValue?.includes('</>')) {
    const [l, r] = props.modelValue.split('</>')
    before.value = l
    after.value = r
  }
})

function onChange() {
  emits('update:modelValue', `${before.value}</>${after.value}`)
}
</script>
