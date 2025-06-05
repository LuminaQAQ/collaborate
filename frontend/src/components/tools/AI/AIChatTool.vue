<script setup>
import { requestChatToAi } from '@/api/ai'
import { useDocStore } from '@/stores/doc'
import { ChatDotRound } from '@element-plus/icons-vue/dist/index.js'
import { ElMessage, ElScrollbar, ElTag } from 'element-plus'
import { reactive, watch } from 'vue'

const docStore = useDocStore()

const { modelValue } = defineProps({
  modelValue: Boolean,
})

const emits = defineEmits(['replace'])

const promptPrefixStrategies = {
  beautify: () => `美化这段内容`,
  continue: () => `续写这段内容`,
}

const state = reactive({
  chatPrompt: '',
  messageResult: ``,
  isLoading: false,
  isFinished: false,

  history: {
    lastchatPrompt: '',
    lastchatResult: '',
  },
})

const methods = {
  hanndleReset() {
    state.chatPrompt = ''
    state.messageResult = ''
  },
  handleSaveLastChat() {
    state.history.lastchatPrompt = state.chatPrompt
    state.history.lastchatResult = state.messageResult
  },
  /**
   *
   * @param {string} message
   */
  handleRenderChatResult(message) {
    let i = 0

    let timer = setInterval(() => {
      if (i < message.length) state.messageResult += message.charAt(i++)
      else {
        clearInterval(timer)
        timer = null
        state.isLoading = false
        state.isFinished = true
        methods.handleSaveLastChat()
      }
    }, 15)
  },
  async handleChat() {
    if (!state.chatPrompt) return
    state.messageResult = ''
    state.isLoading = true
    state.isFinished = false

    try {
      const res = await requestChatToAi({
        prompt: state.chatPrompt,
        content: docStore.currentDocState.docInfo.content,
      })

      state.chatPrompt = ''
      methods.handleRenderChatResult(res.data.response)
    } catch (error) {
      state.isLoading = false
      console.log(error)
    } finally {
    }
  },

  async handleReplace() {
    emits('replace', state.messageResult)
  },
  async handleResultCopy() {
    try {
      await navigator.clipboard.writeText(state.messageResult)
      ElMessage.success('复制成功')
    } catch (error) {
      ElMessage.error('复制失败')
    }
  },
}
</script>

<template>
  <section v-if="modelValue" class="ai-chat-container">
    <section class="ai-chat-message" v-if="state.messageResult.length || state.isLoading">
      <ElScrollbar :style="{ height: 'calc(100% - 2rem)' }">
        <v-md-preview v-if="state.messageResult.length" :text="state.messageResult" />
        <el-skeleton
          v-else-if="state.isLoading"
          animated
          style="padding: 1rem; box-sizing: border-box"
        />
      </ElScrollbar>
      <footer class="ai-chat-message-footer" v-if="!state.isLoading">
        <ElTag @click="methods.handleReplace" round>替换全文</ElTag>

        <ElTag @click="methods.handleResultCopy" round>复制</ElTag>

        <ElTag @click="methods.hanndleReset" round>清空</ElTag>
      </footer>
    </section>

    <section class="ai-chat-content">
      <main class="ai-chat-content-main">
        <ElInput
          v-model="state.chatPrompt"
          @keydown.enter="methods.handleChat"
          placeholder="请输入内容"
          :disabled="state.isLoading"
        />
        <ElButton
          type="primary"
          :icon="ChatDotRound"
          :disabled="state.isLoading || state.chatPrompt.length === 0"
          :loading="state.isLoading"
          @click="methods.handleChat"
          style="margin-left: 0.5rem"
          circle
        />
      </main>
    </section>
  </section>
</template>

<style lang="scss" scoped>
.ai-chat-container {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);

  padding: 1rem;
  width: 70%;

  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;

  .ai-chat-message {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, calc(-100% - 0.5rem));

    box-sizing: border-box;

    width: 100%;
    height: 300px;

    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;

    .ai-chat-message-footer {
      box-sizing: border-box;
      padding: 0.25rem 0.5rem;
      min-height: 1.5rem;
      border-top: 1px solid #eee;

      .el-tag {
        margin-right: 0.5rem;
        cursor: pointer;
      }
    }
  }

  .ai-chat-content {
    .ai-chat-content-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
