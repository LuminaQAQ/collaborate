<template>
  <div ref="editorRoot"></div>
  <!-- <Milkdown ref="editorRoot" /> -->
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core'
import { collab, CollabService, collabServiceCtx } from '@milkdown/plugin-collab'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { nord } from '@milkdown/theme-nord'
import { WebsocketProvider } from 'y-websocket'
import { Doc } from 'yjs'
import { Milkdown } from '@milkdown/vue'

const markdown = `
# Milkdown Vanilla Collab

> You're scared of a world where you're needed.

---

Now you can play!
`

const randomColor = () => Math.floor(Math.random() * 16777215).toString(16)

const name = ['Alice', 'Bob', 'Charlie', 'David']

const options = name.map((x) => ({
  color: `#${randomColor()}`,
  name: x,
}))

const editorRef = ref(null)
const wsUrl = 'ws://localhost:9000'

class CollabManager {
  private room = 'milkdown'
  private doc!: Doc
  private wsProvider!: WebsocketProvider

  constructor(
    private collabService: CollabService,
    private area: HTMLElement,
    private rndInt = Math.floor(Math.random() * 4),
  ) {}

  flush(template: string) {
    this.doc?.destroy()
    this.wsProvider?.destroy()

    this.doc = new Doc()
    this.wsProvider = new WebsocketProvider(wsUrl, this.room, this.doc, { connect: true })
    this.wsProvider.awareness.setLocalStateField('user', options[this.rndInt])

    this.collabService.bindDoc(this.doc).setAwareness(this.wsProvider.awareness)
    this.wsProvider.once('synced', async (isSynced) => {
      if (isSynced) {
        this.collabService.applyTemplate(template).connect()
      }
    })
  }

  connect() {
    this.wsProvider.connect()
    this.collabService.connect()
  }

  disconnect() {
    this.collabService.disconnect()
    this.wsProvider.disconnect()
  }
}

onMounted(async () => {
  const editor = await Editor.make().config(nord).use(commonmark).use(collab).create()

  const doc = new Doc()
  const wsProvider = new WebsocketProvider('ws://localhost:9000', 'doc', doc)

  editor.action((ctx) => {
    const collabService = ctx.get(collabServiceCtx)

    collabService
      .bindDoc(doc)
      .applyTemplate(markdown, (remoteNode, templateNode) => {
        return true
      })
      .setAwareness(wsProvider.awareness)
      .connect()

    editor.action((ctx) => {
      const collabService = ctx.get(collabServiceCtx)
      const collabManager = new CollabManager(collabService, editorRef.value)
      collabManager.flush(markdown)
    })
  })
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
