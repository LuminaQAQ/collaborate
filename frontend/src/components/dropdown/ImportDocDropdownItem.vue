<script setup lang="ts">
import { Upload } from '@element-plus/icons-vue/dist/index.js'
import { ElDialog, ElDropdownItem } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const importFileBtn = ref<HTMLInputElement>(null)

const state = reactive({
  importDocumentDialogVisible: false,
  fileData: {
    content: '',
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
        content: fileReader.result.toString(),
        name: file.name,
        size: file.size,
        type: file.type,
      }
    }
  },
  handleUploadImportFile() {
    console.log(1)
  },
  handleImportFileDialogClose() {
    state.importDocumentDialogVisible = false
    importFileBtn.value.value = ''
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
      accept=".md,.markdown,.doc,.docx,.txt"
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
      <ElButton type="primary" @click="methods.handleUploadImportFile">导入</ElButton>
      <ElButton @click="methods.handleImportFileDialogClose">取消</ElButton>
    </template>
  </ElDialog>
</template>

<style lang="scss" scoped>
.import-file-btn {
  display: none;
}
</style>
