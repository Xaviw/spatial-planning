<template>
  <Codemirror
    v-model="model"
    indentWithTab
    :tabSize="2"
    :extensions="extensions"
  />
</template>

<script setup lang="ts">
import { html } from '@codemirror/lang-html'
import { json } from '@codemirror/lang-json'
import { Codemirror } from 'vue-codemirror'

const props = defineProps<{ type: 'json' | 'html' }>()

const model = defineModel<string>()

const extensions = computed(() => {
  if (props.type === 'json') {
    return [json()]
  } else {
    return [html()]
  }
})
</script>
