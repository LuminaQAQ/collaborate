<script setup>
import { requestChatToAi } from '@/api/ai'
import { ChatDotRound } from '@element-plus/icons-vue/dist/index.js'
import { ElScrollbar, ElTag } from 'element-plus'
import { reactive, watch } from 'vue'

const { modelValue } = defineProps({
  modelValue: Boolean,
})

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

    methods.hanndleReset()
    state.isLoading = true
    state.isFinished = false

    try {
      const res = await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            data: {
              response: `**《最后一颗糖》**

巷口的盲人老李总在卖麦芽糖。小城的孩子都爱他，因他总会多给一颗糖，说：“日子苦，得甜一甜。”

十年后，老李的摊子不见了。孩子们长大，渐渐忘了他。

某天，医生陈婷在急诊室接到一位脱水昏迷的老人——正是老李。他攥着脏兮兮的布袋，里面只剩一颗融化的糖。护士要扔，陈婷突然认出糖纸上的牙印——那是她小时候故意咬的。

“留着吧，”她轻声说，“日子苦，得甜一甜。”

后来，老李的病床前总有一罐新糖。来看他的“孩子们”说，甜味没变，只是尝着尝着，眼泪就掉下来了。

（200字）`,
            },
          })
        }, 3000)
      })

      methods.handleRenderChatResult(res.data.response)
    } catch (error) {
      state.isLoading = false
      console.log(error)
    } finally {
    }
  },
}
</script>

<template>
  <section v-if="modelValue" class="ai-chat-container">
    <ElScrollbar :class="state.messageResult.length || state.isLoading ? 'ai-chat-message' : ''">
      <v-md-preview v-if="state.messageResult.length" :text="state.messageResult" />
      <el-skeleton
        v-else-if="state.isLoading"
        animated
        style="padding: 1rem; box-sizing: border-box"
      />
    </ElScrollbar>

    <section class="ai-chat-content">
      <header class="ai-chat-content-header">
        <template v-if="state.isFinished">
          <ElTag @click="methods.hanndleReset" round>重置</ElTag>
          <!-- TODO: 重写 -->
          <ElTag round>重写</ElTag>
          <!-- TODO: 续写 -->
          <ElTag round>续写</ElTag>
        </template>
        <template v-else-if="state.isLoading">
          <ElTag>正在加载...</ElTag>
        </template>
      </header>

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
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }

  .ai-chat-content {
    .ai-chat-content-header {
      padding-bottom: 0.5rem;
      min-height: 1.5rem;

      .el-tag {
        margin-right: 0.5rem;
      }
    }

    .ai-chat-content-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
