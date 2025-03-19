<template>
  <div class="cl-personal-view-wrap">
    <p>{{ route.params.user }}</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style lang="scss"></style>
