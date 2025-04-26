import { CollabService } from '@milkdown/plugin-collab'
import { WebsocketProvider } from 'y-websocket'
import { Doc } from 'yjs'

import { useUserStore } from '@/stores/user'
import { useDocStore } from '@/stores/doc'

const randomColor = () => Math.floor(Math.random() * 16777215).toString(16)

const wsUrl = 'ws://localhost:5000'

export class CollabManager {
  private doc!: Doc
  private wsProvider!: WebsocketProvider
  private userStore = useUserStore()
  private docStore = useDocStore()

  constructor(
    private collabService: CollabService,
    private room: String,
  ) {}

  flush(template: string) {
    this.doc?.destroy()
    this.wsProvider?.destroy()

    this.doc = new Doc()
    const { book_id, id } = this.docStore.currentDocState.docInfo

    this.wsProvider = new WebsocketProvider(wsUrl, `${book_id}-${id}`, this.doc, { connect: true })

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
