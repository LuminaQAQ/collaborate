<script setup>
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import Prism from 'prismjs'
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn'
import { reactive, ref } from 'vue'

VMdEditor.use(vuepressTheme, {
  Prism,
})

VMdEditor.use(createTodoListPlugin())
VMdEditor.use(createCopyCodePlugin())
VMdEditor.use(createKatexPlugin())

const root = ref(null)

const { modelValue } = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '输入内容...',
  },
  height: {
    type: String,
    default: '400px',
  },
})

const state = reactive({
  markdown: '',
})

state.markdown = modelValue
const emits = defineEmits(['update'])

const handleChange = (value) => {
  emits('update', value)
}

const handleReset = () => {
  state.markdown = ''
}

defineExpose({
  root,
  handleReset,
})
</script>

<template>
  <VMdEditor
    ref="root"
    v-model="state.markdown"
    @change="handleChange"
    left-toolbar="undo redo | bold italic strikethrough code quote link image"
    right-toolbar=""
    :placeholder="placeholder"
    :default-show-toc="false"
    :height="height"
  />
</template>

<style>
.v-md-editor {
  margin-top: none;
}
</style>
