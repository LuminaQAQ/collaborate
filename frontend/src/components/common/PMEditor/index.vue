<template>
  <div id="editorRef" ref="editorRef"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { createEditor } from './utils/CollabManager'
import { useUserStore } from '@/stores/user'

const editorRef = ref(null)
const userStore = useUserStore()

onMounted(async () => {
  createEditor(editorRef.value)
  // const editor = await Editor.make()
  //   .config((ctx) => {
  //     ctx.set(rootCtx, editorRef.value)
  //     ctx.set(defaultValueCtx, markdown)
  //   })
  //   .config(nord)
  //   .use(commonmark)
  //   .use(collab)
  //   .create()

  // editor.action((ctx) => {
  //   const collabService = ctx.get(collabServiceCtx)
  //   const collabManager = new CollabManager(collabService, editorRef.value)
  //   collabManager.flush(markdown)
  // })
  // const doc = new Doc()
  // wsProvider = new WebsocketProvider('ws://localhost:9000', 'milkdown', doc)

  // editor.action((ctx) => {
  //   const collabService = ctx.get(collabServiceCtx)
  //   const collabManager = new CollabManager(collabService, editorRef.value)
  //   collabManager.flush(markdown)

  //   // collabService = ctx.get(collabServiceCtx)
  //   // collabService
  //   //   .bindDoc(doc)
  //   //   .applyTemplate(markdown, (remoteNode, templateNode) => {
  //   //     return true
  //   //   })
  //   //   .setAwareness(wsProvider.awareness)
  //   //   .connect()

  //   editor.action((ctx) => {
  //     const collabService = ctx.get(collabServiceCtx)
  //     const collabManager = new CollabManager(collabService, editorRef.value)
  //     collabManager.flush(markdown)
  //   })
  // })
})

onBeforeUnmount(() => {
  // if (wsProvider) wsProvider.disconnect()
  // if (collabService) collabService.disconnect()
})
</script>

<style scoped>
.editorRoot {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 4px;
}
</style>

<!-- <template>
  <div ref="editorRef" id="editor"></div>
</template>

<script setup>
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror'

import { EditorState } from 'prosemirror-state'
import { schema } from './schema/schema'
import { EditorView } from 'prosemirror-view'
import { keymap } from 'prosemirror-keymap'
import { exampleSetup } from 'prosemirror-example-setup'
import './style/style.css'

import { onMounted, ref } from 'vue'
import useSocket from '@/utils/useSocket'
import { io } from 'socket.io-client'
import { useUserStore } from '@/stores/user'

const editorRef = ref(null)
const editor = ref(null)

let ydoc = null
let provider = null

onMounted(() => {
  ydoc = new Y.Doc()

  // const socket = useSocket('/doc')
  // socket.on('connect', () => {
  //   console.log('socket connected')
  // })
  provider = new WebsocketProvider('ws://localhost:9000', 'doc', ydoc, {
    params: { token: useUserStore().user.token },
  })
  // const { socketIo, emit } = useSocket('/doc')
  const type = ydoc.getXmlFragment('prosemirror')
  // provider = useSocket('/doc', ydoc).socketIo

  editor.value = new EditorView(editorRef.value, {
    state: EditorState.create({
      schema,
      plugins: [
        ySyncPlugin(type),
        yCursorPlugin(provider.awareness),
        yUndoPlugin(),
        keymap({
          'Mod-z': undo,
          'Mod-y': redo,
          'Mod-Shift-z': redo,
        }),
      ].concat(exampleSetup({ schema })),
    }),
  })
})
</script>

<style lang="scss" scoped>
#editor {
  height: 100%;
  box-sizing: border-box;
  margin-bottom: 0;
}
</style> -->
