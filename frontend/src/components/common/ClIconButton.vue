<script setup>
defineProps(['size', 'icon'])
</script>

<template>
  <ElIcon class="cl-icon-button" :title="title"><component :is="icon" /> </ElIcon>
</template>

<style lang="scss">
.cl-icon-button {
  font-size: var(--cl-icon-button-size);
  margin: 0 0.25rem;
  padding: 0.5rem;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>
