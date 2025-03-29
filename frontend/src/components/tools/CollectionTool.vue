<script setup lang="ts">
import { Star, StarFilled } from '@element-plus/icons-vue/dist/index.js'
import ClIconButton from '../common/ClIconButton.vue'

defineProps({
  isCollection: Boolean,
})
</script>

<template>
  <template v-if="isCollection">
    <ClIconButton
      title="收藏"
      :icon="StarFilled"
      color="yellow"
      style="--cl-icon-button-size: 25px"
    />
  </template>
  <template v-else>
    <ClIconButton title="收藏" :icon="Star" />
  </template>
</template>
