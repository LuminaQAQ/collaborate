<template>
  <ElContainer v-if="isLoad">
    <ElHeader>
      <ElInput v-model="docStore.currentDocState.title" />
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
import { ElContainer, ElMain } from 'element-plus'
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

<style lang="scss" scoped>
.el-header {
  --el-header-height: auto;
}
</style>
