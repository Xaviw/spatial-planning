<template>
  <div class="flex flex-col">
    <AFormItemRest>
      <component
        :is="type === 'string' ? Input : InputNumber"
        v-for="(_item, index) of xAxis || model"
        :key="index"
        v-model:value="model[index]"
        class="mb-2 max-w-80"
      >
        <template #addonBefore v-if="type === 'string'">
          <span class="text-gray">{{ index + 1 }}</span>
        </template>

        <template #addonAfter v-if="type === 'string'">
          <i
            v-if="index === model.length - 1"
            @click="onAdd"
            class="i-ant-design:plus-outlined cursor-pointer"
          />
          <i
            @click="onRemove(index)"
            v-else
            class="i-ant-design:close-outlined cursor-pointer text-red"
          />
        </template>
      </component>
    </AFormItemRest>
  </div>
</template>

<script setup lang="ts">
import { Input, InputNumber } from 'ant-design-vue'

const props = defineProps<{
  xAxis?: string[]
  type: 'string' | 'number'
}>()

const emits = defineEmits<{
  (e: 'remove', index: number): void
  (e: 'add'): void
}>()

const model = defineModel<(string | number)[]>({ default: [] })

function onAdd() {
  model.value.push(props.type === 'string' ? '' : 0)
}

function onRemove(index: number) {
  model.value.splice(index, 1)
}
</script>
