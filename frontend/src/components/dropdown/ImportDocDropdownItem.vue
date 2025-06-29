<script setup lang="ts">
import { requestUploadDocFile } from '@/api/doc'
import { toDoc } from '@/router/handler'
import { useDocStore } from '@/stores/doc'
import { useUserStore } from '@/stores/user'
import { Upload } from '@element-plus/icons-vue/dist/index.js'
import { ElButton, ElDialog, ElDropdownItem, ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const importFileBtn = ref<HTMLInputElement>(null)
const docStore = useDocStore()
const userStore = useUserStore()

const state = reactive({
  importDocumentDialogVisible: false,
  uploadImportLoading: false,
  fileData: {
    file: null,
    name: '',
    size: 0,
    type: '',
  },
})

const methods = {
  handleImportFileDialogOpen() {
    importFileBtn.value.click()
  },
  async handleImportFileChange() {
    state.importDocumentDialogVisible = true
    const file = importFileBtn.value.files[0]

    const fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onload = () => {
      state.fileData = {
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
      }
    }
  },
  async handleUploadImportFile() {
    try {
      state.uploadImportLoading = true

      const formData = new FormData()
      formData.append('file', state.fileData.file)
      formData.append('book_id', docStore.currentDocState.bookInfo.id)
      formData.append('file_name', state.fileData.name)
      formData.append('file_size', state.fileData.size)
      formData.append('file_type', state.fileData.type)
      formData.append('parent_id', null)

      const res = await requestUploadDocFile(formData)
      await docStore.fetchDocList()

      toDoc({
        user: userStore.user.userInfo.username,
        book: docStore.currentDocState.bookInfo.id,
        doc: res.data.doc_id,
      })

      state.importDocumentDialogVisible = false

      ElMessage.success('导入成功')
    } catch (error) {
      ElMessage.error(error.message)
    } finally {
      state.uploadImportLoading = false
    }
  },
  handleImportFileDialogClose() {
    state.importDocumentDialogVisible = false
    importFileBtn.value.value = ''
    state.fileData = {
      file: null,
      name: null,
      size: null,
      type: null,
    }
  },
}

onMounted(() => {})
</script>

<template>
  <ElDropdownItem :icon="Upload" @click="methods.handleImportFileDialogOpen">
    导入文档
    <input
      ref="importFileBtn"
      class="import-file-btn"
      type="file"
      accept=".md,.markdown,.docx,.txt"
      @change="methods.handleImportFileChange"
    />
  </ElDropdownItem>

  <ElDialog
    v-model="state.importDocumentDialogVisible"
    @close="methods.handleImportFileDialogClose"
    title="确认导入文档信息"
    append-to-body
  >
    <p><strong>文件名：</strong>{{ state.fileData.name }}</p>
    <p><strong>文件类型：</strong>{{ state.fileData.type }}</p>

    <template #footer>
      <ElButton
        type="primary"
        :loading="state.uploadImportLoading"
        @click="methods.handleUploadImportFile"
        >导入</ElButton
      >
      <ElButton @click="methods.handleImportFileDialogClose">取消</ElButton>
    </template>
  </ElDialog>
</template>

<style lang="scss" scoped>
.import-file-btn {
  display: none;
}
</style>
