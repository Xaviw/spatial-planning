<template>
  <Input.Group compact>
    <Form.ItemRest>
      <InputNumber
        v-model:value="data.value"
        @change="onChange"
        :disabled="disabled"
        :min="min"
        :max="max"
      />
      <Select
        v-model:value="data.unit"
        :options="unitsOptions"
        class="w-20"
        @change="onChange"
        :disabled="disabled"
      />
    </Form.ItemRest>
  </Input.Group>
</template>

<script setup lang="ts">
import { InputNumber, Select, Input, Form } from 'ant-design-vue'
import { reactive, watchEffect } from 'vue'

const props = defineProps<{
  modelValue?: string
  disabled?: boolean
  min?: number
  max?: number
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', newValue: string): void
}>()

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
  if (props.modelValue?.length) {
    const [value, unit] = (/^(\d+)(\w*)$/.exec(props.modelValue) || []).slice(1)
    data.value = value
    data.unit = unit || 'px'
  }
})

function onChange() {
  emits('update:modelValue', data.value && `${data.value}${data.unit}`)
}
</script>
