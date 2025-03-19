<script setup>
import { reactive } from 'vue'

import { ArrowRightBold, ArrowLeftBold } from '@element-plus/icons-vue'
import { requestDocList } from '@/api/user'
import { ElContainer, ElMain, ElMenu } from 'element-plus'
import { useRoute } from 'vue-router'

const route = useRoute()

const state = reactive({
  isCollapse: true,
  isMenuHover: true,
  docList: [],
})

console.log(route.params.book)

requestDocList({ book_id: route.params.book }).then((res) => (state.docList = res.data.docList))
</script>

<template>
  <ElContainer>
    <el-aside
      :width="state.isCollapse ? '280px' : '1px'"
      @mouseover="state.isMenuHover = true"
      @mouseout="state.isMenuHover = false"
    >
      <!-- 文档列表  -->
      <ElAside class="el-menu-vertical-demo" :router="true" :default-active="route.path.toString()">
        <ElMenu>
          <el-menu-item v-for="item in state.docList" index="">
            <template #title>开始</template>
          </el-menu-item>
        </ElMenu>
      </ElAside>
      <el-icon
        :class="['collapse-icon', state.isCollapse ? '' : 'is-close']"
        @click="state.isCollapse = !state.isCollapse"
        v-show="state.isMenuHover"
      >
        <ArrowLeftBold v-if="state.isCollapse" />
        <ArrowRightBold v-else />
      </el-icon>
    </el-aside>
    <ElMain></ElMain>
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
  cursor: pointer;

  &.is-close {
    position: fixed;
    left: 0;
  }
}
</style>
