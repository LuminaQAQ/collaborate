<style lang="scss" scoped>
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
}

.cl-sub-menu-wrap {
  position: relative;

  .addition-wrap {
    position: absolute;
    right: 2.25rem;
    top: 1.15rem;
    .el-icon {
      transition: opacity 0.2s;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 5px;
      font-size: 14px;
      width: 14px;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }
}
</style>

<template>
  <template v-if="book.type === 'group'">
    <section
      class="cl-sub-menu-wrap"
      @mouseenter="methods.handleIconshow(true)"
      @mouseleave="methods.handleIconshow(false)"
    >
      <el-sub-menu
        class="cl-sub-menu-item"
        :index="`/${book.email}/${book.book_id}/group_${book.id}`"
      >
        <template #title>
          <span>{{ book.title }}</span>
        </template>
        <MenuTree v-for="(item, index) in book.children" :key="index" :book="item" />
      </el-sub-menu>
      <section class="addition-wrap" v-permission="['book:owner', 'book:editor']">
        <!-- 更多设置 -->
        <el-dropdown trigger="click" @visible-change="methods.handleDropdownCollapse">
          <ElIcon
            class="more"
            size="14"
            :style="{
              visibility: state.isHover ? 'visible' : 'hidden',
              opacity: state.isHover ? 1 : 0,
            }"
          >
            <MoreFilled style="rotate: 90deg" />
          </ElIcon>
          <template #dropdown>
            <el-dropdown-menu @mouseenter="state.isHover = true">
              <el-dropdown-item>重命名...</el-dropdown-item>
              <ElDivider />
              <el-dropdown-item>复制到...</el-dropdown-item>
              <el-dropdown-item>移动到...</el-dropdown-item>
              <ElDivider />
              <DelGroup :group="book" />
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 添加操作 -->
        <el-dropdown trigger="click" @visible-change="methods.handleDropdownCollapse">
          <ElIcon
            class="more"
            size="14"
            :style="{
              visibility: state.isHover ? 'visible' : 'hidden',
              opacity: state.isHover ? 1 : 0,
            }"
          >
            <Plus style="rotate: 90deg" />
          </ElIcon>
          <template #dropdown>
            <el-dropdown-menu @mouseenter="state.isHover = true">
              <AddDoc :parent_id="book.id" />
              <AddGroup :parent_id="book.id" />
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </section>
    </section>
  </template>
  <template v-else>
    <DocMenuItem :book="book" />
  </template>
</template>

<script setup>
import { MoreFilled, Plus } from '@element-plus/icons-vue/dist/index.js'
import { ElIcon } from 'element-plus'
import { ElDivider } from 'element-plus'
import { reactive } from 'vue'
import DocMenuItem from './DocMenuItem.vue'
import AddDoc from '../dropdown/AddDoc.vue'
import AddGroup from '../dropdown/AddGroup.vue'
import DelGroup from '../dropdown/DelGroup.vue'

const props = defineProps({
  book: Object,
})

const state = reactive({
  isHover: false,
})

const methods = {
  handleDropdownCollapse(flag) {
    state.isHover = true
    if (!flag) state.isHover = false
  },
  handleIconshow(flag) {
    if (state.isOpen) return

    state.isHover = flag
  },
  async handleDocGroupDel() {
    // const { book } = props
  },
}
</script>
