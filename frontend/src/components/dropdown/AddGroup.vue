<script setup lang="ts">
import { requestCreateDocGroup } from '@/api/create'
import { useDocStore } from '@/stores/doc'
import { Folder } from '@element-plus/icons-vue/dist/index.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const docStore = useDocStore()

const props = defineProps({
  parent_id: String || Number || null,
})

const handleCreateFolder = async () => {
  const { book } = route.params

  try {
    await requestCreateDocGroup({
      book_id: Number(book),
      parent_id: Number(props.parent_id) || null,
    })
    await docStore.fetchDocList()
  } catch {}
}
</script>

<template>
  <el-dropdown-item :icon="Folder" @click="handleCreateFolder"> 新建分组 </el-dropdown-item>
</template>
