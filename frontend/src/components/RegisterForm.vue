<template>
  <el-form ref="formRef" :model="registerForm" label-width="auto" class="demo-dynamic" width="100%">
    <el-form-item
      prop="email"
      label="邮箱"
      :rules="[
        {
          required: true,
          message: '请输入邮箱',
          trigger: 'blur',
        },
        {
          type: 'email',
          message: '请输入正确的邮箱',
          trigger: ['blur', 'change'],
        },
      ]"
    >
      <el-input v-model="registerForm.email" />
    </el-form-item>
    <el-form-item
      prop="pwd"
      label="密码"
      :rules="[
        {
          required: true,
          message: '请输入密码',
          trigger: 'blur',
        },
      ]"
    >
      <el-input v-model="registerForm.pwd" type="password" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)" style="margin: 0 auto">
        登录/注册
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { EmitFn, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

interface FormItem {
  email: string
  pwd: string
}

const emits: EmitFn = defineEmits(['toLogin'])

const formRef = ref<FormInstance>()
const registerForm = reactive<FormItem>({
  email: '',
  pwd: '',
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
    }
  })
}

const toLogin = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.resetFields()
  emits('toLogin')
}
</script>

<style></style>
