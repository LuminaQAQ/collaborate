<template>
  <div class="cl-doc-view-wrap">
    <p>{{ route.params.user }}</p>
    <p>{{ route.params.book }}</p>
    <p>{{ route.params.doc }}</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style lang="scss"></style>
