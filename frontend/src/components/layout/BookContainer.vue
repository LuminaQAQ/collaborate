<script setup>
import { reactive } from 'vue'

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
} from '@element-plus/icons-vue'
import { requestDocList } from '@/api/user'
import { ElContainer, ElDivider, ElHeader, ElIcon, ElInput, ElMain, ElMenu } from 'element-plus'
import { useRoute } from 'vue-router'

const route = useRoute()

const state = reactive({
  isCollapse: true,
  isMenuHover: true,
  bookName: '',
  searchValue: '',
  docList: [],
})

requestDocList({ book_id: route.params.book }).then(
  (res) => ((state.docList = res.data.docList), (state.bookName = res.data.bookName)),
)
</script>

<template>
  <ElContainer>
    <el-aside
      :width="state.isCollapse ? '280px' : '1px'"
      @mouseover="state.isMenuHover = true"
      @mouseout="state.isMenuHover = false"
    >
      <!-- 顶部面包屑导航 -->
      <ElHeader>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">
            <div class="favicon-wrap"><img src="@/assets/logo.svg" alt="" /></div>
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/books' }"> 个人知识库 </el-breadcrumb-item>
        </el-breadcrumb>
      </ElHeader>

      <!-- 顶部-文档库相关：文档库名、文档设置 -->
      <ElHeader style="display: flex; align-items: center">
        <ElIcon :size="22" color="#409eff" style="margin-right: 0.5rem"><Notebook /></ElIcon>
        <span>{{ state.bookName }}</span>
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

      <!-- 顶部-搜索 -->
      <section class="cl-search-addtion-wrap">
        <el-input
          v-model="state.searchValue"
          size="large"
          placeholder="搜索"
          :prefix-icon="Search"
        />

        <el-dropdown class="cl-addtion-dropdown" trigger="hover">
          <span class="el-dropdown-link">
            <el-icon class="el-icon--right" size="18"><Plus /></el-icon>
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
      </section>

      <ElDivider />

      <!-- 知识库的主页菜单 -->
      <ElMenu class="cl-book-home-menu" :router="true" :default-active="route.path">
        <el-menu-item :index="`/${route.params.user}/${route.params.book}`">
          <template #title>
            <ElIcon><HomeFilled /> </ElIcon> 首页</template
          >
        </el-menu-item>
      </ElMenu>

      <!-- 文档列表  -->
      <ElMenu class="el-menu-vertical-demo" :router="true" :default-active="route.path">
        <el-menu-item
          v-for="item in state.docList"
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
      <RouterView />
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
  --el-header-padding: 1rem 20px;
  height: auto;
}

.el-breadcrumb {
  display: flex;
  align-items: center;
}

.el-menu {
  overflow-y: auto;
}

.favicon-wrap {
  width: 14px;
  height: 14px;

  object-fit: cover;

  img {
    width: 100%;
    height: 100%;
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
  border: 1px solid var(--el-border-color);
  border-radius: 5px;

  .el-icon--right {
    margin: 0;
    padding: 0.3rem;
  }
}

.cl-search-addtion-wrap {
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  cursor: pointer;

  .el-icon--right {
    margin: 0;
    margin-left: 1rem;
    padding: 0.5rem;
    border: 1px solid var(--el-border-color);
    border-radius: 5px;
  }
}

.cl-book-home-menu {
  // padding: 0 1rem;
}
</style>
