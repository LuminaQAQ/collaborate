<style lang="scss" scoped>
.el-header {
  --el-header-height: auto;

  display: flex;
  justify-content: space-between;
}
</style>

<template>
  <ElContainer v-if="isLoad">
    <ElHeader>
      <section>
        <ElInput
          v-if="docStore.handleRole.isOwnerOrEditor('doc')"
          v-model="docStore.currentDocState.title"
        />
        <h2 v-else>
          {{ docStore.currentDocState.title }}
        </h2>
      </section>

      <section class="doc-addition-wrap">
        <ClIconButtonGroup size="21px">
          <CollectionTool />
          <ClIconButton title="协作" :icon="FolderAdd" v-permission="['doc:owner', 'doc:editor']" />
          <ClIconButton title="分享" :icon="Share" v-permission="['doc:owner', 'doc:editor']" />
          <HistoryTool
            @restore="methods.handleRestore"
            v-permission="['doc:owner', 'doc:editor']"
          />
          <ClIconButton title="设置" :icon="SetUp" v-permission="['doc:owner', 'doc:editor']" />
        </ClIconButtonGroup>
      </section>
    </ElHeader>
    <ElMain id="editor-container">
      <template v-if="docStore.handleRole.isOwnerOrEditor('doc')">
        <div id="editor" ref="editorRef" @click="methods.updateCursorPosition"></div>
        <!-- <v-md-editor
          height="100%"
          v-model="docStore.currentDocState.content"
          :disabled-menus="[]"
          @upload-image="methods.handleUploadImage"
        /> -->
      </template>
      <template v-else>
        <v-md-preview :text="docStore.currentDocState.content" />
      </template>
    </ElMain>
  </ElContainer>
</template>

<script setup>
import ClIconButton from '@/components/common/ClIconButton.vue'
import ClIconButtonGroup from '@/components/common/ClIconButtonGroup.vue'
import CollectionTool from '@/components/tools/CollectionTool.vue'
import HistoryTool from '@/components/tools/HistoryTool.vue'
import { useDocStore } from '@/stores/doc'
import { request } from '@/utils/request'
import { Share, Star, FolderAdd, SetUp, MostlyCloudy } from '@element-plus/icons-vue/dist/index.js'
import { ElContainer, ElIcon, ElMain } from 'element-plus'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import Vditor from 'vditor'
import 'vditor/dist/index.css'

import { socketIO } from '@/utils/socketIO'

const editorRef = ref(null)
let editor = ref(null)

const docStore = useDocStore()
let socket = socketIO

const isLoad = ref(false)

const methods = {
  handleSave() {
    docStore.currentDocState.content = editor.value.getValue()
    docStore.updateDoc()
  },
  /**
   *
   * @param event
   * @param insertImage
   * @param {File[]} files
   */
  handleUploadImage(event, insertImage, files) {
    files.forEach((item) => {
      request('/api/docImageUpload', {
        method: 'post',
        data: { img: item, name: item.name },
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: '.jpg',
        },
      }).then((res) => {
        const { url, desc } = res.data
        insertImage({
          url,
          desc,
          width: 'auto',
          height: 'auto',
        })
      })
    })
  },
  async initDoc() {
    await docStore.fetchDoc()
    isLoad.value = true
  },
  updateCursorPosition() {
    const { left, top } = editor.value.getCursorPosition()
    if (!left && !top) return
    socket.emit('updateCursor', { left, top })
  },
}

const controller = new AbortController()
onMounted(async () => {
  await methods.initDoc()

  if (!docStore.handleRole.isOwnerOrEditor('doc')) return

  editor.value = new Vditor(editorRef.value, {
    height: '100%',
    mode: 'wysiwyg',
    toolbar: [
      'upload',
      '|',
      'undo',
      'redo',
      '|',
      'headings',
      'bold',
      'italic',
      'strike',
      'inline-code',
      '|',
      'emoji',
      'list',
      'ordered-list',
      'outdent',
      'indent',
      '|',
      'check',
      'line',
      'quote',
      'code',
      '|',
      'link',
      'table',
      'record',
      'both',
      'fullscreen',
      'outline',
      'export',
      'help',
      'br',
    ],
    cache: {
      id: 'editor',
    },
    after: () => {
      editor.value.setValue(docStore.currentDocState.content)
    },
    input: (content) => {
      docStore.currentDocState.content = content
    },
  })

  socket.connect()
  socket.emit('user/join')
  socket.on('user/add', (user) => {
    console.log(user)
  })

  // socket.on('connection', () => {
  //   console.log('socket connected')
  // })

  // socket.on('updateCursor', (data) => {
  //   console.log(data)
  // })

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()

        methods.handleSave()
      }
    },
    { signal: controller.signal },
  )
})

onBeforeUnmount(() => {
  controller.abort()

  if (editor.value) editor.value.destroy()
  if (socket) socket.disconnect()
})
</script>
