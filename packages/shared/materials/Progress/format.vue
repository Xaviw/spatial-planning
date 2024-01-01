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
const model = defineModel<string>()

const before = ref('')
const after = ref('')

watchEffect(() => {
  if (model.value?.includes('</>')) {
    const [l, r] = model.value.split('</>')
    before.value = l
    after.value = r
  }
})

function onChange() {
  model.value = `${before.value}</>${after.value}`
}
</script>
