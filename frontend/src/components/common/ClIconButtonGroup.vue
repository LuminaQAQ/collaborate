<script setup>
defineProps(['size', 'icon'])
</script>

<template>
  <span class="cl-icon-button-group" :style="{ '--cl-icon-button-size': size }">
    <slot></slot>
  </span>
</template>

<style lang="scss" scoped>
.cl-icon-button-group {
  --cl-icon-button-size: 16px;
}
</style>
