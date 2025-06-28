<script setup>
import { ElButton, ElDialog, ElDivider, ElMessage } from 'element-plus'
import MDPreviewBasic from './MDPreviewBasic.vue'

import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import MDComment from './MDComment.vue'
import { requestCommentDoc, requestFetchComments } from '@/api/doc'
import { useDocStore } from '@/stores/doc'
import CommentListItem from './components/CommentListItem.vue'
// @ts-ignore
import ClToolbar from './components/ClToolbar'

const { value } = defineProps({
  value: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['selectionchange'])
const docStore = useDocStore()
const domLines = ref([])
const state = reactive({
  commentDialogVisable: false,
  commentQuote: '',
  comment: '',
  parent_id: null,
  selection: '',

  docCommentEditor: {
    comment: '',
    submitBtnIsLoading: false,
  },

  commentList: [],
  commentStatusIsLoading: false,
})

const commentsQuoteData = computed(() => ({
  doc_id: docStore.currentDocState.docInfo.id,
  comment_quote: state.commentQuote,
  comment_content: state.comment,
  parent_id: state.parent_id,
}))

const commentsDocData = computed(() => ({
  doc_id: docStore.currentDocState.docInfo.id,
  comment_quote: null,
  comment_content: state.docCommentEditor.comment,
  parent_id: null,
}))

const MDArray = computed(() => value.split('\n'))

// TODO: 评论系统
/**
 * @type {import("vue").Ref<HTMLElement> | null}
 */
const previewRef = ref(null)
/**
 * @type {import("vue").Ref<HTMLElement> | null}
 */
const commentBtnRef = ref(null)
/**
 * @type {import("vue").Ref<HTMLElement> | null}
 */
const commentEditor = ref(null)
/**
 * @type {import("vue").Ref<HTMLElement> | null}
 */
const docContainer = ref(null)
/**
 * @type {import("vue").Ref<HTMLElement> | null}
 */
const toolbarEl = ref(null)
/**
 * @type {HTMLElement | null}
 */
let previewContainer = null

const unmountedController = new AbortController()

const methods = {
  /**
   * @returns {HTMLElement}
   */
  initCommentBtnCreate() {
    const commentBtn = document.createElement('cl-comment-btn')
    commentBtnRef.value = commentBtn
    commentBtn.className = 'comment-btn'
    previewContainer.appendChild(commentBtn)

    return commentBtn
  },
  initToolbarCreate() {
    const toolbar = document.createElement('cl-toolbar')
    toolbar.className = 'cl-toolbar'
    previewContainer.appendChild(toolbar)

    console.log()

    toolbar.commentIcon.addEventListener('click', () => {
      console.log(state.selection)

      commentBtnRef.value.click()
    })

    return toolbar
  },
  /**
   * @param {HTMLElement} line
   */
  initBlockEvent: (line, index) => {
    line.addEventListener(
      'mouseover',
      (e) => {
        e.stopPropagation()
        e.preventDefault()

        const controller = new AbortController()
        const { vMdLine } = line.dataset

        commentBtnRef.value.classList.add('active')

        if (vMdLine !== commentBtnRef.value.dataset.vMdLine) {
          /**
           * @type {HTMLElement}
           */
          const nextLine = domLines.value[index + 1]

          commentBtnRef.value.setAttribute('data-v-md-line', vMdLine)
          commentBtnRef.value.setAttribute(
            'data-v-md-next-line',
            nextLine?.dataset?.vMdLine || null,
          )
        }

        previewContainer.style.setProperty('--preview-comment-top', `${line.offsetTop}px`)

        previewContainer.addEventListener(
          'mouseleave',
          () => {
            commentBtnRef.value.classList.remove('active')
            controller.abort()
          },
          { signal: controller.signal },
        )
      },
      { signal: unmountedController.signal },
    )
  },
  /**
   *
   * @param {Selection} selection
   */
  handleSelection(selection) {
    const selectedText = selection.toString()?.trim()
    if (!selectedText) return

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const { scrollLeft, scrollTop } = docContainer.value

    const containerRect = docContainer.value.getBoundingClientRect()
    const relativeLeft = rect.left - containerRect.left + scrollLeft
    const relativeTop = rect.top - containerRect.top + scrollTop - 8

    const toolbar = toolbarEl.value
    toolbar.style.setProperty('--toolbar-left', `${relativeLeft}px`)
    toolbar.style.setProperty('--toolbar-top', `${relativeTop}px`)
    toolbar.style.setProperty('--toolbar-visibility', `visable`)
  },

  fetchCommentList: (doc_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await requestFetchComments({ doc_id })
        state.commentList = res.data

        resolve(res.data)
      } catch (error) {
        reject(error)
      }
    })
  },

  /**
   *
   * @param {MouseEvent} e
   */
  handleComment: async (e) => {
    const { vMdLine, vMdNextLine } = e.target.dataset
    console.log(state.selection)

    state.commentQuote =
      state.selection ||
      MDArray.value
        .slice(Number(vMdLine) - 1, Number(vMdNextLine) - 1 || MDArray.value.length - 1)
        .join('\n')

    state.commentDialogVisable = true
  },

  async handleCommentLike(comment) {
    console.log(comment)
  },

  async handleCommentReply(comment) {
    console.log(comment)

    const { comment_content, comment_id, comment_quote } = comment
    state.parent_id = comment_id

    state.commentQuote = `> ${comment_quote}
${comment_content}
`

    state.commentDialogVisable = true
  },

  async handleCommentSubmit({ doc_id, comment_quote, comment_content, parent_id }) {
    if (!comment_content) return

    try {
      state.commentStatusIsLoading = true
      state.docCommentEditor.submitBtnIsLoading = true

      await requestCommentDoc({
        doc_id,
        comment_quote,
        comment_content,
        parent_id,
      })

      ElMessage.success('评论成功')
      methods.handleReset()
      await methods.fetchCommentList(docStore.currentDocState.docInfo.id)
    } catch (error) {
      ElMessage.error('评论失败')
    } finally {
      state.commentStatusIsLoading = false
    }
  },
  handleReset() {
    state.commentDialogVisable = false
    state.comment = ''
    state.parent_id = null

    state.selection = ''

    state.docCommentEditor.comment = ''
    state.docCommentEditor.submitBtnIsLoading = false

    commentEditor.value.handleReset()
  },
}

