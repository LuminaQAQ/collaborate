<script setup>
import { ElIcon } from 'element-plus'
import { Notebook } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { requestCreateDoc } from '@/api/create'
import { useRouter } from 'vue-router'

const props = defineProps({
  book: Object,
})
const router = useRouter()

const handleToPath = async () => {
  try {
    const res = await requestCreateDoc({ book_id: props.book.id })
    const { doc_id } = res.data

    router.push(`/${props.book.email}/${props.book.id}/${doc_id}`)
  } catch (error) {}
}
</script>

<template>
  <div class="cl-book-item" @click="handleToPath">
    <ElIcon color="#409eff" size="32"><Notebook /></ElIcon>
    <div class="book-info">
      <div class="title">
        <b>{{ book.name }}</b>
      </div>
      <small class="desc">{{ book.description || '暂无简介' }}</small>
    </div>
  </div>
</template>

<style lang="scss">
.cl-book-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d7d6d6;
  padding: 0.5rem;
  cursor: pointer;

  text-decoration: none;
  color: initial;

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
