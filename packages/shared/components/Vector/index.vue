<template>
  <AInputGroup
    compact
    class="flex!"
    :style="{
      flexDirection: direction === 'vertical' || !num ? 'column' : 'row',
    }"
  >
    <AFormItemRest>
      <div
        class="flex items-center"
        v-for="item of num || Math.max(1, modelValue.length)"
        :key="item"
      >
        <AInputNumber
          :class="itemClass(item)"
          :style="[
            gap &&
              item !== num &&
              (direction === 'vertical' || !num
                ? `margin-bottom:${gap}`
                : `margin-right:${gap}`),
          ]"
          :value="modelValue[item - 1]"
          @update:value="onUpdate($event as number, item - 1)"
          v-bind="
            Array.isArray(props.props)
              ? props.props[item - 1] || {}
              : props.props || {}
          "
          @paste="onPaste(item - 1, $event)"
        />

        <i
          class="i-ant-design:close-outlined ml-2 cursor-pointer text-red"
          v-if="!num && item < modelValue.length && modelValue.length > 1"
          @click="decrement(item - 1)"
        />

        <i
          class="i-ant-design:plus-outlined ml-2 cursor-pointer"
          v-if="!num && item === Math.max(1, modelValue.length)"
          @click="increment"
        />
      </div>
    </AFormItemRest>
  </AInputGroup>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { is } from 'ramda'

const props = withDefaults(
  defineProps<{
    modelValue?: (number | null)[]
    /** 输入框数量，未提供时可以手动增减 */
    num?: number
    /**
     * 排列方式，未提供 num 时仅支持 'vertical'
     * @default 'horizontal'
     */
    direction?: 'horizontal' | 'vertical'
    /** 输入框间隔，方向跟随 direction */
    gap?: string
    /** AInputNumber props，为对象时应用到所有输入框，为数组时按下标对应 */
    props?: Recordable[] | Recordable
    /** AInputNumber event，为对象时应用到所有输入框，为数组时按下标对应 */
    events?: Recordable<Fn>[] | Recordable<Fn>
  }>(),
  {
    direction: 'horizontal',
    modelValue: () => [],
  },
)

const emits = defineEmits<{
  (e: 'update:modelValue', val: (number | null)[] | undefined): void
}>()

function itemClass(index: number) {
  if (props.direction === 'horizontal' && !props.gap) {
    if (index === 1) return 'first-vector'
    else if (index === props.num) return 'last-vector'
    return 'middle-vector'
  }
}

function onUpdate(value: number, index: number) {
  const arr = [...props.modelValue]
  if (props.num && arr.length < props.num) {
    for (let i = arr.length; i < props.num; i++) {
      arr.push(null)
    }
  }
  arr[index] = value
  if (arr.every(item => !is(Number, item))) {
    emits('update:modelValue', undefined)
  } else {
    emits('update:modelValue', arr)
  }
}

function decrement(index: number) {
  const copy = [...props.modelValue]
  copy.splice(index, 1)
  emits('update:modelValue', copy)
}

function increment() {
  const copied = [...props.modelValue, null]
  if (copied.length === 1) {
    copied.push(null)
  }
  emits('update:modelValue', copied)
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
    for (let i = 0; i < Math.min(props.num || Infinity, values.length); i++) {
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
