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
})

const handleOpen = async () => {
  emits('open', true)
  try {
    const res = await requestBookList()

    state.bookList = res.data.bookList
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
      <span>请选择一个知识库</span>
      <section class="cl-book-item" v-for="(item, index) in state.bookList" :key="index">
        <ElIcon color="#409eff" size="22"><Notebook /></ElIcon>
        <div class="book-info">
          <div class="title">{{ item.title }}</div>
          <div class="desc">{{ item.description }}</div>
        </div>
      </section>
    </div>
  </ElDialog>
</template>

<style lang="scss">
.cl-book-item {
  display: flex;

  align-items: center;
}
</style>
