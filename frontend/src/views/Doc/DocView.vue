<style lang="scss" scoped>
.el-header {
  --el-header-height: auto;

  display: flex;
  justify-content: space-between;

  .doc-addition-wrap {
    > .el-icon {
      margin: 0 0.25rem;
      padding: 0.5rem;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }
}
</style>

<template>
  <ElContainer v-if="isLoad">
    <ElHeader>
      <section>
        <ElInput v-model="docStore.currentDocState.title" />
      </section>

      <section class="doc-addition-wrap">
        <ElIcon size="21" title="收藏"><Star /> </ElIcon>
        <ElIcon size="21" title="协作"><FolderAdd /> </ElIcon>
        <ElIcon size="21" title="分享"><Share /> </ElIcon>
        <ElIcon size="21" title="历史版本"><MostlyCloudy /> </ElIcon>
        <ElIcon size="21" title="设置"><SetUp /> </ElIcon>
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
