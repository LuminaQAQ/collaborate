<script setup>
import ClListItem from '@/components/common/ClListItem.vue'
import { More, Plus } from '@element-plus/icons-vue/dist/index.js'
import { ElAside, ElContainer, ElHeader, ElIcon, ElMain, ElText } from 'element-plus'

// TODOL 添加收藏功能

defineProps({
  isAllCollection: {
    type: Boolean,
    default: false,
  },
  actived: {
    type: Boolean,
    default: false,
  },
  collectionGroupName: {
    type: String,
    default: '',
  },
  collectionsLength: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <ClListItem hover-item :has-bg="actived">
    <template #title>
      <div class="favorites-group-container">
        <header class="favorites-group-container__header">
          <ElText size="large">{{ collectionGroupName }}</ElText>
          <ElIcon ElIcon>
            <component :is="!isAllCollection && More" />
          </ElIcon>
        </header>
      </div>
    </template>
    <template #content>
      <small>{{ collectionsLength }} 条内容</small>
    </template>
  </ClListItem>
</template>

<style lang="scss" scoped>
.cl-list-item-wrap {
  margin-bottom: 0.25rem;
}

.favorites-group-container {
  .favorites-group-container__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 0.75rem;
  }
}
</style>
