<script setup>
import { ref } from 'vue'

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

const isCollapse = ref(true)
const isMenuHover = ref(false)
</script>

<template>
  <el-aside width="auto" @mouseover="isMenuHover = true" @mouseout="isMenuHover = false">
    <!-- 基本功能 -->
    <el-menu
      class="el-menu-vertical-demo"
      :router="true"
      :default-active="router.currentRoute.value.path.toString()"
      :collapse="isCollapse"
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
      :collapse="isCollapse"
    >
      <el-sub-menu index="/books" @click="router.push('/books')">
        <template #title>
          <el-icon><Notebook /></el-icon>
          <span>知识库</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item two</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
    <el-divider />
    <el-menu
      class="el-menu-vertical-demo"
      :router="true"
      :default-active="router.currentRoute.value.path.toString()"
      :collapse="isCollapse"
    >
      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <template #title>设置</template>
      </el-menu-item>
    </el-menu>
    <el-icon class="collapse-icon" @click="isCollapse = !isCollapse" v-show="isMenuHover">
      <ArrowRightBold v-if="isCollapse" />
      <ArrowLeftBold v-else />
    </el-icon>
  </el-aside>
</template>

<style lang="scss" scoped>
.el-aside,
.el-menu {
  position: relative;
  border-right: 0;
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
