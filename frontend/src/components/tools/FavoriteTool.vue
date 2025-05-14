<script setup>
import { Star, StarFilled } from '@element-plus/icons-vue/dist/index.js'
import ClIconButton from '../common/ClIconButton.vue'
import { reactive, ref } from 'vue'
import ClListItem from '../common/ClListItem.vue'
import {
  requestAddToFavorite,
  requestCreateFavoriteGroup,
  requestFetchFavoriteGroup,
} from '@/api/favorite'
import { ElButton, ElDialog, ElEmpty, ElIcon, ElInput, ElMessage, ElText } from 'element-plus'

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

const { docId } = defineProps({
  isFavorite: Boolean,
  docId: Number,
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
  async favorite(id) {
    // TODO: 收藏
    try {
      await requestAddToFavorite({
        doc_id: docId,
        favorite_group_id: id,
      })

      emits('update', true)
    } catch (error) {}
  },
  unfavorite() {
    // TODO: 取消收藏
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
  handleCreateFavoriteGroupDialogClose(done) {
    if (state.createFavoriteGroupDialogIsLoading) return

    done()
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
    style="--cl-icon-button-size: 25px"
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

    <div v-loading="state.favoriteGroupDialogIsLoading">
      <template v-if="state.groups.length > 0">
        <ClListItem
          class="cl-list-item--border-bottom cl-list-item--hover-item"
          v-for="group in state.groups"
          :key="group.id"
          @click="methods.favorite(group.id)"
        >
          <template #title>{{ group.name }}</template>
          <template #content>
            <ElText>{{ group.desc || '暂无简介' }}</ElText>
          </template>
        </ClListItem>
      </template>
      <template v-else>
        <ElEmpty description="收藏分组为空"></ElEmpty>
      </template>
    </div>
  </el-dialog>

  <ElDialog
    v-model="state.createFavoriteGroupDialogVisible"
    :show-close="false"
    :before-close="methods.handleCreateFavoriteGroupDialogClose"
    v-createFavoriteGroupDialogIsLoading="state.createFavoriteGroupDialogIsLoading"
  >
    <template #title>新建分组</template>

    <template #default>
      <ElForm :model="state.form" ref="createFavoriteGroupFormRef" label-width="80px">
        <ElFormItem
          label="分组名称"
          prop="name"
          :rules="[{ required: true, message: '请输入分组名称', trigger: 'blur' }]"
        >
          <ElInput
            v-model="state.form.name"
            placeholder="请输入分组名称"
            :disabled="state.createFavoriteGroupDialogIsLoading"
          />
        </ElFormItem>
        <ElFormItem label="分组描述" prop="desc">
          <ElInput
            v-model="state.form.desc"
            type="textarea"
            placeholder="请输入分组描述"
            :disabled="state.createFavoriteGroupDialogIsLoading"
          />
        </ElFormItem>
      </ElForm>
    </template>

    <template #footer>
      <ElButton
        type="primary"
        :createFavoriteGroupDialogIsLoading="state.createFavoriteGroupDialogIsLoading"
        :disabled="state.createFavoriteGroupDialogIsLoading"
        @click="methods.createFavoriteGroup"
        style="width: 100%"
      >
        创建
      </ElButton>
    </template>
  </ElDialog>
</template>
