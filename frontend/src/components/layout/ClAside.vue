<script setup>
import { reactive, ref } from 'vue'

import {
  Document,
  Star,
  ArrowRightBold,
  ArrowLeftBold,
  Notebook,
  Setting,
  ArrowRight,
} from '@element-plus/icons-vue'
import router from '@/router'
import { requestBookList } from '@/api/user'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const state = reactive({
  isCollapse: true,
  isMenuHover: true,
  bookList: [],
})

requestBookList().then((res) => (state.bookList = res.data.bookList))
</script>

<template>
  <el-aside
    :width="userStore.layoutState.mainAsideIsCollapse ? 'calc-size(auto)' : '200px'"
    @mouseover="state.isMenuHover = true"
    @mouseout="state.isMenuHover = false"
  >
    <!-- 基本功能 -->
    <el-menu
      class="el-menu-vertical-demo"
      :router="true"
      :default-active="router.currentRoute.value.path.toString()"
      :collapse="userStore.layoutState.mainAsideIsCollapse"
    >
      <el-menu-item index="/dashboard">
        <el-icon><Clock /></el-icon>
        <template #title>开始</template>
      </el-menu-item>
      <el-menu-item index="/collections">
        <el-icon><Star /></el-icon>
        <template #title>收藏</template>
      </el-menu-item>
      <el-menu-item index="/notes">
        <el-icon><Document /></el-icon>
        <template #title>小记</template>
      </el-menu-item>
    </el-menu>
    <el-divider />

    <!-- 文档列表  -->
    <el-menu
      class="el-menu-vertical-demo"
      style="flex: 1 0"
      :router="true"
      :default-active="router.currentRoute.value.path.toString()"
      :collapse="userStore.layoutState.mainAsideIsCollapse"
    >
      <el-sub-menu index="/books">
        <template #title>
          <el-icon><Notebook /></el-icon>
          <span>知识库</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="item in state.bookList"
            :key="item.id"
            :index="`${item.email}/${item.id}`"
          >
            {{ item.name }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
    <el-divider />
    <el-menu
      class="el-menu-vertical-demo"
      :router="true"
      :default-active="router.currentRoute.value.path.toString()"
      :collapse="userStore.layoutState.mainAsideIsCollapse"
    >
      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <template #title>设置</template>
      </el-menu-item>
    </el-menu>
    <el-icon
      class="collapse-icon"
      @click="
        userStore.layoutState.mainAsideIsCollapse = !userStore.layoutState.mainAsideIsCollapse
      "
      v-show="state.isMenuHover"
    >
      <ArrowRightBold v-if="userStore.layoutState.mainAsideIsCollapse" />
      <ArrowLeftBold v-else />
    </el-icon>
  </el-aside>
</template>

<style lang="scss" scoped>
.el-aside,
.el-menu {
  position: relative;
  border-right: 0;

  width: auto;
  will-change: width;
  transition: width 0.3s;
}

.el-aside {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--el-menu-border-color);
}

.collapse-icon {
  position: absolute;
  top: 50%;
  right: 0;

  padding: 0.5rem 0;
  background-color: #f2f2f2;
  border-radius: 999px;

  transform: translate(0, -100%);
  perspective: 10px;
  z-index: 2;
  cursor: pointer;
}
</style>
