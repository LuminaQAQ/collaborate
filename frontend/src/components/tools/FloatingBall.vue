<style lang="scss" scoped>
.floating-btn {
  position: fixed;
  z-index: 999;
}
</style>

<template>
  <ElButton class="floating-btn" size="large" :icon="icon" circle :loading="loading" />
</template>

<script setup>
import { ElButton } from 'element-plus'

defineProps({
  icon: String,
  loading: Boolean,
})
</script>
