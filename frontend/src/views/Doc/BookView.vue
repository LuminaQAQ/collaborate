<script setup>
import { reactive } from 'vue'

import { ArrowRightBold, ArrowLeftBold, Notebook } from '@element-plus/icons-vue'
import { requestDocList } from '@/api/user'
import { ElContainer, ElHeader, ElIcon, ElMain, ElMenu } from 'element-plus'
import { useRoute } from 'vue-router'

const route = useRoute()

const state = reactive({
  isCollapse: true,
  isMenuHover: true,
  bookName: '',
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
      <ElHeader>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">
            <div class="favicon-wrap"><img src="@/assets/logo.svg" alt="" /></div>
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/books' }"> 个人知识库 </el-breadcrumb-item>
        </el-breadcrumb>
      </ElHeader>
      <ElHeader style="display: flex; align-items: center">
        <ElIcon :size="22" color="#409eff" style="margin-right: 0.5rem"><Notebook /></ElIcon>
        <span>{{ state.bookName }}</span>
        <span style="margin-left: auto">1</span>
      </ElHeader>
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

.favicon-wrap {
  width: 1.75rem;
  height: 1.75rem;

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
</style>
