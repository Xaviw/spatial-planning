<template>
  <div class="h-full overflow-auto">
    <component
      v-for="item of list"
      :key="item.id"
      :is="components[item.componentType]"
      v-bind="item.componentProps"
      class="mb-2"
    />
  </div>
</template>

<script setup lang="ts">
import components from '@sp/components'
import type { Sider } from '#/client'

const list: Sider[] = [
  {
    id: '1',
    componentType: 'Title',
    componentProps: { title: '大标题' },
    relationMenu: [],
  },
  {
    id: '2',
    componentType: 'SubTitle',
    componentProps: { title: '副标题' },
    relationMenu: [],
  },
  {
    id: '3',
    componentType: 'DataCard',
    componentProps: {
      title: '数据展示',
      content: 123,
      imgSrc:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    relationMenu: [],
  },
  {
    id: '4',
    componentType: 'Description',
    componentProps: {
      data: [
        { label: 'A', value: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' },
        { label: 'B', value: 'BBBBBBBBBBBB' },
        { label: 'C', value: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC', span: 2 },
        { label: 'D', value: 'DDDDD', span: 2 },
      ],
      column: 2,
    },
    relationMenu: [],
  },
  {
    id: '5',
    componentType: 'Table',
    componentProps: {
      data: [
        ['A', 'B', 'C', 'D'],
        ['A1', 'B1', 'C1', 'D1'],
        ['A2', 'B2', 'C2', 'D2'],
        ['A3', 'B3', 'C3', 'D3'],
        ['A4', 'B4', 'C4', 'D4'],
      ],
    },
    relationMenu: [],
  },
  {
    id: '6',
    componentType: 'FileList',
    componentProps: {
      data: [
        {
          title: '图片',
          img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          title: '文档',
          src: '1.doc',
        },
        {
          title: 'pdf',
          src: '2.pdf',
        },
        {
          title: '表格',
          src: '3.xls',
        },
        {
          title: 'ppt',
          src: '4.ppt',
        },
        {
          title: '视频',
          src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
        },
        {
          title: '音频',
          src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
        },
        {
          title: '其他',
          src: '7.x',
        },
      ],
    },
    relationMenu: [],
  },
]
</script>
