<script setup>
import { ArrowRight, Cloudy, CopyDocument, Delete, Document, DocumentCopy, Download, Operation, SetUp, Tickets } from '@element-plus/icons-vue/dist/index.js'
import ClIconButton from '../common/ClIconButton.vue'
import { reactive } from 'vue'
import ClListItem from '../common/ClListItem.vue'
import { ElDivider, ElDrawer, ElIcon, ElText } from 'element-plus'
import HistoryTool from './HistoryTool.vue'
import { useDocStore } from '@/stores/doc'

// TODO: 添加设置抽屉

const emits = defineEmits(['historyRestory'])
const docStore = useDocStore()

const settingsStates = reactive({
  history: {
    visible: false,
  }
})

const settingsMethods = {
  history: {
    handleRestory(docInfo, loading, done) {
      docStore.handleRestore(docInfo, loading, done).then(() => {
        settingsStates.history.visible = false
        emits('historyRestory')
      })
    }
  }
}

const state = reactive({
  visible: false,

  options: [
    {
      content: "文档历史",
      icon: Cloudy,
      handleClick() {
        settingsStates.history.visible = true
      },
    },
    {
      content: "另存为模板",
      icon: Tickets,
      handleClick() {

      }
    },
    {
      content: "导出...",
      icon: Download,
      handleClick() {

      }
    },
    {
      content: "复制...",
      icon: CopyDocument,
      handleClick() {

      }
    },
    {
      content: "移动...",
      icon: DocumentCopy,
      handleClick() {

      }
    },
    {
      content: "删除...",
      icon: Delete,
      type: 'danger',
      handleClick() {

      }
    },

  ]
})

const { } = defineProps({

})

const methods = {}
</script>

<template>
  <ClIconButton title="设置" :icon="SetUp" @click="state.visible = true" />

  <ElDrawer v-model="state.visible" :size="300" :with-header="false" z-index="1000">
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
          :prepend-icon="item.icon" :content="item.content" :type="item.type" @click="item.handleClick" />
      </template>
    </ClListItem>
  </ElDrawer>

  <HistoryTool v-if="settingsStates.history.visible" @close="settingsStates.history.visible = false"
    @restore="settingsMethods.history.handleRestory" />
</template>
