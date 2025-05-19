<script setup>
import { ArrowRight, CopyDocument, Delete, Document, DocumentCopy, Download, Operation, SetUp, Tickets } from '@element-plus/icons-vue/dist/index.js'
import ClIconButton from '../common/ClIconButton.vue'
import { reactive } from 'vue'
import ClListItem from '../common/ClListItem.vue'
import { ElDivider, ElDrawer, ElIcon, ElText } from 'element-plus'

// TODO: 添加设置抽屉

const emits = defineEmits([''])

const state = reactive({
  visible: false,

  options: [
    {
      content: "另存为模板",
      icon: Tickets,
    },
    {
      content: "导出...",
      icon: Download,
    },
    {
      content: "复制...",
      icon: CopyDocument,
    },
    {
      content: "移动...",
      icon: DocumentCopy,
    },
    {
      content: "删除...",
      icon: Delete,
      type: 'danger',
    },

  ]
})

const { } = defineProps({

})

const methods = {}
</script>

<template>
  <ClIconButton title="设置" :icon="SetUp" @click="state.visible = true" />

  <ElDrawer v-model="state.visible" :size="300" :with-header="false">
    <ClListItem class="cl-list-item--has-bg" style="cursor: pointer;">
      <template #prepend>
        <ElIcon size="24">
          <Document />
        </ElIcon>
      </template>
      <template #title>
        <ElText>文档信息</ElText>
      </template>
      <template #content>
        <ElText size="small">文档信息</ElText>
      </template>
      <template #append>
        <ElIcon>
          <ArrowRight />
        </ElIcon>
      </template>
    </ClListItem>

    <p></p>

    <ClListItem class="cl-list-item--has-bg cl-list-item--firstly">
      <template #title>
        <ClListItem class="cl-list-item--hover-item" :prepend-icon="Operation" content="文档设置" />
        <ElDivider style="margin: .25rem;" />
        <ClListItem class="cl-list-item--hover-item" v-for="item in state.options" :key="item.id"
          :prepend-icon="item.icon" :content="item.content" :type="item.type" />
      </template>
    </ClListItem>
  </ElDrawer>
</template>
