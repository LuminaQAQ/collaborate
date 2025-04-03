<script setup>
import { onMounted, onUnmounted, reactive, watch } from 'vue'

import {
  ArrowRightBold,
  ArrowLeftBold,
  Notebook,
  Histogram,
  MoreFilled,
  List,
  Setting,
  Lock,
  Search,
  Plus,
  Document,
  Folder,
} from '@element-plus/icons-vue'
import {
  ElContainer,
  ElDivider,
  ElEmpty,
  ElHeader,
  ElIcon,
  ElInput,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElScrollbar,
  ElSkeleton,
  ElSkeletonItem,
  ElSubMenu,
} from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useDocStore } from '@/stores/doc'
import { requestCreateDoc } from '@/api/create'
import DocMenuItem from '../common/DocMenuItem.vue'
import MenuTree from '../common/MenuTree.vue'
import AddDoc from '../dropdown/AddDoc.vue'
import AddGroup from '../dropdown/AddGroup.vue'
import CreateDoc from '../tools/CreateDoc.vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const docStore = useDocStore()

const state = reactive({
  isCollapse: true,
  isMenuHover: true,
  searchValue: '',
  key: route.fullPath,
  bookOptionsDropdown: [
    {
      label: '权限',
      icon: Lock,
      click: () => {},
    },
    {
      label: '统计',
      icon: Histogram,
      click: () => {},
      permission: ['book:owner'],
    },
    {
      label: '目录管理',
      icon: List,
      click: () => {},
      permission: ['book:owner', 'book:editor'],
    },
    {
      label: '更多设置',
      icon: Setting,
      click: () => {},
      permission: ['book:owner', 'book:editor'],
    },
  ],
})

const methods = {
  /**
   * @typedef {Object} option
   * @property {String} label
   * @property {Function} click
   * @property {Array<String>} permission
   * @returns {option}
   */
  /**
   * @param {Array<option>} options
   */
  handlePermission(options) {
    return options.filter((item) => {
      if (!item.permission) return true

      const isLegal = item.permission.some((v) => {
        const [type, permission] = v.split(':')
        return docStore.currentDocState.role[type] === permission
      })

      return isLegal
    })
  },
}

watch(route, () => {
  state.key = route.fullPath
})

onMounted(async () => {
  try {
    await docStore.fetchDocList()
    state.bookOptionsDropdown = methods.handlePermission(state.bookOptionsDropdown)
    docStore.currentDocState.isLoading = false
  } catch (error) {}
})

onUnmounted(() => {
  docStore.restoreCurrentState()
})
</script>

