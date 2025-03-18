<script setup>
import { ElIcon } from 'element-plus'
import { Notebook } from '@element-plus/icons-vue'
import { ref } from 'vue'

const props = defineProps({
  book: Object,
})

const path = ref('')
// path.value =`/${book.email}/${book.id}/${}`

const handleToPath = () => {
  console.log(props.book.email, props.book.id)
}
</script>

<template>
  <div class="cl-book-item" :to="path" @click="handleToPath">
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
