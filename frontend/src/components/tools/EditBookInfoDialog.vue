<script setup>
import { reactive, watch, computed, ref, onMounted } from 'vue'
import { ElDialog, ElInput, ElButton, ElForm, ElFormItem, ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  bookInfo: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['submit', 'close'])

const formRef = ref()

const isLoading = ref(false)
const form = reactive({
  name: '',
  description: '',
})

const rules = {
  bookName: [
    { required: true, message: '请输入知识库名称', trigger: 'blur' },
    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
  ],
  bookDesc: [{ max: 30, message: '最多 30 个字符', trigger: 'blur' }],
}

const onSubmitError = () => {
  isLoading.value = false
}

const onSubmitSuccess = () => {
  isLoading.value = false
  methods.handleClose()
}

const methods = {
  handleSubmit() {
    if (!formRef.value) return

    const { name, description } = props.bookInfo

    if (form.name === name && form.description === description) {
      onSubmitSuccess()
      return ElMessage.info('未做任何修改')
    }

    formRef.value.validate(async (valid) => {
      if (valid) {
        isLoading.value = true

        emits(
          'submit',
          {
            id: props.bookInfo.id,
            name: form.name?.trim(),
            description: form.description?.trim(),
          },
          onSubmitSuccess,
          onSubmitError,
        )
      }
    })
  },
  resetForm() {
    formRef.value?.resetFields()
    Object.assign(form, {
      name: '',
      description: '',
    })
  },
  handleOpen() {
    const { name, description } = props.bookInfo
    form.name = name
    form.description = description
  },
  handleClose() {
    emits('close')
    methods.resetForm()
  },
}

onMounted(() => {
  methods.handleOpen()
})
</script>

<template>
  <ElDialog
    :model-value="modelValue"
    :close-on-click-modal="false"
    @open="methods.handleOpen"
    @close="methods.handleClose"
  >
    <template #header> 编辑信息 </template>

    <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
      <ElFormItem label="知识库名称" prop="name" required>
        <ElInput
          v-model="form.name"
          placeholder="请输入知识库名称"
          maxlength="10"
          show-word-limit
        />
      </ElFormItem>
      <ElFormItem label="知识库简介（选填）" prop="description">
        <ElInput
          v-model="form.description"
          type="textarea"
          placeholder="请输入简介"
          maxlength="30"
          :autosize="{ minRows: 4, maxRows: 8 }"
          resize="none"
          show-word-limit
        />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton type="primary" :loading="isLoading" @click="methods.handleSubmit"> 提交 </ElButton>
      <ElButton @click="methods.handleClose">取消</ElButton>
    </template>
  </ElDialog>
</template>

<style scoped></style>
