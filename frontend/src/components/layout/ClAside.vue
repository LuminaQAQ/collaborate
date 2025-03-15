<script setup>
import { ref } from 'vue'

import { Document, Star, ArrowRightBold, ArrowLeftBold, Notebook } from '@element-plus/icons-vue'

const isCollapse = ref(true)
const isMenuHover = ref(false)
</script>

<template>
  <el-aside width="auto" @mouseover="isMenuHover = true" @mouseout="isMenuHover = false">
    <el-menu
      default-active="/dashboard"
      class="el-menu-vertical-demo"
      :router="true"
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
        <el-icon><document /></el-icon>
        <template #title>小记</template>
      </el-menu-item>
      <el-menu-item index="/books">
        <el-icon><Notebook /></el-icon>
        <template #title>知识库</template>
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

  height: 100%;
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
