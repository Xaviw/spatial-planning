<template>
  <AInputGroup
    compact
    class="flex!"
    :style="{ flexDirection: direction === 'horizontal' ? 'row' : 'column' }"
  >
    <AFormItemRest>
      <AInputNumber
        v-for="item of num"
        :key="item"
        :class="itemClass(item)"
        :style="[
          gap &&
            item !== num &&
            (direction === 'horizontal'
              ? `margin-right:${gap}`
              : `margin-bottom:${gap}`),
        ]"
        :value="modelValue[item - 1]"
        @update:value="onUpdate($event as number, item - 1)"
        v-bind="props.props[item - 1] || {}"
        @paste="onPaste(item - 1, $event)"
      />
    </AFormItemRest>
  </AInputGroup>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'

const props = withDefaults(
  defineProps<{
    num?: number
    modelValue?: (number | undefined)[]
    props?: Recordable[]
    events?: Recordable<Fn>
    direction?: 'horizontal' | 'vertical'
    gap?: string
  }>(),
  {
    num: 2,
    direction: 'horizontal',
    modelValue: () => [],
    props: () => [],
  },
)

const emits = defineEmits<{
  (e: 'update:modelValue', val: (number | undefined)[]): void
}>()

function itemClass(index: number) {
  if (props.direction === 'horizontal' && !props.gap) {
    if (index === 1) return 'first-vector'
    else if (index === props.num) return 'last-vector'
    return 'middle-vector'
  }
}

function onUpdate(value: number, index: number) {
  let copy = [...props.modelValue]
  copy[index] = value
  emits('update:modelValue', copy)
}

function onPaste(index: number, e: ClipboardEvent) {
  e.preventDefault()
  const pastedText = e.clipboardData?.getData('text/plain')
  if (!pastedText) return

  if (pastedText?.includes(',')) {
    const values = pastedText.split(',').map(item => parseFloat(item))
    if (values.some(item => isNaN(item))) {
      message.warn('请输入数字！')
      return
    }
    const copied = [...props.modelValue]
    for (let i = 0; i < Math.min(props.num, values.length); i++) {
      copied[i] = values[i]
    }
    emits('update:modelValue', copied)
  } else {
    const value = parseFloat(pastedText)
    if (isNaN(value)) {
      message.warn('请输入数字！')
      return
    }
    const copied = [...props.modelValue]
    copied[index] = value
    emits('update:modelValue', copied)
  }
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

.middle-vector :deep(.ant-input-number-group-addon) {
  border-radius: 0;
}
.middle-vector :deep(.ant-input-number) {
  border-radius: 0;
}

.last-vector :deep(.ant-input-number-group-addon:first-child) {
  border-start-start-radius: 0;
  border-end-start-radius: 0;
}

.last-vector :deep(.ant-input-number:first-child) {
  border-start-start-radius: 0;
  border-end-start-radius: 0;
}
</style>
