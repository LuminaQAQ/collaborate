<style lang="scss" scoped>
.cl-sub-menu-item {
  .el-icon {
    position: absolute;
    top: 0;
    right: 0;
  }
}
.el-divider {
  margin: 0.5rem 0;
}
.cl-doc-item-wrap {
  position: relative;
  display: flex;
  width: 100%;

  &:hover {
    background-color: var(--el-menu-hover-bg-color);
  }

  .cl-doc-menu {
    width: 100%;

    &:hover {
      background: none;
    }
  }

  .addition-wrap {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translate(0, -50%);
    .more {
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 5px;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }
}
</style>

<template>
  <template v-if="book.children?.length">
    <el-sub-menu class="cl-sub-menu-item" :index="book.label">
      <template #title>
        <span>{{ book.label }}</span>
        <!-- <ElIcon><MoreFilled /> </ElIcon> -->
        <!-- <el-dropdown trigger="click" @visible-change="methods.handleDropdownCollapse">
          <ElIcon class="more" v-if="state.isHover"><MoreFilled style="rotate: 90deg" /> </ElIcon>
          <template #dropdown>
            <el-dropdown-menu @mouseenter="state.isHover = true">
              <el-dropdown-item>复制链接</el-dropdown-item>
              <el-dropdown-item>在新标签页打开</el-dropdown-item>
              <ElDivider />
              <el-dropdown-item>复制</el-dropdown-item>
              <el-dropdown-item>移动</el-dropdown-item>
              <el-dropdown-item>导出</el-dropdown-item>
              <ElDivider />
              <el-dropdown-item @click="methods.handleDocDel">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
      </template>
      <MenuTree v-for="(item, index) in book.children" :key="index" :book="item" />
    </el-sub-menu>
  </template>
  <template v-else>
    <DocMenuItem :book="book" />
  </template>
</template>

<script setup>
import { MoreFilled } from '@element-plus/icons-vue/dist/index.js'
import { ElIcon } from 'element-plus'
import { useDocStore } from '@/stores/doc'
import { ElDivider } from 'element-plus'
import { reactive } from 'vue'
import DocMenuItem from './DocMenuItem.vue'

const props = defineProps({
  book: Object,
  id: Number,
})

const store = useDocStore()

const state = reactive({
  isHover: false,
})

const methods = {
  handleDropdownCollapse(flag) {
    state.isHover = true
    if (!flag) state.isHover = false
  },
  async handleDocDel() {
    await store.delDoc(props.book.id)
  },
}
</script>
