<script setup>
import { ElDialog, ElDropdownItem, ElMessage } from 'element-plus'
import { onMounted } from 'vue'
import { useDocStore } from '@/stores/doc'
import { useRoute } from 'vue-router'
import { requestDocCopy } from '@/api/doc'
import { useDocMoveOrCopy } from './composables/useDocMoveOrCopy'
import ClSelect from './components/ClSelect.vue'
import ClListTree from './components/ClListTree.vue'

const docStore = useDocStore()
const route = useRoute()

const { docItem } = defineProps({
  docItem: Object,
})

const { state, fetchBookList, fetchDocList } = useDocMoveOrCopy()

const methods = {
  async handleDialogOpen() {
    state.dialogVisible = true
    state.docTreeLoading = true

    try {
      const { book } = route.params

      const bookList = await fetchBookList()
      const docList = await fetchDocList(book)

      state.bookList = bookList
      state.docList = docList

      state.selectedBookId = book
    } catch (error) {}
  },
  handleDialogClose() {
    state.dialogVisible = false
    state.docTreeLoading = false
    state.bookList = []
    state.docList = []
  },
  async handleBookChange() {
    state.docList = await fetchDocList(state.selectedBookId)
  },
  handleNodeClick(data) {
    state.selectedDocTarget = data
  },
  async handleConfirm() {
    if (!state.selectedDocTarget) return ElMessage.warning('请选择目标分组或文档节点')

    const data = {
      doc_id: docItem.id,
      book_id: state.selectedDocTarget?.book_id || state.selectedBookId,
      parent_id: state.selectedDocTarget?.type === 'group' ? state.selectedDocTarget.id : null,
    }

    try {
      await requestDocCopy(data)
      await docStore.fetchDocList()

      ElMessage.success('复制成功')
      methods.handleDialogClose()
    } catch (error) {
      ElMessage.error('复制失败')
    }
  },
}

onMounted(async () => {})
</script>

<template>
  <ElDropdownItem @click="methods.handleDialogOpen"> 复制到... </ElDropdownItem>

  <ElDialog
    v-model="state.dialogVisible"
    title="复制到..."
    width="600px"
    append-to-body
    @close="handleDialogClose"
  >
    <div style="margin-bottom: 16px">
      <ClSelect
        v-model="state.selectedBookId"
        :options="state.bookList"
        @change="methods.handleBookChange"
      >
        <option v-for="book in state.bookList" :key="book.id" :value="book.id">
          {{ book.name }}
        </option>
      </ClSelect>
    </div>

    <div v-loading="state.docTreeLoading">
      <ClListTree :data="state.docList" @node-click="methods.handleNodeClick" />
    </div>

    <template #footer>
      <div style="text-align: right">
        <el-button @click="methods.handleDialogClose">取消</el-button>
        <el-button type="primary" @click="methods.handleConfirm">确认复制</el-button>
      </div>
    </template>
  </ElDialog>
</template>
