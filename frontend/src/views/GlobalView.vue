<template></template>

<script setup>
import { requestUrlJoinToShare } from '@/api/share'
import { toBook, toDoc, toHome } from '@/router/handler';
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
  }).catch(err => {
    const errMsg = err.response.data.error

    if (errMsg === '不能邀请自己') {
      const { target_type } = err.response.data.payload
      shareStrategies[target_type](err.response.data.payload, 'replace')
    } else {
      toHome("replace")
    }
  })
}
</script>
