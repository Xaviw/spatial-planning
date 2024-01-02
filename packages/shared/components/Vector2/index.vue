<template>
  <AInputGroup
    compact
    class="flex!"
    :style="{ flexDirection: direction === 'horizontal' ? 'row' : 'column' }"
  >
    <AFormItemRest>
      <AInputNumber
        :class="[direction === 'horizontal' && 'first-vector']"
        :style="[
          gap &&
            (direction === 'horizontal'
              ? `margin-right:${gap}`
              : `margin-bottom:${gap}`),
        ]"
        :value="modelValue[0]"
        @update:value="onUpdate($event as number, 0)"
        v-bind="props0"
      />
      <AInputNumber
        :class="[direction === 'horizontal' && 'secend-vector']"
        :value="modelValue[1]"
        @update:value="onUpdate($event as number, 1)"
        v-bind="props1"
      />
    </AFormItemRest>
  </AInputGroup>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: (number | undefined)[]
    props0?: Recordable
    props1?: Recordable
    events?: Recordable<Fn>
    direction?: 'horizontal' | 'vertical'
    gap?: string
  }>(),
  {
    direction: 'horizontal',
    modelValue: () => [],
  },
)

const emits = defineEmits<{
  (e: 'update:modelValue', val: (number | undefined)[]): void
}>()

// const model = defineModel<number[]>({ default: [] })

function onUpdate(value: number, index: number) {
  console.log(props.modelValue, index, value)
  let copy = [...props.modelValue]
  copy[index] = value
  emits('update:modelValue', copy)
  // if (!Array.isArray(props.modelValue)) {
  //   model.value = []
  // }
  // model.value[index] = value
}
</script>

<style scoped>
.first-vector :deep(.ant-input-number-group-addon:last-child) {
  border-start-end-radius: 0;
  border-end-end-radius: 0;
}
.first-vector :deep(.ant-input-number:last-child) {
  border-start-end-radius: 0;
  border-end-end-radius: 0;
}

.secend-vector :deep(.ant-input-number-group-addon:first-child) {
  border-start-start-radius: 0;
  border-end-start-radius: 0;
}

.secend-vector :deep(.ant-input-number:first-child) {
  border-start-start-radius: 0;
  border-end-start-radius: 0;
}
</style>
