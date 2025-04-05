<template></template>

<script setup>
import router from '@/router'
import { request } from '@/utils/request'
import { useRoute } from 'vue-router'

const route = useRoute()

if (route.name === 'Share') {
  const bookToken = route.query.token
  request({
    method: 'post',
    url: '/api/bookJoin',
    data: {
      bookToken,
    },
  }).then((res) => {
    const { user, book_id } = res.data

    router.replace(`/${user}/${book_id}`)
  })
}
</script>
