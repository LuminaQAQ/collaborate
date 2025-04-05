<script setup></script>

<template>
  <section class="cl-list-item-wrap">
    <section class="prepend">
      <slot name="prepend"></slot>
    </section>
    <main class="cl-list-item">
      <section class="cl-list-item-title">
        <slot name="title"></slot>
      </section>
      <section class="cl-list-item-content">
        <slot name="content"></slot>
      </section>
    </main>
    <span class="append">
      <slot name="append"></slot>
    </span>
  </section>
</template>

<style lang="scss" scoped>
.cl-list-item-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;

  .cl-list-item {
    flex: 1 0 auto;
    margin: 0 0.5rem;
    text-align: left;

    .cl-list-item-title {
      font-size: 1rem;
      font-weight: 600;
    }
  }
}
</style>
