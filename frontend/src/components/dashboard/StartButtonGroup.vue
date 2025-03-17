<script setup>
import { DocumentAdd, MagicStick, Notebook, Paperclip } from '@element-plus/icons-vue/dist/index.js'
import { ElMessage, ElRow } from 'element-plus'
import StartButton from './StartButton.vue'
import CreateBook from '../common/CreateBook.vue'
import { reactive } from 'vue'
import { requestCreateBook } from '@/api/create'

const state = reactive({
  createBookModelIsOpen: false,
  createDocModelIsOpen: false,
})

const buttons = [
  {
    icon: Paperclip,
    type: 'importDoc',
    title: '导入文档',
    details: '导入本地文档',
    handleClick: () => {},
  },
  {
    icon: DocumentAdd,
    type: 'createDoc',
    title: '新建文档',
    details: '开始文字之旅',
    handleClick: () => {},
  },
  {
    icon: Notebook,
    type: 'createBook',
    title: '新建知识库',
    details: '使用知识库整理知识',
    handleClick: () => {
      state.createBookModelIsOpen = !state.createBookModelIsOpen
    },
  },
  {
    icon: MagicStick,
    type: 'createTemplate',
    title: '模板库',
    details: '从模板中获取灵感',
    handleClick: () => {},
  },
]

const handleCreateBookModelOpen = (flag) => {
  state.createBookModelIsOpen = flag
}

const handleCreateBookModelClose = (flag) => {
  console.log(flag)
}

const handleCreateBookModelSubmit = async (bookInfo, reset) => {
  const { bookName, bookDesc } = bookInfo

  try {
    await requestCreateBook({
      name: bookName,
      description: bookDesc,
    })

    ElMessage.success('创建成功！')
    state.createBookModelIsOpen = false
    reset()
  } catch {
    ElMessage.error('创建失败！')
  }
}
</script>

<template>
  <div class="cl-start-button-group">
    <h1>开始</h1>
    <ElRow :gutter="24" style="padding: 1rem">
      <StartButton
        v-for="(button, index) in buttons"
        :button="button"
        :key="index"
        @click="button.handleClick"
      />
    </ElRow>

    <CreateBook
      :is-open="state.createBookModelIsOpen"
      @open="handleCreateBookModelOpen"
      @close="handleCreateBookModelClose"
      @submit="handleCreateBookModelSubmit"
    />
  </div>
</template>

<style lang="scss" scoped>
h1 {
  margin: 0.5rem 0;
}

.el-row {
  column-gap: 0.5rem;
  row-gap: 0.5rem;

  .cl-start-btn {
    cursor: pointer;

    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;

    flex: 1 0 15rem;
    max-width: 15rem;

    display: flex;
    align-items: center;

    transition: background-color 0.3s;

    .el-icon {
      padding: 0 0.5rem;
    }

    p {
      margin: 0;
    }

    .button-title {
      margin-bottom: 0.25rem;
      color: #606266;
    }

    .button-details {
      color: #909399;
    }

    &:hover {
      border-color: rgb(197.7, 225.9, 255);
      background-color: rgb(235.9, 245.3, 255);
    }
  }
}
</style>
