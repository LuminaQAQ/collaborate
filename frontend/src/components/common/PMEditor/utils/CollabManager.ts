import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core'
import { collab, CollabService, collabServiceCtx } from '@milkdown/plugin-collab'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { nord } from '@milkdown/theme-nord'
import { WebsocketProvider } from 'y-websocket'
import { Doc } from 'yjs'
import '@milkdown/theme-nord/style.css'
import '../style/style.css'
import { useUserStore } from '@/stores/user'
import { useDocStore } from '@/stores/doc'

let markdown = ``

const randomColor = () => Math.floor(Math.random() * 16777215).toString(16)

const wsUrl = 'ws://localhost:5000'

class CollabManager {
  private room = 'milkdown'
  private doc!: Doc
  private wsProvider!: WebsocketProvider
  private userStore = useUserStore()

  constructor(private collabService: CollabService) {}

  flush(template: string) {
    this.doc?.destroy()
    this.wsProvider?.destroy()

    this.doc = new Doc()
    this.wsProvider = new WebsocketProvider(wsUrl, this.room, this.doc, { connect: true })

    this.wsProvider.awareness.setLocalStateField('user', {
      color: `#${randomColor()}`,
      name: this.userStore.user.userInfo.username,
    })

    this.collabService.bindDoc(this.doc).setAwareness(this.wsProvider.awareness)
    this.wsProvider.once('synced', async (isSynced: boolean) => {
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

  applyTemplate(template: string) {
    this.collabService
      .disconnect()
      .applyTemplate(template, () => true)
      .connect()
  }
}

export const createEditor = async (root: HTMLElement) => {
  const docStore = useDocStore()
  markdown = docStore.currentDocState.content

  // console.log(docStore.currentDocState)

  const editor = await Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, markdown)
    })
    .config(nord)
    .use(commonmark)
    .use(collab)
    .create()

  editor.action((ctx) => {
    const collabService = ctx.get(collabServiceCtx)
    const collabManager = new CollabManager(collabService)
    collabManager.flush(markdown)
  })

  return editor
}
