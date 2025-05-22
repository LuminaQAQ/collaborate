<script setup>
import { reactive, ref } from 'vue'
import { requestCreateFavoriteGroup } from '@/api/favorite'
import { ElButton, ElDialog, ElInput, ElMessage } from 'element-plus'

const createFavoriteGroupFormRef = ref(null)

const emits = defineEmits(['success', 'error'])

const state = reactive({
  createFavoriteGroupDialogVisible: false,

  favoriteGroupDialogIsLoading: false,
  createFavoriteGroupDialogIsLoading: false,

  form: {
    name: '',
    desc: '',
  },
})

defineProps({
  modelValue: Boolean,
  isFavorite: Boolean,
  targetId: Number,
  targetType: String,
})

const methods = {
  async createFavoriteGroup() {
    await createFavoriteGroupFormRef.value?.validate()

    state.createFavoriteGroupDialogIsLoading = true

    try {
      await requestCreateFavoriteGroup(state.form)
      state.createFavoriteGroupDialogVisible = false
      emits('success')

      ElMessage.success('分组创建成功')
    } catch (err) {
      emits('error')

      ElMessage.error('分组创建失败，请重试')
    } finally {
      state.createFavoriteGroupDialogIsLoading = false
    }
  },
  handleCreateFavoriteGroupDialogClose() {
    if (state.createFavoriteGroupDialogIsLoading) return

    methods.handleReset()
    createFavoriteGroupFormRef.value?.resetFields()
  },

  handleReset() {
    Object.assign(state.form, {
      name: '',
      desc: '',
    })
  },
}
</script>

<template>
  <ElDialog
    :model-value="modelValue"
    :show-close="false"
    @close="methods.handleCreateFavoriteGroupDialogClose"
    v-loading="state.createFavoriteGroupDialogIsLoading"
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
