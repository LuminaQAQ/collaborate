<script setup lang="ts">
import { requestCreateDoc } from '@/api/create'
import router from '@/router'
import { useDocStore } from '@/stores/doc'
import { Document } from '@element-plus/icons-vue/dist/index.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const docStore = useDocStore()

const props = defineProps({
  parent_id: String || Number || null,
})

const handleCreateDoc = async () => {
  const { user, book } = route.params

  try {
    const res = await requestCreateDoc({
      book_id: Number(book),
      parent_id: Number(props.parent_id) || null,
    })
    await docStore.fetchDocList()
    router.replace(`/${user}/${book}/${res.data.doc_id}`)
  } catch {}
}
</script>

<template>
  <el-dropdown-item :icon="Document" @click="handleCreateDoc"> 新建文档 </el-dropdown-item>
</template>
