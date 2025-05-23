<script setup>
import ClListItem from '@/components/common/ClListItem.vue'
import { More } from '@element-plus/icons-vue/dist/index.js'
import { ElButton, ElDropdown, ElDropdownMenu, ElIcon, ElText } from 'element-plus'

const emits = defineEmits(['rename', 'delete'])

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

const methods = {
  handleRenameCollectionGroup() {
    emits('rename')
  },
  handleDeleteCollectionGroup() {
    emits('delete')
  },
}
</script>

<template>
  <ClListItem hover-item :has-bg="actived">
    <template #title>
      <div class="favorites-group-container">
        <header class="favorites-group-container__header">
          <ElText size="large">{{ collectionGroupName }}</ElText>
          <ElDropdown trigger="hover">
            <ElIcon>
              <component :is="!isAllCollection && More" />
            </ElIcon>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem>
                  <ElButton type="primary" @click="methods.handleRenameCollectionGroup" text>
                    重命名
                  </ElButton>
                </ElDropdownItem>
                <ElDropdownItem>
                  <ElButton type="danger" @click="methods.handleDeleteCollectionGroup" text>
                    删除
                  </ElButton>
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
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
