<style lang="scss" scoped>
.comment-item,
.child-comment {
  border-bottom: 1px solid #eee;
  padding: 1rem;

  display: flex;

  .aside {
    .el-avatar {
      margin-right: 0.5rem;
    }
  }

  .main {
    .user-info {
      margin-bottom: 0.5rem;
    }

    .quote {
      margin: 0;
      font-size: 0.9rem;
      color: #666;
      padding-left: 1rem;
      border-left: 3px solid #ccc;
      margin-bottom: 0.3rem;

      ::v-deep(.vuepress-markdown-body) {
        padding: 0.5rem;
      }
    }

    .content {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .actions {
      font-size: 0.85rem;
      color: #888;
      display: flex;
      gap: 0.5rem;
    }

    .child-comments {
      padding-left: 1rem;
      border-left: 1px dashed #ddd;
      margin-top: 0.5rem;
    }
  }
}
</style>

<template>
  <section class="comment-item">
    <aside class="aside">
      <ElAvatar :size="40" :src="comment.comment_user_avatar">
        {{ isValidAvatarSrc ? comment.comment_user_name.slice(0, 2) : '' }}
      </ElAvatar>
    </aside>

    <main class="main">
      <header class="user-info">
        <ElText class="username">{{ comment.comment_user_name }}</ElText>
        &nbsp;
        <ElText class="time">
          {{ comment.comment_time?.slice(0, 10) }}
          {{ comment.comment_time?.slice(11, 16) }}
        </ElText>
      </header>

      <template v-if="comment.comment_quote">
        <MDPreviewBasic class="quote" :value="comment.comment_quote" />
      </template>

      <p class="content">{{ comment.comment_content }}</p>

      <div class="actions">
        <ElButton @click="methods.handleReply" size="small" text>回复</ElButton>
      </div>

      <template v-if="comment?.children?.length">
        <CommentListItem
          v-for="child in comment.children"
          :key="child.id"
          :comment="child"
          @like="methods.handleLike(child)"
          @reply="methods.handleReply(child)"
        ></CommentListItem>
      </template>
    </main>
  </section>
</template>

<script setup>
import { ElAvatar, ElText } from 'element-plus'
import MDPreviewBasic from '../MDPreviewBasic.vue'

const emits = defineEmits(['like', 'reply'])

const { comment } = defineProps({
  comment: {
    type: Object,
  },
})

const isValidAvatarSrc = (src) => {
  try {
    return new URL(src)
  } catch (error) {
    return false
  }
}

const methods = {
  handleLike(child) {
    emits('like', child)
  },
  handleReply(child) {
    emits('reply', child instanceof PointerEvent ? comment : child)
  },
}
</script>
