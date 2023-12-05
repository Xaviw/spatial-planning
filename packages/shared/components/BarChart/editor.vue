<template>
  <div>
    <AForm
      v-for="(item, index) of modelValue"
      :model="item"
      :key="index"
      class="mb-2"
      :ref="(el: any) => refs.push(el)"
    >
      <div class="editor-block">
        <div class="mr-4 flex-1">
          <AFormItem
            label="名称"
            name="name"
            :rules="{ required: true, message: '请填写名称！' }"
          >
            <AInput v-model:value="item.name" />
          </AFormItem>
          <AFormItem label="柱条宽度" help="默认自适应宽度" name="barWidth">
            <CssSizeInput v-model:value="item.barWidth" />
          </AFormItem>
          <AFormItem
            label="数据"
            name="data"
            :rules="{
              required: true,
              message: '请将数据补充完整！',
              validator: dataValidator,
            }"
          >
            <DataEditor type="number" v-model="item.data" :xAxis="xAxis" />
          </AFormItem>
        </div>
        <AFormItem>
          <div
            class="editor-btn"
            v-if="index === modelValue.length - 1"
            @click="onAdd"
          >
            <i class="i-ant-design:plus-outlined" />
          </div>
          <div @click="onRemove(index)" v-else class="editor-btn">
            <i class="i-ant-design:close-outlined text-red" />
          </div>
        </AFormItem>
      </div>
    </AForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CssSizeInput from '../CssSizeInput/index.vue'
import DataEditor from './dataEditor.vue'
import type { BarChartItem } from '#/components'

const props = withDefaults(
  defineProps<{
    modelValue?: BarChartItem[]
    xAxis?: string[]
  }>(),
  { modelValue: () => [], xAxis: () => [] },
)

const emits = defineEmits<{
  (e: 'update:modelValue', data: BarChartItem[]): void
}>()

const refs = ref<any[]>([])

const dataValidator = (_rule: any, value: number[]) => {
  console.log('value: ', value)
  if (value?.some((item: number) => !item && item !== 0)) {
    return Promise.reject()
  }
  return Promise.resolve()
}

function onAdd() {
  emits('update:modelValue', [...props.modelValue, {} as BarChartItem])
}

function onRemove(index: number) {
  const clone = [...props.modelValue]
  clone.splice(index, 1)
  emits('update:modelValue', clone)
}

defineExpose({
  validate() {
    const events: Promise<any>[] = []
    for (const instance of refs.value) {
      if (typeof instance.validate === 'function') {
        events.push(instance.validate())
      }
    }
    return Promise.all(events)
  },
})
</script>