const emitMethods = {
  handleEmitSelectionChange() {
    const selection = window.getSelection()
    const selectedText = selection.toString()?.trim()

    if (selectedText) {
      state.selection = selectedText
      methods.handleSelection(selection)
      emits('selectionchange', selectedText)
    } else {
      let timer = setTimeout(() => {
        if (!state.commentDialogVisable) state.selection = ''
        timer = null
        clearTimeout(timer)
      }, 100)
      toolbarEl.value.style.setProperty('--toolbar-visibility', `hidden`)
    }
  },
}

onMounted(async () => {
  await import('@/components/common/MDEditor/components/ClCommentBtn')
  await methods.fetchCommentList(docStore.currentDocState.docInfo.id)

  previewContainer = previewRef.value?.root?.$el
  docContainer.value = document.querySelector('.DocContainer')
  toolbarEl.value = methods.initToolbarCreate()
  commentBtnRef.value = methods.initCommentBtnCreate()

  commentBtnRef.value.addEventListener('click', methods.handleComment, {
    signal: unmountedController.signal,
  })

  domLines.value = [...previewContainer.querySelectorAll('[data-v-md-line]')]
  domLines.value.forEach(methods.initBlockEvent)

  previewContainer.addEventListener('mouseup', emitMethods.handleEmitSelectionChange, {
    signal: unmountedController.signal,
  })
})

onUnmounted(() => {
  previewContainer?.remove()
  commentBtnRef.value?.remove()
  toolbarEl.value?.remove()
  docContainer.value = null
  unmountedController.abort()
})
</script>

<template>
  <MDPreviewBasic class="pm-root" ref="previewRef" :text="value" />

  <section class="pm-comment-container">
    <MDComment
      ref="commentEditor"
      v-model="state.docCommentEditor.comment"
      placeholder="输入评论..."
      @update="state.docCommentEditor.comment = $event"
      height="12rem"
    />
    <ElButton
      class="pm-comment-btn"
      type="primary"
      :disabled="state.docCommentEditor.comment.length === 0"
      :loading="state.docCommentEditor.isLoading"
      @click="methods.handleCommentSubmit(commentsDocData)"
    >
      评论
    </ElButton>
  </section>

  <section class="pm-comment-list-container">
    <header>{{ `所有评论（${state.commentList.length}）` }}</header>
    <ElDivider />
    <CommentListItem
      v-for="item in state.commentList"
      :key="item.id"
      :comment="item"
      @like="methods.handleCommentLike"
      @reply="methods.handleCommentReply"
    />
  </section>

  <!-- 评论框 -->
  <ElDialog
    class="pm-comment-dialog"
    v-model="state.commentDialogVisable"
    @close="methods.handleReset"
  >
    <section class="pm-comment-dialog_body">
      <blockquote class="pm-commented-content">
        <MDPreviewBasic :text="state.commentQuote" />
      </blockquote>
      <MDComment
        ref="commentEditor"
        v-model="state.comment"
        @update="state.comment = $event"
        height="12rem"
      />
    </section>

    <template #title>
      <ElButton
        type="primary"
        size="small"
        @click="methods.handleCommentSubmit(commentsQuoteData)"
        :disabled="state.comment.length === 0"
        :loading="state.commentStatusIsLoading"
      >
        评论
      </ElButton>
    </template>
  </ElDialog>
</template>

<style lang="scss">
.pm-root {
  --preview-comment-top: 0;
  position: relative;
  padding-right: 1.5rem;

  .comment-btn {
    position: absolute;
    display: none;
    right: 0;
    transform: translateX(-100%);
    top: var(--preview-comment-top);

    &.active {
      display: block;
    }
  }
}

.pm-comment-dialog {
  height: 70%;
  width: 80%;

  overflow: hidden;

  .el-dialog__body {
    height: 100%;
  }
  .pm-comment-dialog_body {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;

    .pm-commented-content {
      box-sizing: border-box;
      margin: 1rem 0;
      padding: 0.25rem 0 0.25rem 1rem;
      border-left: 0.2rem solid #dfe2e5;

      max-height: 15rem;
      overflow: auto;

      color: #999;
      font-size: 1rem;

      .vuepress-markdown-body,
      .v-md-editor-preview {
        padding: 0;
      }

      .v-md-editor-preview {
      }
    }
  }
}

.pm-comment-container {
  padding: 1rem;

  .pm-comment-btn {
    margin-top: 0.5rem;
  }
}

.pm-comment-list-container {
  padding: 1rem;
}
</style>
