<script setup>
import { useDocStore } from '@/stores/doc'
import { MoreFilled } from '@element-plus/icons-vue/dist/index.js'
import { ElDivider } from 'element-plus'
import { reactive } from 'vue'
import MoveDocDrowdown from '../dropdown/MoveDocDrowdown.vue'
import CopyDocDropdown from '../dropdown/CopyDocDropdown.vue'

const props = defineProps({ book: Object })

const store = useDocStore()

const state = reactive({
  isHover: false,
  isOpen: false,
})

const methods = {
  handleDropdownCollapse(flag) {
    state.isHover = true
    if (!flag) state.isHover = false
    state.isOpen = flag
  },
  handleIconshow(flag) {
    if (state.isOpen) return

    state.isHover = flag
  },
  async handleDocDel() {
    await store.delDoc(props.book.id)
  },
}
</script>

<template>
  <section
    class="cl-doc-item-wrap"
    @mouseenter="methods.handleIconshow(true)"
    @mouseleave="methods.handleIconshow(false)"
  >
    <el-menu-item class="cl-doc-menu" :index="`/${book.email}/${book.book_id}/${book.id}`">
      <template #title>
        {{ book.title }}
      </template>
    </el-menu-item>
    <section class="addition-wrap" v-permission="['book:owner', 'book:editor']">
      <el-dropdown trigger="click" @visible-change="methods.handleDropdownCollapse">
        <ElIcon
          class="more"
          :style="{
            visibility: state.isHover ? 'visible' : 'hidden',
            opacity: state.isHover ? 1 : 0,
          }"
          ><MoreFilled style="rotate: 90deg" />
        </ElIcon>
        <template #dropdown>
          <el-dropdown-menu @mouseenter="state.isHover = true">
            <el-dropdown-item>复制链接</el-dropdown-item>
            <el-dropdown-item>在新标签页打开</el-dropdown-item>
            <ElDivider />
            <CopyDocDropdown :doc-item="book" />
            <MoveDocDrowdown :doc-item="book" />
            <el-dropdown-item>导出</el-dropdown-item>
            <ElDivider />
            <el-dropdown-item @click="methods.handleDocDel">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </section>
  </section>
</template>

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

  .addition-wrap {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translate(0, -50%);
    .more {
      transition: opacity 0.2s;
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
