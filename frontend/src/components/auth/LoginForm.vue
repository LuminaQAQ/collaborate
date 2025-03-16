<template>
  <el-form ref="formRef" :model="loginForm" label-width="auto" class="demo-dynamic" width="100%">
    <el-form-item
      prop="email"
      label="邮箱"
      :rules="[
        {
          required: true,
          message: '请输入邮箱',
          trigger: 'blur',
        },
      ]"
    >
      <el-input v-model="loginForm.email" />
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
      <el-input v-model="loginForm.pwd" type="password" show-password />
    </el-form-item>
    <el-form-item>
      <div style="margin: 0 auto">
        <el-button type="primary" @click="submitForm(formRef)">登录</el-button>
        <el-button @click="toRegister(formRef)">注册</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { EmitFn, Reactive, reactive, Ref, ref } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { requestLogin } from '@/api/auth'
import { useUserStore } from '@/stores/user'
import router from '@/router'

interface FormItem {
  email: string
  pwd: string
}

interface User {
  username: string
  avatar: string
}

interface UserStore {
  token: Ref<string>
  user: Reactive<User>
}

const userStore: UserStore = useUserStore()

const emits: EmitFn = defineEmits(['toRegister'])

const formRef = ref<FormInstance>()
const loginForm = reactive<FormItem>({
  email: '1710884533@qq.com',
  pwd: '123456',
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      requestLogin({
        email: loginForm.email,
        pwd: loginForm.pwd,
      })
        .then((res) => {
          const { token, username, avatar, created_at } = res.data
          userStore.token = token
          userStore.user.username = username
          userStore.user.avatar = avatar
          userStore.user.created_at = created_at
          localStorage.setItem('token', token)

          ElMessage.success('登录成功，即将跳转至主页...')

          router.replace('/dashboard')
        })
        .catch((err) => console.log())
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
