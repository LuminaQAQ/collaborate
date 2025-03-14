<script setup>
import ClHeader from '@/components/layout/ClHeader.vue'
import { ref } from 'vue'

import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  ArrowRightBold,
  ArrowLeftBold,
} from '@element-plus/icons-vue'

const isCollapse = ref(true)
const isMenuHover = ref(false)
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <cl-header />
      <el-container>
        <el-aside width="auto" @mouseover="isMenuHover = true" @mouseout="isMenuHover = false">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-menu-item index="1">
              <el-icon><Location /></el-icon>
              <template #title>Navigator Two</template>
            </el-menu-item>
            <el-menu-item index="2">
              <el-icon><icon-menu /></el-icon>
              <template #title>Navigator Two</template>
            </el-menu-item>
            <el-menu-item index="3">
              <el-icon><document /></el-icon>
              <template #title>Navigator Three</template>
            </el-menu-item>
            <el-menu-item index="4">
              <el-icon><setting /></el-icon>
              <template #title>Navigator Four</template>
            </el-menu-item>
          </el-menu>
          <el-icon class="collapse-icon" @click="isCollapse = !isCollapse" v-show="isMenuHover">
            <ArrowRightBold v-if="isCollapse" />
            <ArrowLeftBold v-else />
          </el-icon>
        </el-aside>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss">
.common-layout {
  width: 100%;
  height: 100%;

  .el-container {
    height: 100%;
  }

  > .el-container {
    flex-direction: column;
  }

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
}
</style>
