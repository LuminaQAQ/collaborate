<script setup lang="ts">
import { requestCreateDocGroup } from '@/api/create'
import { requestGroupDel } from '@/api/user'
import { useDocStore } from '@/stores/doc'
import { Delete } from '@element-plus/icons-vue/dist/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'
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

  if (!children.length) {
    ary.push(children)
    children = children.children
  }

  children.forEach((child) => {
    if (child?.children?.length > 0) return ary.push(...flat(child.children), child)
    else ary.push(child)
  })

  return ary
}

const handleCreateFolder = async () => {
  const flatAry = flat(props.group)
  const [groupList, docList] = flatAry.reduce(
    ([group, doc], item) => {
      if (item.type === 'group') return [[...group, item.id], [...doc]]
      else return [[...group], [...doc, item.id]]
    },
    [[], []],
  )

  try {
    requestGroupDel({
      groupList,
      docList,
    }).then((res) => {
      ElMessage.success('删除成功！')
      docStore.fetchDocList()
    })
  } catch {}
}

const delConfirm = () => {
  ElMessageBox.confirm(
    `确认删除 ${props.group.name} 吗？同时删除 ${props.group.name} 下的所有文档`,
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      handleCreateFolder()
    })
    .catch(() => {})
}
</script>

<template>
  <el-dropdown-item :icon="Delete" @click="delConfirm"> 删除分组 </el-dropdown-item>
</template>
