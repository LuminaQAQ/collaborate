<script setup>
import { Star, StarFilled } from '@element-plus/icons-vue/dist/index.js'
import ClIconButton from '@/components/common/ClIconButton.vue'
import { reactive, ref } from 'vue'
import ClListItem from '@/components/common/ClListItem.vue'
import {
  requestAddToFavorite,
  requestCreateFavoriteGroup,
  requestDelFavorite,
  requestFetchFavoriteGroup,
} from '@/api/favorite'
import { ElButton, ElDialog, ElInput, ElMessage, ElScrollbar, ElText } from 'element-plus'
import CreateFavoriteGroupDialog from './CreateFavoriteGroupDialog.vue'

const createFavoriteGroupFormRef = ref(null)

const emits = defineEmits(['update'])

const state = reactive({
  favoriteGroupDialogVisible: false,
  createFavoriteGroupDialogVisible: false,

  favoriteGroupDialogIsLoading: false,
  createFavoriteGroupDialogIsLoading: false,

  /**
   * @type {Array<{ id: string; name: string }>}
   */
  groups: [],

  form: {
    name: '',
    desc: '',
  },
})

const { targetId, targetType } = defineProps({
  isFavorite: Boolean,
  targetId: Number,
  targetType: String,
})

const methods = {
  async refreshGroupList() {
    state.favoriteGroupDialogIsLoading = true
    try {
      const favoriteGroup = await requestFetchFavoriteGroup()

      state.groups = favoriteGroup.data
    } catch (error) {
      ElMessage.error('获取分组列表失败，请重试')
    } finally {
      state.favoriteGroupDialogIsLoading = false
    }
  },
  handleFavoriteGroupDialogOpen() {
    state.favoriteGroupDialogVisible = true

    methods.refreshGroupList()
  },
  /**
   *
   * @param {Number} id
   */
  async favorite(id = null) {
    try {
      await requestAddToFavorite({
        favorite_group_id: id,
        target_id: targetId,
        target_type: targetType,
      })
      state.favoriteGroupDialogVisible = false

      emits('update', true)

      ElMessage.success('收藏成功')
    } catch (error) {
      ElMessage.error('收藏失败，请重试')
    }
  },
  async unfavorite() {
    try {
      await requestDelFavorite({
        target_id: targetId,
        target_type: targetType,
      })

      emits('update', false)

      ElMessage.success('取消收藏成功')
    } catch (error) {
      ElMessage.error('取消收藏失败，请重试')
    }
  },
  async createFavoriteGroup() {
    await createFavoriteGroupFormRef.value?.validate()

    state.createFavoriteGroupDialogIsLoading = true

    try {
      await requestCreateFavoriteGroup(state.form)
      state.createFavoriteGroupDialogVisible = false
      methods.refreshGroupList()

      ElMessage.success('分组创建成功')
    } catch (err) {
      ElMessage.error('分组创建失败，请重试')
    } finally {
      state.createFavoriteGroupDialogIsLoading = false
    }
  },
  handleCreateFavoriteGroupDialogClose() {
    if (state.createFavoriteGroupDialogIsLoading) return

    state.createFavoriteGroupDialogVisible = false
    methods.handleReset()
    createFavoriteGroupFormRef.value?.resetFields()
  },

  handleReset() {
    state.form = {
      name: '',
      desc: '',
    }
  },
}
</script>

<template>
  <ClIconButton
    v-if="isFavorite"
    @click="methods.unfavorite"
    title="收藏"
    :icon="StarFilled"
    color="yellow"
    style="--cl-icon-button-size: 21px"
  />
  <ClIconButton v-else @click="methods.handleFavoriteGroupDialogOpen" title="收藏" :icon="Star" />

  <el-dialog v-model="state.favoriteGroupDialogVisible">
    <template #header>
      <span>
        请选择分组 <small>或者</small>
        <ElButton type="primary" link @click="state.createFavoriteGroupDialogVisible = true"
          >新建分组</ElButton
        >
      </span>
    </template>

    <div class="favorite-group-dialog__body" v-loading="state.favoriteGroupDialogIsLoading">
      <ElScrollbar>
        <ClListItem
          class="cl-list-item--border-bottom cl-list-item--hover-item"
          v-for="(group, index) in state.groups"
          :key="group.id"
          @click="methods.favorite(group.id)"
        >
          <template #title>
            <template v-if="index === 0">
              我的收藏 <el-tag type="primary" size="small" round>默认</el-tag>
            </template>
            <template v-else>{{ group.name }}</template>
          </template>
          <template #content>
            <template v-if="index === 0"></template>
            <template v-else>
              <ElText>{{ group.desc || '暂无简介' }}</ElText>
            </template>
          </template>
        </ClListItem>
      </ElScrollbar>
    </div>
  </el-dialog>

  <CreateFavoriteGroupDialog
    v-model="state.createFavoriteGroupDialogVisible"
    @close="state.createFavoriteGroupDialogVisible = false"
    @success="methods.handleCreateFavoriteGroupDialogClose"
    v-loading="state.createFavoriteGroupDialogIsLoading"
  />
</template>

<style scoped>
.favorite-group-dialog__body {
  max-height: 20rem;
  overflow-y: auto;
}
</style>
