<script setup>
import { reactive, ref } from 'vue'
import { ElButton, ElDialog, ElInput, ElMessage } from 'element-plus'
import { requestUpdateFavoriteGroup } from '@/api/favorite'

const FormRef = ref(null)

const emits = defineEmits(['success', 'error', 'close'])

const state = reactive({
  DialogVisible: false,

  favoriteGroupDialogIsLoading: false,
  DialogIsLoading: false,

  form: {
    id: '',
    name: '',
    desc: '',
  },
})

const { groupInfo } = defineProps({
  modelValue: Boolean,
  targetId: Number,
  targetType: String,
  groupInfo: Object,
})

const methods = {
  async handleSubmit() {
    await FormRef.value?.validate()

    state.DialogIsLoading = true

    try {
      await requestUpdateFavoriteGroup(state.form)

      state.DialogIsLoading = false
      emits('success')
      methods.handleDialogClose()

      ElMessage.success('修改成功')
    } catch (err) {
      emits('error', err)

      ElMessage.error('修改失败，请重试')
    } finally {
      state.DialogIsLoading = false
    }
  },
  handleDialogClose() {
    if (state.DialogIsLoading) return

    methods.handleReset()
    FormRef.value?.resetFields()
    emits('close')
  },

  handleReset() {
    Object.assign(state.form, {
      name: '',
      desc: '',
    })
  },
  handleOpen() {
    Object.assign(state.form, groupInfo)
  },
}
</script>

<template>
  <ElDialog
    :model-value="modelValue"
    :show-close="false"
    @open="methods.handleOpen"
    @close="methods.handleDialogClose"
    v-loading="state.DialogIsLoading"
  >
    <template #title>重命名分组</template>

    <template #default>
      <ElForm :model="state.form" ref="FormRef" label-width="80px">
        <ElFormItem
          label="分组名称"
          prop="name"
          :rules="[{ required: true, message: '请输入分组名称', trigger: 'blur' }]"
        >
          <ElInput
            v-model="state.form.name"
            placeholder="请输入分组名称"
            :disabled="state.DialogIsLoading"
          />
        </ElFormItem>
        <ElFormItem label="分组描述" prop="desc">
          <ElInput
            v-model="state.form.desc"
            type="textarea"
            placeholder="请输入分组描述"
            :disabled="state.DialogIsLoading"
          />
        </ElFormItem>
      </ElForm>
    </template>

    <template #footer>
      <ElButton
        type="primary"
        :DialogIsLoading="state.DialogIsLoading"
        :disabled="state.DialogIsLoading"
        @click="methods.handleSubmit"
        style="width: 100%"
      >
        提交
      </ElButton>
    </template>
  </ElDialog>
</template>
