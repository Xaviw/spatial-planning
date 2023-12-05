<template>
  <div class="relative h-full min-w-400 flex">
    <Loading absolute :loading="loading" />

    <div class="sidebar">
      <div class="header">
        <i class="i-ant-design:pic-left-outlined mr-2" />
        左栏
      </div>

      <div class="flex-1 overflow-auto">
        <DraggableList
          v-model="leftList"
          group="sider"
          id="left"
          enableContextMenu
          @edit="onEdit"
          :selectedId="selectedItem?.id"
          @mutative="onMutative"
          :filterMenu="selectedMenu"
        />
      </div>
    </div>

    <div class="sidebar">
      <div class="header">
        <i class="i-ant-design:pic-right-outlined mr-2" />
        右栏
      </div>

      <div class="flex-1 overflow-auto">
        <DraggableList
          id="right"
          v-model="rightList"
          group="sider"
          enableContextMenu
          @edit="onEdit"
          :selectedId="selectedItem?.id"
          @mutative="onMutative"
          :filterMenu="selectedMenu"
        />
      </div>
    </div>

    <MaterialBar :inModal="false" :selectedMenu="selectedMenu" />

    <div class="min-w-100 flex flex-1 flex-col bg-white p-4">
      <div class="mb-2 flex">
        <AButton type="primary" @click="onSubmit">提交</AButton>
      </div>

      <AAlert showIcon>
        <template #message>
          <div>拖拽“左栏”、“右栏”中的组件移动位置；</div>
          <div>右击“左栏”、“右栏”中的组件进行编辑；</div>
          <div>拖拽“物料栏”中的组件到“左栏”、“右栏”中进行新增；</div>
          <div>
            拖拽“左栏”、“右栏”中的组件到“删除/暂存栏”中进行删除或暂存（暂存便于大范围移动组件）；
          </div>
        </template>
      </AAlert>

      <div
        class="flex items-center border-0 border-b-1px border-gray-3 border-solid py-2"
      >
        <span>菜单筛选：</span>
        <ATreeSelect
          :fieldNames="{ label: 'name', value: 'id' }"
          :filterTreeNode="onMenuFilter"
          placeholder="选择或搜索菜单进行筛选"
          v-model:searchValue="menuSearchValue"
          v-model:value="selectedMenu"
          treedefaultexpandall
          showsearch
          allowclear
          :treeData="menuData"
          @dropdownVisibleChange="onMenuDropdown"
          class="flex-1"
        />
      </div>

      <template v-if="selectedItem">
        <div class="flex-1 overflow-auto">
          <BaseForm ref="baseFormEl" />

          <component
            :is="componentForms[selectedItem.type]"
            :key="selectedItem.id"
            ref="componentFormEl"
            v-bind="selectedItem.props"
          />
        </div>

        <div class="flex">
          <AButton class="flex-1" type="primary" @click="onConfirm">
            确认
          </AButton>
          <AButton class="mx-4 flex-1" @click="onReset">重置</AButton>
          <AButton class="flex-1" danger @click="onCancel">取消</AButton>
        </div>
      </template>

      <AEmpty
        v-else
        description="请右击“左栏”、“右栏”中的组件，选择“编辑”"
        class="h-full flex flex-col items-center justify-center"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getSider } from '@sp/shared/apis'
import { Loading, componentForms } from '@sp/shared/components'
import {
  DraggableList,
  MaterialBar,
  BaseForm,
} from '@sp/shared/helper/siderHelper'
import { useMutative, useMenuTree } from '@sp/shared/hooks'
import { useRequest } from 'alova'
import { apply, create } from 'mutative'
import type { SiderChangeParams, SiderItem } from '#/request'

const baseFormEl = ref<InstanceType<typeof BaseForm> | null>(null)
const componentFormEl = ref<InstanceType<typeof BaseForm> | null>(null)

const {
  data: leftList,
  loading: leftLoading,
  onSuccess: onLeftSuccess,
} = useRequest(() => getSider({ position: 'left', filter: false }), {
  initialData: [],
})

