<script setup>
import { ElAside, ElContainer, ElHeader, ElMain, ElText } from 'element-plus'
import FavoriteGroupItem from './components/FavoriteGroupItem.vue'
import { onMounted, reactive } from 'vue'
import { requestFetchFavoriteGroup } from '@/api/favorite'
import FavoriteTool from '@/components/tools/FavoriteTool/FavoriteTool.vue'
import CreateFavoriteGroupDialog from '@/components/tools/FavoriteTool/CreateFavoriteGroupDialog.vue'
import { Plus } from '@element-plus/icons-vue/dist/index.js'

const state = reactive({
  isLoading: true,
  activeId: 0,
  favoriteGroupList: [],

  createFavoriteGroupDialogVisible: false,
})

const methods = {
  refreshGroupList: async () => {
    state.isLoading = true
    try {
      const favoriteGroup = await requestFetchFavoriteGroup()
      state.favoriteGroupList = favoriteGroup.data
    } catch (error) {
      ElMessage.error('获取分组列表失败，请重试')
    } finally {
      state.isLoading = false
    }
  },
  handleCollectGroupActive(group) {
    state.activeGroup = group
  },
  handleGroupCreateSuccess() {
    state.createFavoriteGroupDialogVisible = false
    methods.refreshGroupList()
  },
}

// TODOL 添加收藏功能
onMounted(async () => {
  state.isLoading = true
  await methods.refreshGroupList()
})
</script>

<template>
  <ElContainer class="cl-favorites-view" v-loading="state.isLoading">
    <ElHeader class="cl-favorites-view__header">
      <section class="cl-favorites-view__header__title">
        <h3 style="margin: 0">收藏</h3>
      </section>
      <section class="cl-favorites-view__header__add">
        <ElIcon @click="state.createFavoriteGroupDialogVisible = true" style="cursor: pointer">
          <Plus />
        </ElIcon>
        <CreateFavoriteGroupDialog
          v-model="state.createFavoriteGroupDialogVisible"
          @close="state.createFavoriteGroupDialogVisible = false"
          @success="methods.handleGroupCreateSuccess"
        />
      </section>
    </ElHeader>
    <ElContainer>
      <ElAside class="cl-favorites-view__aside" width="200px">
        <template v-if="state.favoriteGroupList.length > 0">
          <FavoriteGroupItem
            v-for="(Item, index) in state.favoriteGroupList"
            :key="index"
            :collectionGroupName="Item.name"
            :collections-length="Item.count"
            :actived="state.activeId === Item.id"
            :is-all-collection="Item.id === 0"
          />
        </template>
        <template v-else>
          <FavoriteGroupItem collectionGroupName="全部收藏" is-all-collection actived />
        </template>
      </ElAside>
      <ElMain class="cl-favorites-view__main">
        <el-table
          :data="tableData"
          :default-sort="{ prop: 'name', order: 'ascending' }"
          style="width: 100%"
        >
          <el-table-column prop="name" label="名称" width="180" sortable />
        </el-table>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style lang="scss" scoped>
.cl-favorites-view {
  height: 100%;

  .cl-favorites-view__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 0;
    padding-bottom: 1.5rem;

    height: auto;
  }

  .cl-favorites-view__aside {
    padding: 0 0.5rem;
    border-right: 1px solid var(--el-border-color);
  }

  .cl-favorites-view__main {
    padding: 0 0.5rem;
  }
}
</style>
