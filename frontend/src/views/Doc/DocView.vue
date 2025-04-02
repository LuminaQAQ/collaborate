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
        <ElInput v-model="docStore.currentDocState.title" />
      </section>

      <section class="doc-addition-wrap">
        <ClIconButtonGroup size="21px">
          <CollectionTool />
          <ClIconButton title="协作" :icon="FolderAdd" />
          <ClIconButton title="分享" :icon="Share" />
          <HistoryTool
            v-permission="['role:owner.', 'role:editor']"
            @restore="methods.handleRestore"
          />
          <ClIconButton title="设置" :icon="SetUp" />
        </ClIconButtonGroup>
      </section>
    </ElHeader>
    <ElMain>
      <v-md-editor
        ref="md"
        height="100%"
        v-model="docStore.currentDocState.content"
        :disabled-menus="[]"
        @upload-image="methods.handleUploadImage"
      />
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
const docStore = useDocStore()
const md = ref('')
const isLoad = ref(false)

const methods = {
  handleSave() {
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
}

const controller = new AbortController()
onMounted(() => {
  methods.initDoc()

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
})
</script>
