<style lang="scss" scoped>
.el-header {
  --el-header-height: auto;

  display: flex;
  justify-content: space-between;
  padding: 0;
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

// .floating-btn {
//   position: fixed;
//   z-index: 999;
// }

.ai-chat-btn {
  bottom: 20px;
  right: 20px;
}
</style>

<template>
  <ElContainer v-if="isLoad">
    <ElHeader>
      <section v-if="state.editorView.isReadonly">
        <ElInput
          v-if="docStore.handleRole.isOwnerOrEditor('doc')"
          v-model="state.editorView.title"
        />
        <h2 v-else>
          {{ docStore.currentDocState.docInfo.title }}
        </h2>
      </section>
      <section v-else></section>
      <!-- 协作者 -->
      <section class="collaborator-wrap" v-if="isMulCollaborator">
        <section
          class="collaborator-item"
          v-for="item in docStore.currentDocState.collaborators.slice(0, 3)"
          :key="item.id"
          :title="item.username"
          @click="methods.handleCollaboratorClick(item)"
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
          <FavoriteTool
            :targetId="Number(route.params.doc)"
            targetType="Doc"
            :isFavorite="docStore.currentDocState.docInfo.isFavorite"
            @update="methods.handleDocFavorite"
          />
        </ClIconButtonGroup>

        <ClIconButtonGroup
          size="21px"
          v-permission="['book:owner', 'book:editor', 'doc:owner', 'doc:editor']"
        >
          <ClIconButton
            :icon="state.editorView.isReadonly ? View : Edit"
            :title="state.editorView.isReadonly ? '预览' : '编辑'"
            @click="methods.handleEditorViewReadonlyChange"
          />
          <ShareTool :targetId="Number(route.params.doc)" targetType="Doc" />
          <ClIconButton
            title="历史记录"
            :icon="Cloudy"
            @click="state.historyToolBoardVisible = !state.historyToolBoardVisible"
          />
          <!-- <ClIconButton title="设置" :icon="SetUp" v-permission="['doc:owner', 'doc:editor']" /> -->
          <!-- TODO: 添加设置抽屉 -->
          <SettingDeawerTool />
        </ClIconButtonGroup>
      </section>
    </ElHeader>
    <ElMain
      id="editor-container"
      style="overflow: hidden; padding: 0.25rem 0"
      v-loading="state.translateLoading"
    >
      <template v-if="docStore.handleRole.isOwnerOrEditor('doc') && state.editorView.isReadonly">
        <MDEditor
          v-model="docStore.currentDocState.docInfo.content"
          :readonly="state.editorView.isReadonly"
          :room="`${route.params.book}-${route.params.doc}`"
          @mounted="methods.handleEditorMounted"
          @update="methods.handleUpdate"
          @save="methods.handleSave"
          @cursor-update="methods.handleCursorUpdate"
          @selection-update="methods.handleSelectionUpdate"
        />
      </template>
      <template v-else>
        <MDPreview
          :value="
            (docStore.currentDocState.editorView.isTranslateMode &&
              state.editorView.translateText) ||
            previewMD
          "
        />
      </template>
    </ElMain>
  </ElContainer>

  <HistoryTool
    v-if="state.historyToolBoardVisible"
    @close="state.historyToolBoardVisible = false"
    @restore="methods.handleRestore"
  />

  <template v-if="docStore.handleRole.isOwnerOrEditor('doc') && state.editorView.isReadonly">
    <FloatingBall
      title="AI"
      style="right: 20px; bottom: 20px"
      v-permission="['book:owner', 'book:editor', 'doc:owner', 'doc:editor']"
      :icon="ChatDotRound"
      @click="state.AIToolVisible = !state.AIToolVisible"
    />

    <AIChatTool
      v-permission="['book:owner', 'book:editor', 'doc:owner', 'doc:editor']"
      v-model="state.AIToolVisible"
      :position="state.cursorState.position"
      :modelValue="state.AIToolVisible"
      :selectionContent="docStore.currentDocState.editorView.selection"
      @replace="methods.handleReplaceMD"
    />
  </template>

  <template v-else>
    <FloatingBall
      title="翻译"
      style="right: 20px; bottom: 20px"
      :icon="Translate"
      :loading="state.translateLoading"
      @click="methods.handleTranslateModeChange"
    />

    <el-popover placement="left-end" :width="400" trigger="click" @show="methods.handleSummary">
      <template #reference>
        <FloatingBall
          title="摘要"
          style="right: 20px; bottom: 70px"
          :icon="Abstract"
          :loading="state.aiLoading"
          @click="methods.handleAIModeChange"
        />
      </template>
      <template #default>
        <ElScrollbar v-loading="state.editorView.abstractText.length === 0">
          <h2 style="text-align: center; margin: 0">摘要</h2>
          <v-md-preview :text="state.editorView.abstractText" style="height: 12rem" />
        </ElScrollbar>
      </template>
    </el-popover>
  </template>
</template>

<script setup>
import { requestChatToAi } from '@/api/ai'
import { requestDocUpdate } from '@/api/user'
import ClIconButton from '@/components/common/ClIconButton.vue'
import ClIconButtonGroup from '@/components/common/ClIconButtonGroup.vue'
import MDEditor from '@/components/common/MDEditor/MDEditor.vue'
import MDPreview from '@/components/common/MDEditor/MDPreview.vue'
import Abstract from '@/components/imgs/Abstract.vue'
import Translate from '@/components/imgs/Translate.vue'
import AIChatTool from '@/components/tools/AI/AIChatTool.vue'
import FavoriteTool from '@/components/tools/FavoriteTool/FavoriteTool.vue'
import FloatingBall from '@/components/tools/FloatingBall.vue'
import HistoryTool from '@/components/tools/HistoryTool.vue'
import SettingDeawerTool from '@/components/tools/SettingDrawerTool.vue'
import ShareTool from '@/components/tools/ShareTool/ShareTool.vue'
import { toPersonalCenter } from '@/router/handler'
import DocSocket from '@/socket/doc'
import { useDocStore } from '@/stores/doc'
import { request } from '@/utils/request'
import { ChatDotRound, Cloudy, Edit, View } from '@element-plus/icons-vue/dist/index.js'
import { replaceAll } from '@milkdown/kit/utils'
import { ElContainer, ElMain, ElMessage, ElScrollbar, ElText } from 'element-plus'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const docStore = useDocStore()
let socket = null

let editorState = null

const state = reactive({
  historyToolBoardVisible: false,
  AIToolVisible: false,

  translateToolVisible: false,
  translateLoading: false,
  editorView: {
    title: '',
    selection: '',
    // TODO:
    isReadonly: true,
    isReadonly: false,

    translateText: '',
    abstractText: '',
  },
  cursorState: {
    position: {
      top: 0,
      left: 0,
      height: 0,
    },
  },
})

const isLoad = ref(false)

const isMulCollaborator = computed(() => docStore.currentDocState.collaborators.length > 1)
const previewMD = computed(() => {
  return `# ${docStore.currentDocState.docInfo.title}\n${docStore.currentDocState.content}`
})

const methods = {
  async initDoc() {
    await docStore.fetchDoc()
    isLoad.value = true
  },

  handleDocFavorite(isFavorite) {
    docStore.currentDocState.docInfo.isFavorite = isFavorite
  },
  handleSave(content, isAutoSava) {
    const { docInfo } = docStore.currentDocState
    if (docInfo.title === state.editorView.title && docInfo.content === content)
      return ElMessage.success('保存成功！')

    docStore.currentDocState.docInfo.title = state.editorView.title
    docStore.currentDocState.docInfo.content = content

    docStore.updateDoc(isAutoSava)
  },
  handleUpdate(markdown) {
    // 会影响文档保存判断，但是可能后面有用，勿删
    docStore.currentDocState.docInfo.content = markdown
  },
  handleCursorUpdate(cursor) {
    Object.assign(state.cursorState.position, cursor)
  },
  handleCollaboratorClick(collaborator) {
    toPersonalCenter(collaborator.email)
  },
  /**
   *
   * @param event
   * @param insertImage
   * @param {File[]} files
   */
  // TODO: 暂未实现上传图片功能，后续再实现
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
  handleEditorMounted(editor) {
    editorState = editor
  },
  /**
   *
   * @param {Object} docInfo
   * @param {Number} docInfo.doc_id
   * @param {String} docInfo.title
   * @param {String} docInfo.content
   * @param {() => {}} loading
   * @param {() => {}} done
   */
  handleRestore(docInfo, loading, done) {
    if (isMulCollaborator.value)
      return ElMessage.error('多人编辑中，请请联系其他协作者退出编辑后再试')

    loading()

    const { doc_id, content, title } = docInfo

    return new Promise((resolve, reject) => {
      requestDocUpdate({ doc_id, title, content })
        .then((_) => {
          docStore.currentDocState.docInfo.title = title
          docStore.currentDocState.docInfo.content = content

          try {
            editorState.editor.editor.action(replaceAll(content))
          } catch (error) {}
          done()
          resolve()
          state.historyToolBoardVisible = false
          ElMessage.success('恢复成功!')
        })
        .catch((err) => reject(err))
    })
  },

  handleReplaceMD(md) {
    docStore.currentDocState.docInfo.content = md
    editorState.editor.editor.action(replaceAll(md))
  },
  async handleSelectionUpdate(text) {
    docStore.currentDocState.editorView.selection = text
  },
  handleEditorViewReadonlyChange() {
    state.editorView.isReadonly = !state.editorView.isReadonly
    docStore.currentDocState.editorView.isReadonly = state.editorView.isReadonly
  },
  handleTranslateDocument() {
    const lang = navigator.language || navigator.userLanguage

    state.translateLoading = true

    ElMessage.success('翻译中...')

    return new Promise((resolve) => {
      requestChatToAi({
        prompt: `翻译这篇文档至 ${lang} 语言`,
        content: docStore.currentDocState.docInfo.content,
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          ElMessage.error('翻译失败')
        })
        .finally(() => {
          state.translateLoading = false
        })
    })
  },
  async handleTranslateModeChange() {
    const { isTranslateMode } = docStore.currentDocState.editorView

    if (!isTranslateMode) {
      if (!state.editorView.translateText) {
        const res = await methods.handleTranslateDocument()
        state.editorView.translateText = res.data.response
      }
      docStore.currentDocState.editorView.isTranslateMode = true
    } else {
      docStore.currentDocState.editorView.isTranslateMode = false
    }
  },

  handleSummaryDocument() {
    const lang = navigator.language || navigator.userLanguage

    return new Promise((resolve) => {
      requestChatToAi({
        prompt: `生成摘要， 语言为${lang}`,
        content: docStore.currentDocState.docInfo.content,
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          ElMessage.error('翻译失败')
        })
        .finally(() => {
          state.translateLoading = false
        })
    })
  },
  async handleSummary() {
    if (!state.editorView.abstractText) {
      const res = await methods.handleSummaryDocument()
      state.editorView.abstractText = res.data.response
    }
  },
}

docStore.handleRestore = methods.handleRestore

const controller = new AbortController()
onMounted(async () => {
  await methods.initDoc()

  if (!docStore.handleRole.isOwnerOrEditor('doc')) return

  const { book, doc } = route.params
  socket = new DocSocket({ bookId: Number(book), docId: Number(doc) })

  state.editorView.title = docStore.currentDocState.docInfo.title
})

onUnmounted(() => {
  controller.abort()

  if (socket) socket.disconnect()

  docStore.restoreCurrentState()
})
</script>
