<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElScrollbar } from 'element-plus'

import FullScreenWrapper from '@/components/layout/FullScreenWrapper.vue'

import { requestDocHistory, requestDocHistoryDetail } from '@/api/history'
import { useDocStore } from '@/stores/doc'

const route = useRoute()
const emits = defineEmits(['restore', 'close', 'open'])

const docStore = useDocStore()
const isMulCollaborator = computed(() => docStore.currentDocState.collaborators.length > 1)

const state = reactive({
  isOpen: false,
  isReady: true,
  isRestore: false,
  docInfo: {
    title: "",
    content: ""
  },
  text: '',
  historyList: [],
  activeHistoryItem: 0,
  updateKey: Date.now(),
})

const methods = {
  handleHistoryBoard() {
    state.isOpen = !state.isOpen
    state.updateKey = Date.now()
  },
  handleOpen() {
    emits('open')
    requestDocHistory({
      doc_id: Number(route.params.doc),
    })
      .then((res) => {
        state.historyList = res.data.list
        state.isReady = false
        state.activeHistoryItem = res.data.list[0].id

        methods.handleHistoryItem(res.data.list[0].id)
      })
      .catch(() => { })
  },
  handleClose() {
    emits('close')
  },
  handleHistoryItem(id) {
    state.activeHistoryItem = id
    state.isReady = true

    requestDocHistoryDetail({
      id,
    })
      .then((res) => {
        state.docInfo = res.data
        state.isReady = false
      })
      .catch(() => { })
  },
  timeFormat(time) {
    const today = new Date();
    const now = new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
    const target = new Date(time.slice(0, 10))
    const diff = now.getTime() - target.getTime()
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 0

    let fullDate = ''

    const strategy = {
      0: '今天',
      1: '昨天',
      2: '前天',
    }

    fullDate = strategy[diffDays] || `${time.slice(0, 10)}`

    return `${fullDate} ${time?.slice(11, 16)}`
  },
  handleRestore() {
    if (isMulCollaborator.value) return ElMessage.error('多人编辑中，请请联系其他协作者退出编辑后再试')

    emits('restore', state.docInfo, () => { state.isRestore = true }, () => { state.isOpen = false; state.isRestore = false })
  },
}
</script>

<template>
  <FullScreenWrapper :key="state.updateKey" :is-loading="state.isRestore" @open="methods.handleOpen"
    @close="methods.handleClose">
    <template #header>
      <ElPageHeader title="历史记录" @back="methods.handleHistoryBoard"
        style="padding: 0.5rem 0; font-size: 3rem; height: 3rem">
        <template #extra>
          <div class="flex items-center">
            <ElButton v-if="state.historyList.length > 0" type="primary" @click="methods.handleRestore"
              :disabled="state.isReady">
              恢复此记录
            </ElButton>
          </div>
        </template>
      </ElPageHeader>
    </template>
    <template #aside>
      <ElScrollbar>
        <section class="history-item" v-for="item in state.historyList"
          :class="{ active: state.activeHistoryItem === item.id }" :key="item.id"
          @click="methods.handleHistoryItem(item.id)">
          <header style="margin-bottom: 0.5rem">
            <span> {{ methods.timeFormat(item.created_at) }} </span>
          </header>
          <footer>
            <span style="font-size: 0.75rem; color: #999">{{ item.username }}</span>
          </footer>
        </section>
      </ElScrollbar>
    </template>
    <template #content>
      <v-md-preview v-loading="state.isReady" :text="state.docInfo.content" style="height: 100%" />
    </template>
  </FullScreenWrapper>
</template>

<style lang="scss" scoped>
.history-item {
  display: block;
  padding: 0.5rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;

  &.active {
    background-color: #f0f0f0;
  }
}

::v-deep(.el-divider) {
  border: 0;
}
</style>
