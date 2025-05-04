<template>
  <ElScrollbar>
    <div id="editorRef" class="editor" ref="editorRef"></div>
  </ElScrollbar>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'

import { CollabManager } from './utils/CollabManager'
import { collab, collabServiceCtx } from '@milkdown/plugin-collab'

import {
  linkTooltipPlugin,
  linkTooltipAPI,
  linkTooltipState,
  linkTooltipConfig,
} from '@milkdown/kit/component/link-tooltip'
import { linkSchema } from '@milkdown/kit/preset/commonmark'
import { editorViewCtx } from '@milkdown/kit/core'

import '@milkdown/crepe/theme/common/style.css'
import '@milkdown/crepe/theme/frame.css'
import '@milkdown-lab/plugin-menu/style.css'

import './style/style.css'
import './style/table.css'

import BlockEditConfigs from './configs/BlockEditConfigs'

import { menu } from '@milkdown-lab/plugin-menu'
import { menuConfigs } from './configs/menuConfigs'

import { Crepe } from '@milkdown/crepe'
import { ElScrollbar } from 'element-plus'

const emits = defineEmits(['update', 'save'])
const props = defineProps({
  room: {
    type: String,
    required: true,
  },
  defaultValue: {
    type: String,
    default: '',
  },
})

const editorRef = ref(null)
const editorIsInit = ref(false)
/**
 * @type {Crepe}
 */
let editor = null
let collabManager = null

const controller = new AbortController()

const methods = {
  handleUpdate: (markdown) => {
    emits('update', markdown)
  },
  handleSave: (isAutoSava = false) => {
    emits('save', editor.getMarkdown(), isAutoSava)
  },
  handleInsertLink: (ctx) => {
    const view = ctx.get(editorViewCtx)
    const { selection, doc } = view.state

    if (selection.empty) return

    if (ctx.get(linkTooltipState.key).mode === 'edit') return

    const has = doc.rangeHasMark(selection.from, selection.to, linkSchema.type(ctx))
    if (has) return

    ctx.get(linkTooltipAPI.key).addLink(selection.from, selection.to)
  },
}

onMounted(async () => {
  editor = new Crepe({
    root: editorRef.value,
    defaultValue: props.defaultValue,
    featureConfigs: {
      placeholder: {
        text: '输入 / 唤起更多',
      },
      'block-edit': BlockEditConfigs,
    },
  })

  editor.editor
    .config(linkTooltipConfig)
    .config(menuConfigs)
    .use(linkTooltipPlugin)
    .use(collab)
    .config((ctx) => {
      const listener = ctx.get(listenerCtx)

      listener.markdownUpdated((ctx, markdown, prevMarkdown) => {
        if (markdown !== prevMarkdown) {
          methods.handleUpdate(markdown)
        }
      })
    })
    .use(listener)
    .use(menu)

  await editor.create()

  editor.editor.action((ctx) => {
    const collabService = ctx.get(collabServiceCtx)
    collabManager = new CollabManager(collabService, props.room)
    collabManager.flush(props.defaultValue)
  })

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()

        methods.handleSave()
      } else if (e.ctrlKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()

        editor.editor.action(methods.handleInsertLink)
      }
    },
    { signal: controller.signal },
  )

  editorIsInit.value = true
})

onBeforeUnmount(() => {
  if (collabManager) collabManager.disconnect()
  if (editor) editor.destroy()
  controller.abort()
})
</script>

<style scoped>
.editor {
  height: 100%;
  overflow-y: auto;
}
</style>
