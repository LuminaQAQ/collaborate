<template>
  <el-tabs
    type="border-card"
    class="demo-tabs"
    v-model="activeTab"
    width="100%"
    @tab-change="tabChange"
  >
    <el-tab-pane label="登录" name="login">
      <LoginForm @to-register="toRegister" />
    </el-tab-pane>
    <el-tab-pane label="注册" name="register">
      <RegisterForm @to-login="toLogin" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()

let activeTab = ref('login')

const toRegister = () => {
  activeTab.value = 'register'
}

const toLogin = () => {
  activeTab.value = 'login'
}

const routrtHashList = ['login', 'register']

const tabChange = (tabName) => {
  router.replace(`#${tabName}`)
}

onMounted(() => {
  const tab = route.hash
  if (routrtHashList.includes(tab)) {
    activeTab.value = tab
  } else {
    activeTab.value = 'login'
    router.replace('#login')
  }
})
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
