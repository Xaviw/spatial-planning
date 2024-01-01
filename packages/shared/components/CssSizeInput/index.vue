<template>
  <AInputGroup compact>
    <AFormItemRest>
      <AInputNumber
        v-model:value="data.value"
        @change="onChange"
        :disabled="disabled"
        :min="min"
        :max="max"
      />
      <ASelect
        v-model:value="data.unit"
        :options="unitsOptions"
        class="w-20"
        @change="onChange"
        :disabled="disabled"
      />
    </AFormItemRest>
  </AInputGroup>
</template>

<script setup lang="ts">
defineProps<{
  disabled?: boolean
  min?: number
  max?: number
}>()

const model = defineModel<string>()

const unitsOptions = [
  { label: 'px', value: 'px' },
  { label: '%', value: '%' },
  { label: 'rem', value: 'rem' },
  { label: 'em', value: 'em' },
  { label: 'vw', value: 'vw' },
  { label: 'vh', value: 'vh' },
]

const data = reactive({
  value: '',
  unit: 'px',
})

watchEffect(() => {
  if (model.value?.length) {
    const [value, unit] = (/^(\d+)(\w*)$/.exec(model.value) || []).slice(1)
    data.value = value
    data.unit = unit || 'px'
  }
})

function onChange() {
  model.value = data.value && `${data.value}${data.unit}`
}
</script>
