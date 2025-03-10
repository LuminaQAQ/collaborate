<template>
  <el-form ref="formRef" :model="registerForm" label-width="auto" class="demo-dynamic" width="100">
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
      prop="code"
      label="验证码"
      :rules="[
        {
          required: true,
          message: '请输入验证码',
          trigger: 'blur',
        },
      ]"
    >
      <el-input>
        <template #append>
          <el-button
            type="primary"
            @click="sendVerifyCode"
            :loading="verifyCodeStatus.sendCodeLoaded"
            :style="{ color: verifyCodeStatus.sendCodeLoaded ? 'inherit' : '#409eff' }"
          >
            {{ verifyCodeStatus.sendCodeText }}
          </el-button>
        </template>
      </el-input>
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
import { useUserStore } from '@/stores/user'
import { request } from '@/utils/request.js'

interface FormItem {
  email: string
  pwd: string
  code: string
}

interface VerifyCode {
  sendCodeLoaded: boolean
  sendCodeText: string
}

const emits: EmitFn = defineEmits(['toLogin'])

const verifyCodeStatus = reactive<VerifyCode>({
  sendCodeLoaded: false,
  sendCodeText: '发送验证码',
})

const formRef = ref<FormInstance>()
const registerForm = reactive<FormItem>({
  email: '1710884533@qq.com',
  pwd: '123456',
  code: '',
})
const sendVerifyCode = () => {
  if (verifyCodeStatus.sendCodeLoaded) return

  request('/api/verifyCode', {
    method: 'post',
    data: {
      email: registerForm.email,
    },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

  verifyCodeStatus.sendCodeLoaded = true
  let waitTime = 60
  verifyCodeStatus.sendCodeText = `${(waitTime -= 1)}秒后可重新发送`
  let timer = setInterval(() => {
    verifyCodeStatus.sendCodeText = `${(waitTime -= 1)}秒后可重新发送`
    if (waitTime <= 0) {
      clearInterval(timer)
      verifyCodeStatus.sendCodeLoaded = false
      verifyCodeStatus.sendCodeText = '发送验证码'
      timer = null
    }
  }, 1000)
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      request('/api/register', {
        method: 'post',
        data: registerForm,
      })
        .then((res) => console.log(res))
        .catch((err) => console.error(err))
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
