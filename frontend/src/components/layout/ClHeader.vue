<script lang="ts" setup>
import { requestHomeData } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { onMounted, ref } from 'vue'

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

onMounted(() => {
  requestHomeData()
    .then((res) => {
      const { username, avatar } = res.data

      userStore.user.username = username
      userStore.user.avatar = avatar
    })
    .catch((err) => {
      console.log(err)
    })
})
</script>

<template>
  <el-header>
    <div class="cl-header-left-wrap">
      <div class="cl-logo-wrap">
        <img src="/favicon.ico" alt="logo" />
      </div>
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
            <el-dropdown-item :icon="Plus">Action 1</el-dropdown-item>
            <el-dropdown-item :icon="CirclePlusFilled"> Action 2 </el-dropdown-item>
            <el-dropdown-item :icon="CirclePlus">Action 3</el-dropdown-item>
            <el-dropdown-item :icon="Check">Action 4</el-dropdown-item>
            <el-dropdown-item :icon="CircleCheck">Action 5</el-dropdown-item>
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

    .cl-logo-wrap {
      width: 1.75rem;
      height: 1.75rem;
      object-fit: cover;
      margin-right: 0.5rem;

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
