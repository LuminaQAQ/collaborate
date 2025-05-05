<script setup lang="ts">
import { Star, StarFilled } from '@element-plus/icons-vue/dist/index.js'
import ClIconButton from '../common/ClIconButton.vue'
import { reactive } from 'vue'
import ClListItem from '../common/ClListItem.vue'
import { requestFetchFavoriteGroup } from '@/api/favorite'
import { ElButton, ElEmpty, ElIcon } from 'element-plus'

const state = reactive({
  dialogVisible: false,
  /**
   * @type {Array<{ id: string; name: string }>}
   */
  groups: [],
})

defineProps({
  isFavorite: Boolean,
})

const methods = {
  async favorite() {
    try {
      const favoriteGroup = await requestFetchFavoriteGroup()

      console.log(favoriteGroup)
    } catch (error) {}
  },
  unfavorite() {
    // TODO: 取消收藏
  },
  async addFavoriteGroup() {
    // TODO: 添加收藏列表
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
    style="--cl-icon-button-size: 25px"
  />
  <ClIconButton v-else @click="state.dialogVisible = true" title="收藏" :icon="Star" />

  <el-dialog v-model="state.dialogVisible" @open="methods.favorite">
    <template v-if="state.groups.length > 0">
      <ClListItem v-for="group in state.groups" :key="group.id" :title="group.name" />
    </template>
    <template v-else>
      <ElEmpty description="收藏分组为空"></ElEmpty>
    </template>

    <template #header>
      <span>请选择分组 <small>或者</small> <ElButton link>新建分组</ElButton> </span>
    </template>
  </el-dialog>
</template>