const {
  data: rightList,
  loading: rightLoading,
  onSuccess: onRightSuccess,
} = useRequest(() => getSider({ position: 'right', filter: false }), {
  initialData: [],
})

const originalList: SiderItem[] = []
const { update, patches } = useMutative([] as SiderItem[])

onLeftSuccess(({ data }) => {
  originalList.unshift(...data)
  update(state => {
    state.unshift(...data)
  })
})

onRightSuccess(({ data }) => {
  originalList.push(...data)
  update(state => {
    state.push(...data)
  })
})

const loading = computed(() => leftLoading.value || rightLoading.value)

const selectedItem = ref<SiderItem>()

const selectedMenu = ref<string>()
const { menuData, menuSearchValue, onMenuDropdown, onMenuFilter } =
  useMenuTree()

function onEdit(item: SiderItem) {
  selectedItem.value = item
  nextTick(() => {
    if (!baseFormEl.value || !componentFormEl.value) {
      throw new Error('表单渲染失败！')
    }

    const { initialModel: baseInitModel } = baseFormEl.value
    const { initialModel: componentInitModel } = componentFormEl.value

    // 合并默认值，确保非必填属性也有值
    baseFormEl.value!.formModel = { ...baseInitModel, ...item }
    componentFormEl.value!.formModel = {
      ...componentInitModel,
      ...item.props,
    }
  })
}

async function onConfirm() {
  await baseFormEl.value?.validate()
  await componentFormEl.value?.validate()

  const data = {
    ...baseFormEl.value!.formModel,
    props: componentFormEl.value!.formModel,
  } as SiderItem
  console.log('data', data)

  let index = leftList.value.findIndex(
    item => item.id === selectedItem.value!.id,
  )
  if (index >= 0) {
    leftList.value[index] = data
    update(state => {
      state[index] = data
    })
  } else {
    index = rightList.value.findIndex(
      item => item.id === selectedItem.value!.id,
    )
    if (index < 0) {
      throw new Error('编辑的组件不存在！')
    }
    rightList.value[index] = data
    update(state => {
      state[index + leftList.value.length] = data
    })
  }

  onCancel()
}

function onSubmit() {
  const [_state, simplePatches] = create(
    originalList,
    state => {
      apply(state, patches.value.slice(2))
    },
    { enablePatches: true },
  )
  console.log('simplePatches: ', simplePatches)
}

function onReset() {
  baseFormEl.value?.resetFields()
  componentFormEl.value?.resetFields()
}

function onCancel() {
  selectedItem.value = undefined
}

function onMutative(e: SiderChangeParams) {
  const leftLength = leftList.value.length
  if (e.name === 'add') {
    update(state => {
      const index = e.to === 'left' ? e.newIndex! : leftLength + e.newIndex!
      state.splice(index, 0, e.data as SiderItem)
    })
  } else if (e.name === 'remove') {
    update(state => {
      state.splice(e.oldIndex!, 1)
    })
  } else {
    const oldIndex = e.from === 'right' ? e.oldIndex! + leftLength : e.oldIndex!
    const newIndex = e.to === 'right' ? e.newIndex! + leftLength : e.newIndex!
    update(state => {
      state.splice(oldIndex, 1)
      state.splice(newIndex, 0, e.data as SiderItem)
    })
  }
}
</script>

<style>
.sidebar {
  @apply mr-2 w-100 flex flex-col bg-[#001231] text-white;
}
.header {
  @apply border-0 border-b-1 border-white border-solid px-4 py-2 text-lg font-600 text-white flex items-center;
}

.editor-block {
  @apply max-w-100 flex items-center border border-[#d9d9d9] border-dashed p-2 pb-0;
}

.editor-btn {
  @apply flex items-center justify-center border border-[#d9d9d9] rounded border-solid p-2 cursor-pointer;
}

:fullscreen {
  background-color: #fff;
}
</style>
