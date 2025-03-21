<template>
  <div class="cl-doc-view-wrap">
    <p>{{ route.params.user }}</p>
    <p>{{ route.params.book }}</p>
    <p>{{ route.params.doc }}</p>
  </div>
  <v-md-editor v-model="text" height="100%"></v-md-editor>
</template>

<script setup>
import { requestDoc } from '@/api/user'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const text = ref('')

const { user, book, doc } = route.params

requestDoc({ email: user, book_id: book })
</script>

<style lang="scss"></style>
