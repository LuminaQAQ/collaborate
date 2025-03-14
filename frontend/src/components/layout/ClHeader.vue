<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const state = ref('')

const username = ref('user')
const dropdownBoardIsShow = ref(false)

const userDropdownVisibleChange = (flag) => {
  dropdownBoardIsShow.value = flag
}

interface LinkItem {
  value: string
  link: string
}

const links = ref<LinkItem[]>([])

const loadAll = () => {
  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' },
  ]
}

let timeout: ReturnType<typeof setTimeout>
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  const results = queryString ? links.value.filter(createFilter(queryString)) : links.value

  clearTimeout(timeout)
  timeout = setTimeout(() => {
    cb(results)
  }, 3000 * Math.random())
}
const createFilter = (queryString: string) => {
  return (restaurant: LinkItem) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

const handleSelect = (item: Record<string, any>) => {
  console.log(item)
}

onMounted(() => {
  links.value = loadAll()
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
        @select="handleSelect"
      />
    </div>
    <div class="cl-header-right-wrap">
      <el-dropdown trigger="click" size="large" @visible-change="userDropdownVisibleChange">
        <span class="el-dropdown-link">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <span class="user-name-wrap"> {{ username }}</span>
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
