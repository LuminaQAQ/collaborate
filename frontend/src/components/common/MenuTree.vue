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
}

.addition-wrap {
  position: absolute;
  right: 2rem;
  top: -50%;
  transform: translate(0, -25%);
  .more {
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 5px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}
</style>

<template>
  <template v-if="book.type === 'group'">
    <el-sub-menu
      class="cl-sub-menu-item"
      :index="`/group/${book.email}/${book.book_id}/${book.id}`"
      @mouseenter="state.isHover = true"
      @mouseleave="state.isHover = false"
    >
      <template #title>
        <span>{{ book.name }}</span>
        <section class="addition-wrap">
          <el-dropdown trigger="click" @visible-change="methods.handleDropdownCollapse">
            <ElIcon class="more" v-if="state.isHover"><MoreFilled style="rotate: 90deg" /> </ElIcon>
            <template #dropdown>
              <el-dropdown-menu @mouseenter="state.isHover = true">
                <el-dropdown-item>复制到...</el-dropdown-item>
                <el-dropdown-item>移动到...</el-dropdown-item>
                <ElDivider />
                <el-dropdown-item @click="methods.handleDocGroupDel">删除分组</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </section>
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
  async handleDocGroupDel() {
    console.log(props.book)
  },
}
</script>
