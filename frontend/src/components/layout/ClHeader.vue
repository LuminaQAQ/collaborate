<script lang="ts" setup>
import { requestLogout } from '@/api/auth'
import { requestHomeData } from '@/api/user'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { User, SwitchButton } from '@element-plus/icons-vue/dist/index'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const userStore = useUserStore()

const state = ref('')

const dropdownBoardIsShow = ref(false)

const userDropdownVisibleChange = (flag) => {
  dropdownBoardIsShow.value = flag
}

interface LinkItem {
  value: string
  link: string
}

const createFilter = (queryString: string) => {
  return (restaurant: LinkItem) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

const querySearchAsync = () => {}

const logout = async () => {
  try {
    await requestLogout()
    localStorage.removeItem('token')
    ElMessage.success('退出成功！')
    router.replace('/login')
  } catch (error) {}
}
</script>

<template>
  <el-header>
    <div class="cl-header-left-wrap">
      <div class="cl-logo-wrap">
        <img src="@/assets/logo.svg" alt="logo" />
      </div>
      <span class="cl-product-name-wrap">云迹</span>
      <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearchAsync"
        placeholder="Please input"
      />
    </div>
    <div class="cl-header-right-wrap">
      <el-dropdown trigger="click" size="large" @visible-change="userDropdownVisibleChange">
        <span class="el-dropdown-link">
          <template v-if="userStore.user.avatar">
            <el-avatar :src="userStore.user.avatar" />
          </template>
          <template v-else>
            <el-avatar>{{ userStore.user.username }}</el-avatar>
          </template>
          <span class="user-name-wrap"> {{ userStore.user.username }}</span>
          <el-icon :class="['el-icon--right', dropdownBoardIsShow ? 'is-show' : '']">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :icon="User">个人中心</el-dropdown-item>
            <el-dropdown-item :icon="SwitchButton" @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<style lang="scss" scoped>
.el-header {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;

  .cl-header-left-wrap {
    display: flex;
    align-items: center;
    justify-content: center;

    .cl-product-name-wrap {
      font-weight: 600;
      white-space: nowrap;
      margin-right: 0.5rem;
    }

    .cl-logo-wrap {
      width: 1.75rem;
      height: 1.75rem;
      object-fit: cover;
      margin-right: 0.5rem;
      flex: 1 0 1.75rem;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .cl-header-right-wrap {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;

    .el-dropdown-link {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-name-wrap {
      padding: 0 0.5rem;
    }

    .el-icon--right {
      transition: transform 0.3s;
    }
    .is-show {
      transform: rotate(-180deg);
    }
  }
}
</style>
