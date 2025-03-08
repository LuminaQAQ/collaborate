<template>
  <el-form ref="formRef" :model="loginForm" label-width="auto" class="demo-dynamic" width="100%">
    <el-form-item
      prop="account"
      label="账号"
      :rules="[
        {
          required: true,
          message: '请输入账号',
          trigger: 'blur',
        },
      ]"
    >
      <el-input v-model="loginForm.account" />
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
      <el-input v-model="loginForm.pwd" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)">登录</el-button>
      <el-button @click="toRegister(formRef)">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { EmitFn, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

interface FormItem {
  account: string
  pwd: string
}

const emits: EmitFn = defineEmits(['toRegister'])

const formRef = ref<FormInstance>()
const loginForm = reactive<FormItem>({
  account: '',
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

const toRegister = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.resetFields()
  emits('toRegister')
}
</script>

<style></style>
