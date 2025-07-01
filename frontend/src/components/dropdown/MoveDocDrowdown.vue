<script setup>
import {
  ElDialog,
  ElDropdownItem,
  ElTree,
  ElSelect,
  ElOption,
  ElMessage,
  ElEmpty,
} from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useDocStore } from '@/stores/doc'
import { requestBookList, requestDocList } from '@/api/user'
import { useRoute } from 'vue-router'

const docStore = useDocStore()
const route = useRoute()

const treeProps = {
  label: 'title',
  children: 'children',
}

const state = reactive({
  dialogVisible: false,
  docTreeLoading: false,
  selectedBookId: 0,
  selectedDocTarget: {},
  bookList: [],
  docList: [],
})

const methods = {
  fetchBookList() {
    return new Promise((resolve, reject) => {
      requestBookList()
        .then((res) => {
          resolve(res.data.bookList)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  fetchDocList(book_id) {
    state.docTreeLoading = true
    return new Promise((resolve, reject) => {
      requestDocList({
        book_id,
      })
        .then((res) => {
          state.docTreeLoading = false
          resolve(res.data.docList)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  async handleDialogOpen() {
    state.dialogVisible = true
    state.docTreeLoading = true

    try {
      const { book } = route.params

      const bookList = await methods.fetchBookList()
      const docList = await methods.fetchDocList(book)

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
    state.docList = await methods.fetchDocList(state.selectedBookId)
  },
  handleNodeClick(data) {
    state.selectedDocTarget = data
  },
  handleConfirm() {
    if (!state.selectedDocTarget) return ElMessage.warning('请选择目标分组或文档节点')

    console.log('移动文档ID：', state.selectedDocTarget)
    console.log('移动文档ID：', state.selectedBookId)

    ElMessage.success('移动成功')
    // methods.handleDialogClose()
  },
}

onMounted(async () => {})
</script>

<template>
  <ElDropdownItem @click="methods.handleDialogOpen"> 移动到... </ElDropdownItem>

  <ElDialog
    v-model="state.dialogVisible"
    title="移动到..."
    width="600px"
    append-to-body
    @close="handleDialogClose"
  >
    <div style="margin-bottom: 16px">
      <select class="cl-select" v-model="state.selectedBookId" @change="methods.handleBookChange">
        <option v-for="lib in state.bookList" :key="lib.id" :value="lib.id">
          {{ lib.name }}
        </option>
      </select>
    </div>

    <div v-loading="state.docTreeLoading">
      <ElTree
        :data="state.docList"
        node-key="id"
        :props="treeProps"
        highlight-current
        @node-click="methods.handleNodeClick"
      />
    </div>

    <template #footer>
      <div style="text-align: right">
        <el-button @click="methods.handleDialogClose">取消</el-button>
        <el-button type="primary" @click="methods.handleConfirm">确认移动</el-button>
      </div>
    </template>
  </ElDialog>
</template>

<style lang="scss" scoped>
.text-gray-500 {
  color: #999;
  padding: 16px;
  text-align: center;
}

.cl-select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;

  &:focus {
    outline: none;
  }
}
</style>
