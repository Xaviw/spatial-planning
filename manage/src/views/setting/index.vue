<template>
  <AForm
    :labelCol="{ style: { width: '216px' } }"
    class="relative grid grid-cols-3 bg-white p-4"
  >
    <Loading absolute :loading="loading" />

    <ADivider orientation="left" class="col-span-3">比例尺控件</ADivider>

    <AFormItem label="是否显示比例尺控件">
      <ASwitch v-model:checked="formModel.scalebar" />
    </AFormItem>

    <AFormItem label="比例尺控件位置">
      <Vector
        v-model="formModel.scalebarPosition"
        direction="vertical"
        gap="8px"
        :props="[
          { addonBefore: '距顶部', addonAfter: '像素', min: 0, class: 'w-50' },
          { addonBefore: '距左侧', addonAfter: '像素', min: 0, class: 'w-50' },
          { addonBefore: '距下部', addonAfter: '像素', min: 0, class: 'w-50' },
          { addonBefore: '距右侧', addonAfter: '像素', min: 0, class: 'w-50' },
        ]"
      />
    </AFormItem>

    <ADivider orientation="left" class="col-span-3">工具条控件</ADivider>

    <AFormItem
      label="是否显示工具条控件"
      help="支持方向导航、位置定位、视野级别缩放、视野级别选择等操作"
    >
      <ASwitch v-model:checked="formModel.toolbar" />
    </AFormItem>

    <AFormItem label="工具条控件位置">
      <Vector
        v-model="formModel.toolbarPosition"
        direction="vertical"
        gap="8px"
        :props="[
          { addonBefore: '距顶部', addonAfter: '像素', min: 0, class: 'w-50' },
          { addonBefore: '距左侧', addonAfter: '像素', min: 0, class: 'w-50' },
          { addonBefore: '距下部', addonAfter: '像素', min: 0, class: 'w-50' },
          { addonBefore: '距右侧', addonAfter: '像素', min: 0, class: 'w-50' },
        ]"
      />
    </AFormItem>

    <ADivider orientation="left" class="col-span-3">视角控件</ADivider>

    <AFormItem
      label="是否显示视角控件"
      help="组合了旋转、倾斜、复位在内的地图控件"
    >
      <ASwitch v-model:checked="formModel.controlbar" />
    </AFormItem>

    <AFormItem label="视角控件位置">
      <Vector
        v-model="formModel.controlbarPosition"
        direction="vertical"
        gap="8px"
        :props="[
          { addonBefore: '距顶部', addonAfter: '像素', min: 0, class: 'w-50' },
          { addonBefore: '距左侧', addonAfter: '像素', min: 0, class: 'w-50' },
          { addonBefore: '距下部', addonAfter: '像素', min: 0, class: 'w-50' },
          { addonBefore: '距右侧', addonAfter: '像素', min: 0, class: 'w-50' },
        ]"
      />
    </AFormItem>

    <ADivider orientation="left" class="col-span-3">地图参数</ADivider>

    <AFormItem label="显示元素" v-bind="validateInfos.features">
      <ACheckboxGroup
        :options="featuresOptions"
        v-model:value="formModel.features"
      />
    </AFormItem>

    <AFormItem label="是否展示文字和POI信息">
      <ASwitch v-model:checked="formModel.showLabel" />
    </AFormItem>

    <AFormItem label="是否开启热点和标注的hover效果">
      <ASwitch v-model:checked="formModel.isHotspot" />
    </AFormItem>

    <AFormItem
      label="视图模式"
      help="3D模式下可以按住鼠标右键拖动调整俯仰角度"
      v-bind="validateInfos.viewMode"
    >
      <ARadioGroup
        :options="viewModeOptions"
        v-model:value="formModel.viewMode"
      />
    </AFormItem>

    <AFormItem label="是否可旋转">
      <ASwitch
        v-model:checked="formModel.rotateEnable"
        extra="在地图中按住鼠标右键左右拖动"
      />
    </AFormItem>

    <AFormItem label="初始旋转角度">
      <AInputNumber v-model:value="formModel.rotation" :min="0" :max="360" />
    </AFormItem>

    <AFormItem
      label="是否允许设置俯仰角度"
      help="仅3D模式下有效"
      extra="在地图中按住鼠标右键上下拖动"
    >
      <ASwitch v-model:checked="formModel.pitchEnable" />
    </AFormItem>

    <AFormItem label="初始俯仰角度" help="仅3D模式下有效">
      <AInputNumber v-model:value="formModel.pitch" :min="0" />
    </AFormItem>

    <AFormItem label="是否可以缩放">
      <ASwitch v-model:checked="formModel.zoomEnable" />
    </AFormItem>

    <AFormItem label="是否可以鼠标滚轮缩放">
      <ASwitch v-model:checked="formModel.scrollWheel" />
    </AFormItem>

    <AFormItem label="缩放范围" v-bind="validateInfos.zooms">
      <Vector
        v-model="formModel.zooms"
        :props="[
          { addonAfter: '-', min: 2, max: 26, class: 'w-30' },
          { min: 2, max: 26, class: 'w-26' },
        ]"
      />
    </AFormItem>

    <AFormItem label="是否可以拖拽移动">
      <ASwitch v-model:checked="formModel.dragEnable" />
    </AFormItem>

    <AFormItem label="是否使用缓动效果">
      <ASwitch v-model:checked="formModel.jogEnable" />
    </AFormItem>

    <AFormItem
      label="是否可以键盘控制"
      help='方向键控制地图平移，"+" 和 "-" 可以控制地图的缩放, Ctrl+"→"顺时针旋转，Ctrl+"←"逆时针旋转'
    >
      <ASwitch v-model:checked="formModel.keyboardEnable" />
    </AFormItem>

    <AFormItem label="是否可以鼠标双击放大">
      <ASwitch v-model:checked="formModel.doubleClickZoom" />
    </AFormItem>

    <AFormItem label="是否展示3D楼块">
      <ASwitch v-model:checked="formModel.showBuildingBlock" />
    </AFormItem>

    <AFormItem label="楼块侧面颜色">
      <ColorPicker v-model:pure-color="formModel.wallColor" />
    </AFormItem>

    <AFormItem label="楼块顶面颜色">
      <ColorPicker v-model:pure-color="formModel.roofColor" />
    </AFormItem>

    <AFormItem label="天空颜色" help="3D模式下带有俯仰角时会显示">
      <ColorPicker v-model:pure-color="formModel.skyColor" />
    </AFormItem>

    <div class="col-span-3 flex items-center justify-center">
      <AButton @click="resetFields">重置</AButton>
      <AButton type="primary" class="ml-4" @click="onSubmit">提交</AButton>
    </div>
  </AForm>
