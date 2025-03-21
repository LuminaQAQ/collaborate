<template>
  <v-md-editor v-model="state.content" height="100%" @save="methods.handleSave"></v-md-editor>
</template>

<script setup>
import { requestDoc, requestDocUpdate } from '@/api/user'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const { user, book, doc } = route.params

const state = reactive({
  title: '',
  content: '',
})

const methods = {
  handleSave: (text, html) => {
    requestDocUpdate({ book_id: book, title: state.title, content: text }).then((res) => {
      ElMessage.success('保存成功！')
    })
  },
  initDoc: () => {
    const { user, book, doc } = route.params

    requestDoc({ email: user, book_id: book, doc_id: doc })
      .then((result) => {
        const { title, content } = result.data

        state.title = title
        state.content = content
      })
      .catch((err) => {
        console.log(err)
      })
  },
}

onMounted(() => {
  methods.initDoc()
  watch(route, methods.initDoc)
})
</script>

<style lang="scss"></style>
