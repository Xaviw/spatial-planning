<template>
  <div class="relative h-full flex">
    <Loading :loading="loading" absolute />

    <div class="mr-2 w-80 bg-white p-4">
      <AAlert showIcon>
        <template #message>
          <div>点击菜单项进入编辑</div>
          <div>支持拖拽排序</div>
        </template>
      </AAlert>
      <ATree
        showicon
        defaultexpandall
        draggable
        showline
        autoexpandparent
        :selectable="false"
        :treeData="treeData"
        :selectedKeys="selectedKeys"
      >
        <template #title="{ label }">
          <div class="tree-item flex items-center">
            <span class="flex-1 leading-32px">{{ label }}</span>
            <AButton type="link" class="ml-2">新增</AButton>
            <AButton type="link" danger>删除</AButton>
          </div>
        </template>
      </ATree>
    </div>
    <div class="flex flex-1 justify-center bg-white p-4">
      <div class="max-w-130 w-full">
        <AForm disabled :labelCol="{ style: { width: '100px' } }">
          <AFormItem label="父级菜单" v-bind="validateInfos.parent">
            <AInput :value="form.parent" disabled />
          </AFormItem>
          <AFormItem label="名称" v-bind="validateInfos.name">
            <AInput v-model:value="form.name" />
          </AFormItem>
          <AFormItem label="状态" v-bind="validateInfos.enabled">
            <ASwitch
              v-model:checked="form.enabled"
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
          </AFormItem>
        </AForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from '@alova/scene-vue'
import { getMenu, setMenu } from '@sp/shared/apis'
import { Loading } from '@sp/shared/components'
import { useRequest } from 'alova'
import { Form } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'

const { data, loading } = useRequest(getMenu, { initialData: [] })

const treeData = computed(() =>
  data.value.map(item => ({ ...item, class: 'w-full' })),
)

const selectedKeys = ref<string[]>([])

const { form } = useForm<Recordable>(formData => setMenu(formData), {
  initialForm: {},
})

const rules = reactive<Record<string, Rule[]>>({
  parent: [{ required: true }],
  name: [{ required: true }],
})

const { validateInfos } = Form.useForm(form, rules)
</script>

<style scoped>
:deep(.ant-tree-list-holder-inner) {
  align-items: stretch;
}
:deep(.ant-tree-switcher) {
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(.ant-tree-node-content-wrapper) {
  flex: 1;
}
.tree-item > button {
  display: none;
}
.tree-item:hover > button {
  display: block;
}
</style>
