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
    if (child?.children?.length > 0) return ary.push(...flat(child.children), child)
    else ary.push(child)
  })

  return ary
}

const handleCreateFolder = async () => {
  const flatAry = flat(props.group.children)
  const [groupList, docList] = flatAry.reduce(
    ([group, doc], item) => {
      if (item.type === 'group') return [[...group, item.id], [...doc]]
      else return [[...group], [...doc, item.id]]
    },
    [[], []],
  )

  try {
    // await requestCreateDocGroup({
    //   book_id: Number(book),
    //   parent_id: Number(props.parent_id) || null,
    // })
    await docStore.fetchDocList()
  } catch {}
}
</script>

<template>
  <el-dropdown-item :icon="Delete" @click="handleCreateFolder"> 删除分组 </el-dropdown-item>
</template>
