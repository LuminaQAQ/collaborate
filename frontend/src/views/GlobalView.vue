<template></template>

<script setup>
import { requestUrlJoinToShare } from '@/api/share'
import { useRoute } from 'vue-router'

const route = useRoute()

if (route.name === 'Share') {
  const bookToken = route.query.token

  // TODO: 更新链接邀请逻辑
  requestUrlJoinToShare({}).then((res) => {
    const { user, book_id } = res.data

    // router.replace(`/${user}/${book_id}`)
  })
}
</script>
