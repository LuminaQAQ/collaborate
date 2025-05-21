<script setup>
import { ElIcon, ElText } from 'element-plus';

const { type } = defineProps({
  hoverItem: Boolean,
  hasBg: Boolean,

  type: String,
  textColor: String,

  headerTitle: String,
  content: String,

  prependIcon: String || ElIcon,
  prepend: String || ElIcon,

  appendIcon: String || ElIcon,
  append: String || ElIcon,
})
</script>

<template>
  <section class="cl-list-item-wrap"
    :class="[type, hoverItem && 'cl-list-item--hover-item', hasBg && 'cl-list-item--has-bg']">
    <!-- 前置图标 -->
    <template v-if="prependIcon">
      <ElIcon>
        <component :is="prependIcon"></component>
      </ElIcon>
    </template>
    <template v-else-if="prepend">
      {{ prepend }}
    </template>
    <template v-else>
      <section>
        <slot name="prepend"></slot>
      </section>
    </template>

    <!-- 内容 -->
    <main class="cl-list-item">
      <section class="cl-list-item-title">
        <template v-if="headerTitle">
          {{ headerTitle }}
        </template>
        <template v-else>
          <slot name="title"></slot>
        </template>
      </section>
      <section class="cl-list-item-content">
        <template v-if="content">
          <ElText :type="type || 'info'">{{ content }}</ElText>
        </template>
        <template v-else>
          <slot name="content"></slot>
        </template>
      </section>
    </main>

    <!-- 尾部图标 -->
    <span class="append">
      <slot name="append"></slot>
    </span>
  </section>
</template>

<style lang="scss" scoped>
.cl-list-item-wrap {
  --text-color: initial;
  --color-border: #e5e5e5;
  --color-bg: #fafafa;

  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;

  .prepend {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cl-list-item {
    flex: 1 0 auto;
    margin: 0 0.5rem;
    text-align: left;

    .cl-list-item-title {
      font-size: 1rem;
      font-weight: 600;
    }
  }

  &.cl-list-item--border-bottom {
    border-bottom: 1px solid var(--color-border);
  }

  &.cl-list-item--hover-item {
    &:hover {
      background-color: var(--color-bg);
      cursor: pointer;
    }
  }

  &.cl-list-item--has-bg {
    background-color: var(--color-bg);
  }

  &.cl-list-item--firstly {
    padding: 0.5rem 0;
  }

  &.cl-list-item--secondary {
    padding: 0.5rem 0;
  }

  &.danger {
    --text-color: red;
  }
}
</style>
