<script setup>
import { reactive } from 'vue'

import { ElDialog } from 'element-plus'
import BookItem from './BookItem.vue'

import { requestBookList } from '@/api/user'

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

    console.log(state.bookList)
  } catch (err) {}
}

const handleClose = () => {
  emits('close', false)
}
</script>

<template>
  <ElDialog :model-value="isOpen" width="500" @open="handleOpen" @close="handleClose">
    <template #header> 新建文档 </template>
    <div class="cl-create-book__body">
      <div style="margin-bottom: 0.5rem">请选择一个知识库</div>
      <BookItem v-for="book in state.bookList" :key="book.id" :book="book" />
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
