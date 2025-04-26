<style lang="scss" scoped>
.el-header {
  --el-header-height: auto;

  display: flex;
  justify-content: space-between;
}

.collaborator-wrap {
  height: 100%;
  margin: 0 auto 0 1rem;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;

  & > .collaborator-item {
    margin-right: 0.35rem;

    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

<template>
  <ElContainer v-if="isLoad">
    <ElHeader>
      <section>
        <ElInput
          v-if="docStore.handleRole.isOwnerOrEditor('doc')"
          v-model="docStore.currentDocState.title"
          @input="methods.updateDocValue"
        />
        <h2 v-else>
          {{ docStore.currentDocState.title }}
        </h2>
      </section>
      <section class="collaborator-wrap" v-if="isMulCollaborator">
        <section
          class="collaborator-item"
          v-for="item in state.collaborators.slice(0, 3)"
          :key="item.id"
          :title="item.username"
        >
          <template v-if="item.avatar">
            <ElAvatar :src="item.avatar" />
          </template>
          <template v-else>
            <ElAvatar :size="28">
              {{ item.username }}
            </ElAvatar>
          </template>
        </section>
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
    <ElMain id="editor-container" style="overflow-x: hidden">
      <template v-if="docStore.handleRole.isOwnerOrEditor('doc')">
        <MDEditor
          @update="methods.handleUpdate"
          :room="`${route.params.book}-${route.params.doc}`"
        />
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
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

import { MilkdownProvider } from '@milkdown/vue'
import MDEditor from '@/components/common/MDEditor/index.vue'

import useSocket from '@/utils/useSocket'
import { useRoute } from 'vue-router'

const route = useRoute()

const docStore = useDocStore()
let socket = null

const isLoad = ref(false)

const state = reactive({
  collaborators: [],
})

const isMulCollaborator = computed(() => state.collaborators.length > 1)

const methods = {
  handleSave(isAutoSava = false) {
    docStore.currentDocState.content = editor.value.getValue()
    docStore.updateDoc(isAutoSava)
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

    // const editorContent = editorRef.value.querySelector('.vditor-content')
    // const wrap = document.getSelection().getRangeAt(0).commonAncestorContainer.parentNode
    // console.log(editorContent, wrap)

    // const cursor = document.createElement('div')

    // console.log()

    // cursor.style.cssText = `
    //   position: absolute;
    //   top: ${top}px;
    //   left: ${left}px;
    //   width: 2px;
    //   height: ${wrap.getBoundingClientRect().height}px;
    //   transform: translate(-50%, -25%);
    //   background: red;
    //   border-radius: 50%;
    //   z-index: 999;
    // `
    // editorContent.appendChild(cursor)

    // socket.emit('updateCursor', { left, top })
  },

  handleUpdate(markdown) {
    // const content = editor.value.getValue()
    // if (isMulCollaborator.value) {
    //   socket.emit('doc/update', {
    //     book_id: Number(route.params.book),
    //     doc_id: Number(route.params.doc),
    //     title: docStore.currentDocState.title,
    //     content,
    //   })
    // }
  },
}

const controller = new AbortController()
onMounted(async () => {
  await methods.initDoc()

  if (!docStore.handleRole.isOwnerOrEditor('doc')) return
})

onUnmounted(() => {
  controller.abort()

  // if (socket) socket.disconnect()
  // if (editor.value) editor.value.destroy()

  docStore.restoreCurrentState()
})
</script>
