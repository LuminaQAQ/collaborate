<script setup>
import { requestBookList } from '@/api/user'
import { ElButton, ElDialog, ElIcon, ElInput } from 'element-plus'
import { Notebook } from '@element-plus/icons-vue'
import { reactive } from 'vue'

defineProps({
  isOpen: Boolean,
})

const emits = defineEmits(['open', 'close', 'submit'])

const state = reactive({
  bookList: [],
  bookListIsLoad: false,
})

const handleOpen = async () => {
  emits('open', true)
  try {
    const res = await requestBookList()

    state.bookList = res.data.bookList
    state.bookListIsLoad = true
  } catch (err) {}
}

const handleClose = () => {
  emits('close', false)
}

// const handleSubmit = () => {
//   if (state.bookName.length > 0) {
//     emits(
//       'submit',
//       {
//         bookName: state.bookName,
//         bookDesc: state.bookDesc,
//       },
//       function resetFn() {
//         state.bookName = ''
//         state.bookDesc = ''
//       },
//     ),
//       (state.isLoading = true)
//   }
// }
</script>

<template>
  <ElDialog :model-value="isOpen" width="500" @open="handleOpen" @close="handleClose">
    <template #header> 新建文档 </template>
    <div class="cl-create-book__body">
      <div style="margin-bottom: 0.5rem">请选择一个知识库</div>
      <section class="cl-book-item" v-for="(item, index) in state.bookList" :key="index">
        <ElIcon color="#409eff" size="32"><Notebook /></ElIcon>
        <div class="book-info">
          <div class="title">
            <b>{{ item.name }}</b>
          </div>
          <small class="desc">{{ item.description || '暂无简介' }}</small>
        </div>
      </section>
    </div>
  </ElDialog>
</template>

<style lang="scss">
.cl-book-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d7d6d6;
  padding: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: rgb(235.9, 245.3, 255);
  }

  .book-info {
    margin-left: 0.5rem;
    .title {
    }
  }
}
</style>
