<script setup>
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import Prism from 'prismjs'
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn'
import { ref } from 'vue'

VMdPreview.use(vuepressTheme, {
  Prism,
})

VMdPreview.use(createTodoListPlugin())
VMdPreview.use(createCopyCodePlugin())
VMdPreview.use(createKatexPlugin())

const root = ref(null)

defineProps({
  value: {
    type: String,
    default: '',
  },
})

defineExpose({
  root,
})
</script>

<template>
  <v-md-preview ref="root" :text="value" />
</template>
