<script setup>
import { ElTree } from 'element-plus'

defineProps({
  listArray: Array,
  book: Object,
})

const emits = defineEmits(['node-click'])

const treeProps = {
  label: 'title',
  children: 'children',
}
</script>

<template>
  <ElTree
    :data="listArray"
    node-key="id"
    :props="treeProps"
    highlight-current
    default-expand-all
    @node-click="emits('node-click',$event)"
  />
</template>
