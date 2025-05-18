<template></template>

<script setup>
import { requestUrlJoinToShare } from '@/api/share'
import { toBook, toDoc } from '@/router/handler';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router'

const route = useRoute();

const shareStrategies = {
  'Doc': (params) => toDoc({ user: params.target_user, book: params.book_id, doc: params.doc_id }),
  'Book': (params) => toBook({ user: params.target_user, book: params.book_id })
}

if (route.name === 'Share') {
  const { token } = route.query
  
  requestUrlJoinToShare({ token }).then((res) => {
    const { target_type } = res.data

    shareStrategies[target_type](res.data, 'replace')
    ElMessage.success('加入成功，正在跳转至对应页，请稍候...')
  })
}
</script>
