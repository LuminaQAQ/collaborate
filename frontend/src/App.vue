<script setup>
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/user'
import { onMounted } from 'vue'

const userStore = useUserStore()

onMounted(async () => {
  userStore.methods.fetchUserInfo()
})
</script>

<template>
  <RouterView />
</template>

<style lang="scss" scoped></style>
