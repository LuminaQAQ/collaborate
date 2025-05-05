<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElLoading, ElMessage, ElScrollbar } from 'element-plus'

import ClIconButton from '../common/ClIconButton.vue'
import FullScreenWrapper from '../layout/FullScreenWrapper.vue'

import { Cloudy } from '@element-plus/icons-vue/dist/index.js'

import { requestDocHistory, requestDocHistoryDetail } from '@/api/history'
import { useDocStore } from '@/stores/doc'

const route = useRoute()
const docStore = useDocStore()
const emits = defineEmits(['restore'])

const state = reactive({
  isOpen: false,
  isReady: true,
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
    requestDocHistory({
      doc_id: Number(route.params.doc),
    })
      .then((res) => {
        state.historyList = res.data.list
        state.isReady = false
        state.activeHistoryItem = res.data.list[0].id

        methods.handleHistoryItem(res.data.list[0].id)
      })
      .catch((err) => {})
  },
  handleClose() {},
  handleHistoryItem(id) {
    state.activeHistoryItem = id
    state.isReady = true

    requestDocHistoryDetail({
      id,
    })
      .then((res) => {
        state.text = res.data.content
        state.isReady = false
      })
      .catch((err) => {})
  },
  timeFormat(time) {
    const now = new Date()
    const target = new Date(time)
    const diff = now.getTime() - target.getTime()
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))

    let fullDate = ''

    if (diffDays && diffDays < 1) {
      fullDate = `今天`
    } else if (diffDays < 2) {
      fullDate = `昨天`
    } else if (diffDays < 3) {
      fullDate = `前天`
    } else {
      fullDate = `${time?.slice(0, 10)}`
    }

    return `${fullDate} ${time?.slice(11, 16)}`
  },
  handleRestore() {
    emits('restore', state.text)
    docStore.currentDocState.content = state.text
    state.isOpen = false

    ElMessage.success('恢复成功!')
  },
}
</script>

<template>
  <span>
    <ClIconButton title="历史记录" :icon="Cloudy" @click="methods.handleHistoryBoard" />
    <FullScreenWrapper
      :key="state.updateKey"
      v-if="state.isOpen"
      @open="methods.handleOpen"
      @close="methods.handleClose"
    >
      <template #header>
        <ElPageHeader
          title="历史记录"
          @back="methods.handleHistoryBoard"
          style="padding: 0.5rem 0; font-size: 3rem; height: 3rem"
        >
          <template #extra>
            <div class="flex items-center">
              <ElButton
                v-if="state.historyList.length > 0"
                type="primary"
                @click="methods.handleRestore"
                :disabled="state.isReady"
              >
                恢复此记录
              </ElButton>
            </div>
          </template>
        </ElPageHeader>
      </template>
      <template #aside>
        <ElScrollbar>
          <section
            class="history-item"
            v-for="item in state.historyList"
            :class="{ active: state.activeHistoryItem === item.id }"
            :key="item.id"
            @click="methods.handleHistoryItem(item.id)"
          >
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
        <v-md-preview v-loading="state.isReady" :text="state.text" style="height: 100%" />
      </template>
    </FullScreenWrapper>
  </span>
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