<template>
  <ElContainer>
    <el-aside
      :width="state.isCollapse ? '220px' : '1px'"
      @mouseover="state.isMenuHover = true"
      @mouseout="state.isMenuHover = false"
    >
      <!-- 顶部面包屑导航 -->
      <ElHeader>
        <section class="home-icon-wrap" @click="router.push('/')">
          <div class="favicon-wrap"><img src="/favicon.ico" alt="" /></div>
          <span>云迹</span>
        </section>
      </ElHeader>

      <!-- 顶部-文档库相关：文档库名、文档设置 -->
      <ElHeader style="display: flex; align-items: center">
        <ElSkeleton animated :loading="docStore.currentDocState.isLoading">
          <template #template>
            <ElSkeletonItem variant="h1" />
          </template>
          <template #default>
            <section
              class="book-home-btn"
              @click="router.push(`/${route.params.user}/${route.params.book}`)"
            >
              <ElIcon :size="22" color="#409eff" style="margin-right: 0.5rem"><Notebook /></ElIcon>
              <span>{{ docStore.currentDocState.bookName }}</span>
            </section>
            <el-dropdown class="cl-book-dropdown" trigger="click">
              <span class="el-dropdown-link">
                <el-icon class="el-icon--right" size="18"><MoreFilled /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in state.bookOptionsDropdown"
                    :key="item.label"
                    :icon="item.icon"
                    :v-permission="item.permission"
                    @click="item.click"
                  >
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </ElSkeleton>
      </ElHeader>

      <ElDivider />

      <!-- 顶部-搜索 -->
      <ElHeader class="cl-search-addtion-wrap">
        <ElSkeleton animated :loading="docStore.currentDocState.isLoading">
          <template #template>
            <div style="display: flex">
              <el-skeleton-item
                variant="h1"
                style="width: 80%; height: 1.5rem; margin: 0.5rem 0.25rem"
              />
              <el-skeleton-item
                variant="h1"
                style="width: 20%; height: 1.5rem; margin: 0.5rem 0.25rem"
              />
            </div>
          </template>

          <template #default>
            <el-input v-model="state.searchValue" placeholder="搜索" :prefix-icon="Search" />
            <el-dropdown
              class="cl-addtion-dropdown"
              trigger="hover"
              v-permission="['book:owner', 'book:editor']"
            >
              <span class="el-dropdown-link">
                <el-icon class="el-icon--right" size="16"><Plus /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <AddDoc />
                  <AddGroup />
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </ElSkeleton>
      </ElHeader>

      <!-- 文档列表  -->
      <ElScrollbar>
        <ElSkeleton animated :loading="docStore.currentDocState.isLoading">
          <template #template>
            <el-skeleton-item
              variant="h3"
              v-for="item in 5"
              style="height: 1.5rem; margin: 0.5rem 0.25rem"
            />
          </template>

          <template #default>
            <template v-if="docStore.currentDocState.docList.length > 0">
              <ElMenu class="el-menu-vertical-demo" :router="true" :default-active="route.path">
                <MenuTree
                  v-for="item in docStore.currentDocState.docList"
                  :book="item"
                  :key="item.id"
                />
              </ElMenu>
            </template>
          </template>
        </ElSkeleton>
      </ElScrollbar>

      <!-- 侧边栏展缩按钮 -->
      <el-icon
        :class="['collapse-icon', state.isCollapse ? '' : 'is-close']"
        @click="state.isCollapse = !state.isCollapse"
        v-show="state.isMenuHover"
      >
        <ArrowLeftBold v-if="state.isCollapse" />
        <ArrowRightBold v-else />
      </el-icon>
    </el-aside>

    <ElMain>
      <RouterView :key="state.key" />
    </ElMain>
  </ElContainer>
</template>

<style lang="scss" scoped>
.el-container {
  height: 100%;
}

.el-aside,
.el-menu {
  position: relative;
  border-right: 0;
  box-sizing: border-box;
  overflow-x: hidden;

  transition: width 0.3s;
}

.el-aside {
  height: 100%;
  padding: 0 0.25rem;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--el-menu-border-color);
}

.el-header {
  --el-header-padding: 0.5rem 0.75rem;
  height: auto;
}

.el-divider {
  margin: 0.5rem 0;
}

.el-breadcrumb {
  display: flex;
  align-items: center;
}

.el-dropdown {
  :focus-visible {
    outline: unset;
  }
}

.el-menu {
  overflow-y: auto;
}

.home-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .favicon-wrap {
    --size: 1.5rem;
    width: var(--size);
    height: var(--size);

    object-fit: cover;
    margin-right: 0.5rem;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.collapse-icon {
  position: absolute;
  top: 50%;
  right: 0;

  padding: 0.5rem 0;
  background-color: #f2f2f2;
  border-radius: 999px;

  transform: translate(0, -100%);
  cursor: pointer;

  &.is-close {
    position: fixed;
    left: 0;
  }
}

.cl-book-dropdown {
  margin-left: auto;
  cursor: pointer;

  .el-icon--right {
    margin: 0;
    padding: 0.3rem;
  }
}

.cl-search-addtion-wrap {
  display: flex;
  align-items: center;
  // padding: 0 0.75rem;
  cursor: pointer;

  .el-icon--right {
    margin: 0;
    margin-left: 1rem;
    padding: 0.5rem;
    border: 1px solid var(--el-border-color);
    border-radius: 5px;
  }
}

.book-home-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
