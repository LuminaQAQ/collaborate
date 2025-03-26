<script setup>
import router from '@/router'
import { defineProps } from 'vue'

const props = defineProps({
  item: Object,
})

// console.log(props.item)
</script>

<template>
  <template v-if="item.type === 'group'">
    <details class="cl-group-item">
      <summary>
        <span>{{ item.name }}</span>
      </summary>
      <CatalogueTree v-for="child in item.children" :item="child" style="margin-left: 1rem" />
    </details>
  </template>
  <template v-else>
    <section
      class="cl-doc-list-item"
      :key="item.id"
      @click="router.push(`/${item.email}/${item.book_id}/${item.id}`)"
    >
      <span>{{ item.title }}</span>
      <span class="doc-list-chain"></span>
      <span>{{ item.created_at.slice(0, 10) }}</span>
    </section>
  </template>
</template>

<style lang="scss" scoped>
.cl-group-item,
.cl-doc-list-item {
  margin: 1rem 0;
  cursor: pointer;
}

.cl-group-item {
  margin: 1rem 0;
}
.cl-doc-list-item {
  display: flex;

  .doc-list-chain {
    flex: 1;
    margin: 0 1rem;

    background-image: radial-gradient(circle, #000 1px, transparent 1px);
    background-size: 10px;
  }
}
</style>
