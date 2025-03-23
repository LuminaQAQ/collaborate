<script setup>
import { reactive, watch } from 'vue'

import {
  ArrowRightBold,
  ArrowLeftBold,
  Notebook,
  Histogram,
  MoreFilled,
  List,
  Setting,
  Lock,
  HomeFilled,
  Search,
  Plus,
  Document,
  Folder,
} from '@element-plus/icons-vue'
import { ElContainer, ElDivider, ElHeader, ElIcon, ElInput, ElMain, ElMenu } from 'element-plus'
import { useRoute } from 'vue-router'
import { useDocStore } from '@/stores/doc'
import router from '@/router'
import { requestCreateDoc } from '@/api/create'

const route = useRoute()
const docStore = useDocStore()

const state = reactive({
  isCollapse: true,
  isMenuHover: true,
  searchValue: '',
  key: route.fullPath,
})

const methods = {
  handleCreateDoc: async () => {
    const { user, book } = route.params
    try {
      const res = await requestCreateDoc({ book_id: book })
      await docStore.fetchDocList()
      router.push(`/${user}/${book}/${res.data.doc_id}`)
    } catch {}
  },
}

docStore.fetchDocList()

watch(route, () => {
  state.key = route.fullPath
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
              <el-dropdown-item :icon="Lock">权限</el-dropdown-item>
              <el-dropdown-item :icon="Histogram">统计</el-dropdown-item>
              <el-dropdown-item :icon="List">目录管理</el-dropdown-item>
              <el-dropdown-item :icon="Setting">更多设置</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </ElHeader>

      <ElDivider />

      <!-- 顶部-搜索 -->
      <ElHeader class="cl-search-addtion-wrap">
        <el-input v-model="state.searchValue" placeholder="搜索" :prefix-icon="Search" />

        <el-dropdown class="cl-addtion-dropdown" trigger="hover">
          <span class="el-dropdown-link">
            <el-icon class="el-icon--right" size="16"><Plus /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="Document" @click="methods.handleCreateDoc">
                新建文档
              </el-dropdown-item>
              <el-dropdown-item :icon="Folder">新建分组</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </ElHeader>

      <!-- 文档列表  -->
      <ElMenu class="el-menu-vertical-demo" :router="true" :default-active="route.path">
        <el-menu-item
          v-for="item in docStore.currentDocState.docList"
          :index="`/${item.email}/${item.book_id}/${item.id}`"
          :key="item.id"
        >
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </ElMenu>

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
