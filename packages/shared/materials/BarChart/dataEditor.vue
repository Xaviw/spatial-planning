<template>
  <div class="flex flex-col">
    <AFormItemRest>
      <component
        :is="type === 'string' ? Input : InputNumber"
        v-for="(_item, index) of xAxis || data"
        :key="index"
        v-model:value="data[index]"
        class="mb-2 max-w-80"
      >
        <template #addonBefore v-if="type === 'string'">
          <span class="text-gray">{{ index + 1 }}</span>
        </template>

        <template #addonAfter v-if="type === 'string'">
          <i
            v-if="index === data.length - 1"
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

const data = ref<(string | number)[]>([])

watchEffect(() => {
  if (model.value.length) {
    data.value = model.value
  }
})

function onAdd() {
  data.value.push(props.type === 'string' ? '' : 0)
  emits('add')
}

function onRemove(index: number) {
  data.value.splice(index, 1)
  emits('remove', index)
}
</script>
