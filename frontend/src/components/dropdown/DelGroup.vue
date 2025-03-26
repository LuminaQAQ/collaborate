<script setup lang="ts">
import { requestCreateDocGroup } from '@/api/create'
import { useDocStore } from '@/stores/doc'
import { Delete } from '@element-plus/icons-vue/dist/index.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const docStore = useDocStore()

const props = defineProps({
  group: Object,
})

/**
 *
 * @param {Array} children
 */
const flat = (children) => {
  const ary = []

  children.forEach((child) => {
    if (child.children && child?.children?.length > 0) return flat(child.children)
    else return ary.push(child)
  })
}

const handleCreateFolder = async () => {
  //   const { book } = route.params
  console.log(flat(props.group.children))
  try {
    // await requestCreateDocGroup({
    //   book_id: Number(book),
    //   parent_id: Number(props.parent_id) || null,
    // })
    // await docStore.fetchDocList()
  } catch {}
}
</script>

<template>
  <el-dropdown-item :icon="Delete" @click="handleCreateFolder"> 删除分组 </el-dropdown-item>
</template>
