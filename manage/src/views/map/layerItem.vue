<template>
  <tr
    class="border-0 border-b border-gray-3 border-solid"
    :style="[activeLayer === layer.id ? 'background-color: #bae0ff' : '']"
    @click="activeLayer = layer.id"
  >
    <td class="w-30px text-center">
      <template v-if="!visible">
        <ATooltip title="显示">
          <i
            class="i-ant-design:eye-outlined cursor-pointer"
            @click="visible = true"
          />
        </ATooltip>
      </template>
      <template v-else>
        <ATooltip title="隐藏">
          <i
            class="i-ant-design:eye-invisible-outlined cursor-pointer"
            @click="visible = false"
          />
        </ATooltip>
      </template>
    </td>
    <td class="text-center">
      <ATooltip>
        <AInput v-if="editData" v-model:value="editData.name" />
        <template v-else>
          {{ layer.name }}
        </template>
        <template #title>
          <div>创建时间：{{ layer.createTime }}</div>
          <div v-if="layer.updateTime">更新时间：{{ layer.updateTime }}</div>
        </template>
      </ATooltip>
    </td>
    <td class="w-60px text-center">
      <ASwitch
        v-if="editData"
        v-model:checked="editData.asLegend"
        checkedChildren="是"
        unCheckedChildren="否"
      />
      <ASwitch
        v-else
        :checked="layer.asLegend"
        disabled
        checkedChildren="是"
        unCheckedChildren="否"
      />
    </td>
    <td class="w-60px text-center">
      <Upload
        v-if="editData"
        v-model="editData.legendImg"
        :maxCount="1"
        accept="image/*"
        height="40px"
        width="40px"
        :showHelp="false"
        padding="0"
      />
      <AImage
        v-else-if="layer.legendImg"
        :src="layer.legendImg"
        :fallback="failed_img"
        :width="40"
        :height="40"
      />
    </td>
    <td class="w-60px text-center">
      <ASwitch
        v-if="editData"
        v-model:checked="editData.status"
        checkedChildren="启用"
        unCheckedChildren="禁用"
      />
      <ASwitch
        v-else
        :checked="layer.status"
        disabled
        checkedChildren="启用"
        unCheckedChildren="禁用"
      />
    </td>
    <td class="w-80px text-center">
      <template v-if="editData">
        <ATooltip title="保存">
          <AButton type="link" @click="save()">
            <template #icon>
              <i class="i-ant-design:check-circle-outlined" />
            </template>
          </AButton>
        </ATooltip>
        <APopconfirm
          title="是否取消编辑？"
          @confirm="cancel()"
          v-if="removeable"
        >
          <ATooltip title="取消">
            <AButton type="link" danger>
              <template #icon>
                <i class="i-ant-design:close-circle-outlined" />
              </template>
            </AButton>
          </ATooltip>
        </APopconfirm>
      </template>

      <template v-else>
        <ATooltip title="编辑">
          <AButton type="link" @click="edit()">
            <template #icon>
              <i class="i-ant-design:edit-outlined" />
            </template>
          </AButton>
        </ATooltip>
        <APopconfirm
          title="删除后图层中的覆盖物也会一并删除，是否确定？"
          @confirm="remove()"
          v-if="removeable"
        >
          <ATooltip title="删除">
            <AButton type="link" danger>
              <template #icon>
                <i class="i-ant-design:delete-outlined" />
              </template>
            </AButton>
          </ATooltip>
        </APopconfirm>
      </template>
    </td>
  </tr>
  <slot :visible="visible" />
</template>

<script setup lang="ts">
import { Upload } from '@sp/shared/components'
import { useMapStore } from '@sp/shared/helpers/map'
import { failed_img } from '@sp/shared/utils'
import { message } from 'ant-design-vue'
import { clone } from 'ramda'
import type { LayerItem, OverlayType } from '#/overlays'

const props = defineProps<{
  layer: LayerItem<OverlayType>
  removeable?: boolean
}>()

const emits = defineEmits<{
  (e: 'remove', id: string): void
  (e: 'save', newData: Omit<LayerItem<OverlayType>, 'overlays'>): void
}>()

const { activeLayer } = storeToRefs(useMapStore())

const visible = ref(true)
const editData = ref<Omit<LayerItem<OverlayType>, 'overlays'>>()

function edit() {
  const { overlays, ...layer } = props.layer
  editData.value = clone(layer)
}

function cancel() {
  editData.value = undefined
}

function save() {
  if (editData.value?.asLegend && !editData.value.legendImg) {
    message.warn('作为图例时需要上传图例图片！')
    return
  }
  emits('save', editData.value!)
  editData.value = undefined
}

function remove() {
  emits('remove', props.layer.id)
  editData.value = undefined
}
</script>
