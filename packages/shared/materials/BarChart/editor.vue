<template>
  <div>
    <AForm
      v-for="(item, index) of model"
      :model="item"
      :key="index"
      class="mb-2"
      :ref="el => (refs[index] = el)"
    >
      <div class="editor-block">
        <div class="mr-4 flex-1">
          <AFormItem label="名称" name="name">
            <AInput v-model:value="item.name" />
          </AFormItem>
          <AFormItem label="柱条宽度" help="默认自适应宽度" name="barWidth">
            <CssSizeInput v-model="item.barWidth" />
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
            v-if="index === model.length - 1"
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
import { CssSizeInput } from '@sp/shared/components'
import { isFunction } from '@sp/shared/utils'
import DataEditor from './dataEditor.vue'
import type { BarChartItem } from '#/materials'

withDefaults(
  defineProps<{
    xAxis?: string[]
  }>(),
  { xAxis: () => [] },
)

const model = defineModel<BarChartItem[]>({ default: [] })

const refs = ref<any[]>([])

const dataValidator = (_rule, value: number[]) => {
  if (value?.some((item: number) => !item && item !== 0)) {
    return Promise.reject()
  }
  return Promise.resolve()
}

function onAdd() {
  model.value.push({} as BarChartItem)
}

function onRemove(index: number) {
  model.value.splice(index, 1)
}

defineExpose({
  validate() {
    const events: Promise<any>[] = []
    for (const instance of refs.value) {
      if (isFunction(instance?.validate)) {
        events.push(instance.validate())
      }
    }
    return Promise.all(events)
  },
})
</script>
