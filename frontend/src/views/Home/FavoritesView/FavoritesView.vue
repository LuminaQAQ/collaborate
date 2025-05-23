<script setup>
import {
  ElAside,
  ElContainer,
  ElHeader,
  ElIcon,
  ElInput,
  ElMain,
  ElMessage,
  ElMessageBox,
  ElScrollbar,
  ElTable,
  ElTableColumn,
  ElText,
} from 'element-plus'
import FavoriteGroupItem from './components/FavoriteGroupItem.vue'
import { onMounted, reactive } from 'vue'
import {
  requestDelFavoriteGroup,
  requestFetchFavoriteGroup,
  requestFetchFavoriteList,
} from '@/api/favorite'
import FavoriteTool from '@/components/tools/FavoriteTool/FavoriteTool.vue'
import CreateFavoriteGroupDialog from '@/components/tools/FavoriteTool/CreateFavoriteGroupDialog.vue'
import { Document, Notebook, Plus, Search } from '@element-plus/icons-vue/dist/index.js'
import { toBook, toBookByLocation, toDoc, toDocByLocation } from '@/router/handler'
import FavoriteGroupRenameDialog from './components/FavoriteGroupRenameDialog.vue'
import ClIconButton from '@/components/common/ClIconButton.vue'

const state = reactive({
  isLoading: true,
  activeId: null,
  favoriteGroupList: [],
  favoriteList: [],
  favoriteListState: {
    limit: 15,
    offset: 0,
    q: '',
  },

  createFavoriteGroupDialogVisible: false,

  renameDialog: {
    visable: false,
    info: {},
  },
})

const favoriteTypeIcon = {
  Doc: Document,
  Book: Notebook,
}

const handleToPageStrategies = {
  Doc: (target_info) =>
    toDocByLocation({
      user: target_info.email,
      book: target_info.book_id,
      doc: target_info.id,
    }),
  Book: (target_info) =>
    toBookByLocation({
      user: target_info.email,
      book: target_info.id,
    }),
}

const methods = {
  /**
   * 刷新分组列表
   */
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
  /**
   *
   * @param {Object} item 分组信息
   */
  async handleCollectGroupActive(item) {
    const { id } = item
    if (id === state.activeId) return

    state.isLoading = true
    state.activeId = id

    await methods.handleFetchFavorites(id)
  },
  /**
   * 创建分组成功回调
   */
  handleGroupCreateSuccess() {
    state.createFavoriteGroupDialogVisible = false
    methods.refreshGroupList()
  },
  /**
   * 获取收藏
   * @param {Number} id 分组id
   */
  async handleFetchFavorites(id) {
    try {
      const res = await requestFetchFavoriteList({
        favorite_group_id: id,
        limit: state.favoriteListState.limit,
        offset: state.favoriteListState.offset,
        q: state.favoriteListState.q,
      })

      state.favoriteList = res.data

      methods.refreshGroupList()
    } catch (error) {
      state.isLoading = false
      ElMessage.error('获取列表失败，请重试')
    } finally {
      state.isLoading = false
    }
  },
  /**
   * 重置列表
   */
  resetFavoriteList() {
    state.favoriteGroupList = []
    Object.assign(state.favoriteListState, {
      limit: 15,
      offset: 0,
    })
  },
  toTarget(target) {
    const { target_type, target_info } = target

    handleToPageStrategies[target_type](target_info)
  },

  async handleDeleteGroup(group) {
    try {
      await ElMessageBox.confirm('确定要删除此分组吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger',
      })

      const { id } = group
      await requestDelFavoriteGroup({ id })
      await methods.refreshGroupList()

      ElMessage.success('删除成功')
    } catch (error) {
      ElMessage.error('删除失败，请重试')
    }
  },
  handleRenameGroup(group) {
    state.renameDialog.info = group
    state.renameDialog.visable = true
  },
  handleSearch() {
    methods.handleFetchFavorites(state.activeId)
  },
}

onMounted(async () => {
  state.isLoading = true
  await methods.refreshGroupList()
  await methods.handleCollectGroupActive(state.favoriteGroupList[0])
})
</script>

<template>
  <ElContainer class="cl-favorites-view" v-loading="state.isLoading">
    <ElHeader class="cl-favorites-view__header">
      <section class="cl-favorites-view__header__title">
        <h3 style="margin: 0">收藏</h3>
      </section>
      <section class="cl-favorites-view__header__add">
        <ClIconButton @click="state.createFavoriteGroupDialogVisible = true" :icon="Plus" />
        <CreateFavoriteGroupDialog
          v-model="state.createFavoriteGroupDialogVisible"
          @close="state.createFavoriteGroupDialogVisible = false"
          @success="methods.handleGroupCreateSuccess"
        />
      </section>
    </ElHeader>
    <ElContainer>
      <ElAside class="cl-favorites-view__aside" width="200px">
        <ElScrollbar>
          <template v-if="state.favoriteGroupList.length > 0">
            <FavoriteGroupItem
              v-for="(item, index) in state.favoriteGroupList"
              :key="index"
              :collectionGroupName="item.name"
              :collections-length="item.count"
              :actived="state.activeId === item.id"
              :is-all-collection="item.id === 0"
              @click="methods.handleCollectGroupActive(item)"
              @delete="methods.handleDeleteGroup(item)"
              @rename="methods.handleRenameGroup(item)"
            />
            <FavoriteGroupRenameDialog
              v-model="state.renameDialog.visable"
              :group-info="state.renameDialog.info"
              @close="state.renameDialog.visable = false"
              @success="methods.refreshGroupList"
            />
          </template>
          <template v-else>
            <FavoriteGroupItem collectionGroupName="全部收藏" is-all-collection actived />
          </template>
        </ElScrollbar>
      </ElAside>
      <ElMain class="cl-favorites-view__main">
        <ElTable :data="state.favoriteList" height="100%" style="width: 100%">
          <ElTableColumn>
            <template #header>
              <section style="display: flex; justify-content: space-between; width: 100%">
                <ElText>名称</ElText>
                <ElInput
                  v-model="state.favoriteListState.q"
                  :prefix-icon="Search"
                  @keyup.enter="methods.handleSearch"
                  placeholder="搜索"
                  size="small"
                  style="width: 8rem"
                />
              </section>
            </template>
            <template #default="scope">
              <div class="table-column">
                <section
                  class="table-column__icon"
                  @click="methods.toTarget(scope.row)"
                  style="cursor: pointer"
                >
                  <ElIcon size="18" style="margin-right: 0.5rem">
                    <component :is="favoriteTypeIcon[scope.row.target_type]" />
                  </ElIcon>
                  {{ scope.row.target_info.title }}
                </section>
                <section>
                  <FavoriteTool
                    :is-favorite="true"
                    :target-id="scope.row.target_id"
                    :target-type="scope.row.target_type"
                    @update="methods.handleFetchFavorites(state.activeId)"
                  />
                </section>
              </div>
            </template>
          </ElTableColumn>
        </ElTable>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style lang="scss" scoped>
.cl-favorites-view {
  .cl-favorites-view__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 0;
    padding-bottom: 1.5rem;

    height: auto;

    .cl-favorites-view__header__add {
      display: flex;
      align-items: center;
    }
  }

  .cl-favorites-view__aside {
    padding: 0 0.5rem;
    border-right: 1px solid var(--el-border-color);
  }

  .cl-favorites-view__main {
    padding: 0 0.5rem;

    .table-column {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .table-column__icon {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
