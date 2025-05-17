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

  &>.collaborator-item {
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
        <ElInput v-if="docStore.handleRole.isOwnerOrEditor('doc')" v-model="docStore.currentDocState.title" />
        <h2 v-else>
          {{ docStore.currentDocState.title }}
        </h2>
      </section>
      <!-- 协作者 -->
      <section class="collaborator-wrap" v-if="isMulCollaborator">
        <section class="collaborator-item" v-for="item in docStore.currentDocState.collaborators.slice(0, 3)"
          :key="item.id" :title="item.username" @click="methods.handleCollaboratorClick(item)">
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
          <FavoriteTool :targetId="Number(route.params.doc)" targetType="Doc"
            :isFavorite="docStore.currentDocState.docInfo.isFavorite" @update="methods.handleDocFavorite" />
          <ShareTool :targetId="Number(route.params.doc)" targetType="Doc"
            v-permission="['book:owner', 'book:editor', 'doc:owner', 'doc:editor']" />
          <HistoryTool @restore="methods.handleRestore" v-permission="['doc:owner', 'doc:editor']" />
          <ClIconButton title="设置" :icon="SetUp" v-permission="['doc:owner', 'doc:editor']" />
        </ClIconButtonGroup>
      </section>
    </ElHeader>
    <ElMain id="editor-container" style="overflow: hidden; padding: 0.25rem 0">
      <template v-if="docStore.handleRole.isOwnerOrEditor('doc')">
        <MDEditor @update="methods.handleUpdate" @save="methods.handleSave"
          :room="`${route.params.book}-${route.params.doc}`" :default-value="docStore.currentDocState.content" />
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
import FavoriteTool from '@/components/tools/FavoriteTool.vue'
import HistoryTool from '@/components/tools/HistoryTool.vue'
import ShareTool from '@/components/tools/ShareTool/ShareTool.vue'
import { useDocStore } from '@/stores/doc'
import { request } from '@/utils/request'
import { SetUp } from '@element-plus/icons-vue/dist/index.js'
import { ElContainer, ElMain, ElMessage } from 'element-plus'
import { computed, onMounted, onUnmounted, ref } from 'vue'

import MDEditor from '@/components/common/MDEditor/MDEditor.vue'

import { useRoute } from 'vue-router'
import DocSocket from '@/socket/doc'

import { toPersonalCenter } from '@/router/handler'

const route = useRoute()

const docStore = useDocStore()
let socket = null

const isLoad = ref(false)

const isMulCollaborator = computed(() => docStore.currentDocState.collaborators.length > 1)

const methods = {
  async initDoc() {
    await docStore.fetchDoc()
    isLoad.value = true
  },

  handleDocFavorite(isFavorite) {
    docStore.currentDocState.docInfo.isFavorite = isFavorite
  },
  handleSave(markdown, isAutoSava) {
    if (docStore.currentDocState.content === markdown) return ElMessage.success('保存成功！')

    docStore.currentDocState.content = markdown

    docStore.updateDoc(isAutoSava)
  },
  handleUpdate(markdown) {
    // 会影响文档保存判断，但是可能后面有用，勿删
    // docStore.currentDocState.content = markdown
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
}

const controller = new AbortController()
onMounted(async () => {
  await methods.initDoc()

  if (!docStore.handleRole.isOwnerOrEditor('doc')) return

  const { book, doc } = route.params
  socket = new DocSocket({ bookId: Number(book), docId: Number(doc) })
})

onUnmounted(() => {
  controller.abort()

  if (socket) socket.disconnect()

  docStore.restoreCurrentState()
})
</script>
