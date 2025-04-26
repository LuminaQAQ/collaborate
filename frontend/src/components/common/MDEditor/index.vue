<template>
  <div id="editorRef" ref="editorRef"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { CollabManager } from './utils/CollabManager'
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'
import { useDocStore } from '@/stores/doc'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { collab, collabServiceCtx } from '@milkdown/plugin-collab'
import { Crepe } from '@milkdown/crepe'

const emits = defineEmits(['update'])
const props = defineProps({
  room: {
    type: String,
    required: true,
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
}

onMounted(async () => {
  const docStore = useDocStore()
  editor = new Crepe({
    root: editorRef.value,
    defaultValue: docStore.currentDocState.content,
  })

  editor.editor
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
    collabManager.flush(docStore.currentDocState.content)
  })

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()

        docStore.currentDocState.content = editor.getMarkdown()
      }
    },
    { signal: controller.signal },
  )
})

onBeforeUnmount(() => {
  if (collabManager) collabManager.disconnect()
  controller.abort()
})
</script>

<style scoped>
.editorRoot {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 4px;
}
</style>
