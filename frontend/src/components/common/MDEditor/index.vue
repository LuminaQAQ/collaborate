<template>
  <el-scrollbar>
    <div id="editorRef" class="editor" ref="editorRef"></div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { CollabManager } from './utils/CollabManager'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'
import { collab, collabServiceCtx } from '@milkdown/plugin-collab'
import { Crepe } from '@milkdown/crepe'

import {
  configureLinkTooltip,
  linkTooltipPlugin,
  linkTooltipAPI,
  linkTooltipState,
} from '@milkdown/kit/component/link-tooltip'
import { linkSchema } from '@milkdown/kit/preset/commonmark'
import { editorViewCtx } from '@milkdown/kit/core'

import '@milkdown/crepe/theme/common/style.css'
import '@milkdown/crepe/theme/frame.css'
import './style/style.css'

import BlockEditConfigs from './configs/BlockEditConfigs'

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
let editor: Crepe = null
let collabManager = null

const controller = new AbortController()

const methods = {
  handleUpdate: (markdown) => {
    emits('update', markdown)
  },
  handleSave: () => {
    emits('save', editor.getMarkdown())
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
    .use(linkTooltipPlugin)
    .use(commonmark)
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
}

.el-scrollbar {
  overflow-x: hidden;
}

:deep(.el-scrollbar__view) {
  height: calc(100% - 3.5rem);
}
</style>
