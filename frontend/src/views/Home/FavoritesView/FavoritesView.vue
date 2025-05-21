<script setup>
import ClListItem from '@/components/common/ClListItem.vue';
import { Plus } from '@element-plus/icons-vue/dist/index.js';
import { ElAside, ElContainer, ElHeader, ElIcon, ElMain, ElText } from 'element-plus';
import FavoriteGroupItem from './components/FavoriteGroupItem.vue';
import { onMounted, reactive } from 'vue';
import { requestFetchFavoriteGroup } from '@/api/favorite';

const state = reactive({
  isLoading: true,
  favoriteGroupList: []
})

const methods = {
  refreshGroupList: () => {
    state.isLoading = true;

    requestFetchFavoriteGroup().then(res => {
      state.favoriteGroupList = res.data;
      state.isLoading = false;
    })
  },
  handleCollectGroupActive(group) {
    state.activeGroup = group;
  },
}

// TODOL 添加收藏功能
onMounted(async () => {
  state.isLoading = true;
  await methods.refreshGroupList()
})
</script>

<template>
  <ElContainer v-loading="state.isLoading" class="cl-favorites-view">
    <ElHeader class="cl-favorites-view__header">
      <section class="cl-favorites-view__header__title">
        <h3 style="margin: 0;">收藏</h3>
      </section>
      <section class="cl-favorites-view__header__add">
        <ElText>添加</ElText>
      </section>
    </ElHeader>
    <ElContainer>
      <ElAside class="cl-favorites-view__aside" width="200px">
        <template v-if="state.favoriteGroupList.length > 0">
          <FavoriteGroupItem :collectionGroupName="state.favoriteGroupList[0].name"
            :collections-length="state.favoriteGroupList[0].count" is-all-collection actived />
          <FavoriteGroupItem />
        </template>
        <template v-else>
          <FavoriteGroupItem collectionGroupName="全部收藏" is-all-collection actived />
        </template>
      </ElAside>
      <ElMain class="cl-favorites-view__main">
        <el-table :data="tableData" :default-sort="{ prop: 'name', order: 'ascending' }" style="width: 100%">
          <el-table-column prop="name" label="名称" width="180" sortable />
        </el-table>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style lang="scss" scoped>
.cl-favorites-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0;
  padding-bottom: 1.5rem;

  height: auto;
}

.cl-favorites-view__aside {
  padding: 0 .5rem;
  border-right: 1px solid var(--el-border-color);
}

.cl-favorites-view__main {
  padding: 0 .5rem;
}
</style>
