<template>
  <el-tabs type="border-card" class="demo-tabs" v-model="activeTab" width="100%">
    <el-tab-pane label="登录" name="login">
      <LoginForm @to-register="toRegister" />
    </el-tab-pane>
    <el-tab-pane name="register" label="注册">
      <RegisterForm @to-login="toLogin" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'

let activeTab = ref('register')

const toRegister = () => {
  activeTab.value = 'register'
}

const toLogin = () => {
  activeTab.value = 'login'
}
</script>

<style>
.demo-tabs {
  position: absolute;
  left: 50%;
  top: 50%;

  min-width: 20rem;

  transform: translate(-50%, -50%);
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}
.demo-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>
