<script setup lang="ts">
import { Star, StarFilled } from '@element-plus/icons-vue/dist/index.js'
import ClIconButton from '../common/ClIconButton.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { reactive, ref } from 'vue'
import ClListItem from '../common/ClListItem.vue'

const form = reactive({
  selectedGroup: '',
})

const dialogVisible = ref(false)
/**
 * @type {Array<{ id: string; name: string }>}
 */
const groups = ref([])

defineProps({
  isCollection: Boolean,
})

const methods = {
  favorite() {
    
  },
  unfavorite() {
    // TODO: 取消收藏
  },
  resetDialog() {
    Object.assign(form, {
      selectedGroup: '',
    })
  },
  onConfirm() {
    if (!form.selectedGroup) {
      ElMessage.warning('请先选择一个分组')
      return
    }
    // 在此处执行收藏逻辑，比如调用接口：
    // await api.favoriteItem({ groupId: form.selectedGroup, itemId })
    // ElMessage.success(`已收藏到分组：${getGroupName(form.selectedGroup)}`)
    dialogVisible.value = false
  },
}
</script>

<template>
  <ClIconButton
    v-if="isCollection"
    @click="methods.unfavorite"
    title="收藏"
    :icon="StarFilled"
    color="yellow"
    style="--cl-icon-button-size: 25px"
  />
  <ClIconButton v-else @click="dialogVisible = true" title="收藏" :icon="Star" />

  <el-dialog
    v-model="dialogVisible"
    title="请选择分组"
    width="400px"
    @open="methods.favorite"
    @close="methods.resetDialog"
  >
    <ClListItem v-for="group in groups" :key="group.id" :title="group.name" />
  </el-dialog>
</template>