</template>

<script setup lang="ts">
import 'vue3-colorpicker/style.css'
import { getConfig, setConfig } from '@sp/shared/apis'
import { Loading, Vector } from '@sp/shared/components'
import { useRequest } from 'alova'
import { Form, message } from 'ant-design-vue'
import { Rule } from 'ant-design-vue/es/form'
import { ColorPicker } from 'vue3-colorpicker'
import type { Config } from '#/business'

const { loading, onSuccess } = useRequest(getConfig)

const defaultConfig = (): Config => ({
  viewMode: '2D',
  rotation: 0,
  pitch: 0,
  features: ['bg', 'point', 'road', 'building'],
  zooms: [2, 20],
  dragEnable: true,
  zoomEnable: true,
  jogEnable: true,
  pitchEnable: true,
  rotateEnable: true,
  keyboardEnable: true,
  doubleClickZoom: true,
  scrollWheel: true,
  showLabel: true,
  isHotspot: true,
  showBuildingBlock: true,
  scalebar: false,
  toolbar: false,
  controlbar: false,
})

onSuccess(({ data }) => {
  formModel.value = Object.assign(defaultConfig(), data)
})

const formModel = ref<Config>(defaultConfig())

const rules = ref<Record<string, Rule[]>>({
  viewMode: [
    {
      required: true,
      message: '请选择视图模式！',
    },
  ],
  features: [{ required: true, message: '请选择显示元素！' }],
  zooms: [{ required: true, message: '请输入缩放范围！' }],
})

const { validateInfos, resetFields, validate } = Form.useForm(formModel, rules)

async function onSubmit() {
  await validate()
  loading.value = true
  setConfig(formModel.value)
    .send()
    .then(() => {
      message.success('已提交！')
    })
    .finally(() => {
      loading.value = false
    })
}

const viewModeOptions = [
  { label: '2D', value: '2D' },
  { label: '3D', value: '3D' },
]

const featuresOptions = [
  { label: '地图背景', value: 'bg' },
  { label: 'POI点', value: 'point' },
  { label: '道路', value: 'road' },
  { label: '建筑物', value: 'building' },
]
</script>
