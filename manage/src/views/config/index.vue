<template>
  <div class="h-full flex flex-col bg-white">
    <AForm
      :labelCol="{ style: { width: '216px' } }"
      class="relative grid grid-cols-3 flex-1 overflow-auto"
    >
      <Loading absolute :loading="loading" />

      <ADivider orientation="left" class="col-span-3">地图类型控件</ADivider>

      <AFormItem
        label="是否显示地图类型控件"
        help="可以切换默认图层、卫星图层，以及叠加路网、交通等"
      >
        <ASwitch v-model:checked="formModel.mapType" />
      </AFormItem>

      <AFormItem label="地图类型位置" class="col-span-2">
        <Vector
          v-model="formModel.mapTypePosition"
          gap="8px"
          :num="4"
          :props="[
            {
              addonBefore: '距顶部',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
            {
              addonBefore: '距左侧',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
            {
              addonBefore: '距底部',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
            {
              addonBefore: '距右侧',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
          ]"
        />
      </AFormItem>

      <AFormItem label="图层类型" v-bind="validateInfos.defaultMapType">
        <ARadioGroup
          :options="mapDefaultTypeOptions"
          v-model:value="formModel.defaultMapType"
        />
      </AFormItem>

      <AFormItem label="叠加交通图层">
        <ASwitch v-model:checked="formModel.showTraffic" />
      </AFormItem>

      <AFormItem label="叠加路网图层">
        <ASwitch v-model:checked="formModel.showRoad" />
      </AFormItem>

      <ADivider orientation="left" class="col-span-3">比例尺控件</ADivider>

      <AFormItem label="是否显示比例尺控件">
        <ASwitch v-model:checked="formModel.scalebar" />
      </AFormItem>

      <AFormItem label="比例尺控件位置" class="col-span-2">
        <Vector
          v-model="formModel.scalebarPosition"
          gap="8px"
          :num="4"
          :props="[
            {
              addonBefore: '距顶部',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
            {
              addonBefore: '距左侧',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
            {
              addonBefore: '距底部',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
            {
              addonBefore: '距右侧',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
          ]"
        />
      </AFormItem>

      <ADivider orientation="left" class="col-span-3">缩放控件</ADivider>

      <AFormItem label="是否显示缩放控件">
        <ASwitch v-model:checked="formModel.toolbar" />
      </AFormItem>

      <AFormItem label="缩放控件位置" class="col-span-2">
        <Vector
          v-model="formModel.toolbarPosition"
          gap="8px"
          :num="4"
          :props="[
            {
              addonBefore: '距顶部',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
            {
              addonBefore: '距左侧',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
            {
              addonBefore: '距底部',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
            {
              addonBefore: '距右侧',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
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

      <AFormItem label="视角控件位置" class="col-span-2">
        <Vector
          v-model="formModel.controlbarPosition"
          gap="8px"
          :num="4"
          :props="[
            {
              addonBefore: '距顶部',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
            {
              addonBefore: '距左侧',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
            {
              addonBefore: '距底部',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
            {
              addonBefore: '距右侧',
              addonAfter: '像素',
              min: 0,
              class: 'w-44',
            },
          ]"
        />
      </AFormItem>

      <ADivider orientation="left" class="col-span-3">地图参数</ADivider>

      <AFormItem
        label="地图样式"
        v-bind="validateInfos.mapStyle"
        class="col-span-3"
      >
        <div class="flex items-center">
          <ARadioGroup
            :options="mapStyleOptions"
            v-model:value="formModel.mapStyle"
          />

          <div ref="container" class="h-30 flex-1"></div>
        </div>
      </AFormItem>

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

      <AFormItem label="视图模式" v-bind="validateInfos.viewMode">
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
          :num="2"
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
    </AForm>

    <div class="flex items-center justify-center p-4 shadow-dark shadow-lg">
      <AButton @click="resetFields">重置</AButton>
      <AButton type="primary" class="ml-4" @click="onSubmit">提交</AButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getConfig, setConfig } from '@sp/shared/apis'
import { Loading, Vector } from '@sp/shared/components'
import { useMap } from '@sp/shared/hooks'
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
  wallColor: '#989898',
  roofColor: '#D6D6D6',
  skyColor: '#CCE8FF',
  mapType: false,
  defaultMapType: 0,
  showTraffic: false,
  showRoad: false,
  mapStyle: 'blue',
  mapTypePosition: [null, 5, null, 30],
  scalebarPosition: [null, 5, null, 5],
  toolbarPosition: [null, null, 5, 5],
  controlbarPosition: [37, null, 5, null],
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
  defaultMapType: [{ required: true, message: '请选择默认图层类型！' }],
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

const mapDefaultTypeOptions = [
  { label: '默认底图', value: 0 },
  { label: '卫星底图', value: 1 },
]

const mapStyleOptions = [
  { label: '标准', value: 'normal' },
  { label: '幻影黑', value: 'dark' },
  { label: '月光银', value: 'light' },
  { label: '远山黛', value: 'whitesmoke' },
  { label: '草色青', value: 'fresh' },
  { label: '雅士灰', value: 'grey' },
  { label: '涂鸦', value: 'graffiti' },
  { label: '马卡龙', value: 'macaron' },
  { label: '靛青蓝', value: 'blue' },
  { label: '极夜蓝', value: 'darkblue' },
  { label: '酱籽', value: 'wine' },
]

const container = ref<HTMLDivElement | null>(null)
const { map } = useMap(container)

watch(
  [() => formModel.value.mapStyle, map],
  ([style]) => {
    if (map.value && style) {
      map.value.setMapStyle(`amap://styles/${formModel.value.mapStyle}`)
    }
  },
  {
    immediate: true,
  },
)
</script>
