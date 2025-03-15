<script setup>
import { DocumentAdd, MagicStick, Notebook, Paperclip } from '@element-plus/icons-vue/dist/index.js'
import { ElRow } from 'element-plus'

const buttons = [
  {
    icon: Paperclip,
    title: '导入文档',
    details: '导入本地文档',
  },
  {
    icon: DocumentAdd,
    title: '新建文档',
    details: '开始文字之旅',
  },
  {
    icon: Notebook,
    title: '新建知识库',
    details: '使用知识库整理知识',
  },
  {
    icon: MagicStick,
    title: '模板库',
    details: '从模板中获取灵感',
  },
]
</script>

<template>
  <div class="cl-start-button-group">
    <h1>开始</h1>
    <ElRow>
      <div class="cl-start-btn" v-for="(item, index) in buttons" :key="index" shadow="hover">
        <el-icon size="22"><component :is="item.icon" /></el-icon>
        <div class="button-info-wrap">
          <p class="button-title">
            <b>{{ item.title }}</b>
          </p>
          <p class="button-details">
            <small> {{ item.details }}</small>
          </p>
        </div>
      </div>
    </ElRow>
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
