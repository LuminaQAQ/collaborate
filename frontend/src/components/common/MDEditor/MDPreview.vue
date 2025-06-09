<script setup>
import { ElButton, ElDialog, ElForm, ElFormItem, ElScrollbar } from 'element-plus'
import MDPreviewBasic from './MDPreviewBasic.vue'

import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import MDComment from './MDComment.vue'

const { value } = defineProps({
  value: {
    type: String,
    default: '',
  },
})

const domLines = ref([])
const state = reactive({
  commentDialogVisable: false,
  commentedMDContent: '',
  comment: '',
})

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
   * @param {MouseEvent} e
   */
  handleComment: (e) => {
    const { vMdLine, vMdNextLine } = e.target.dataset
    state.commentedMDContent = MDArray.value
      .slice(Number(vMdLine) - 1, Number(vMdNextLine) - 1 || MDArray.value.length - 1)
      .join('\n')

    state.commentDialogVisable = true
  },

  handleSubmit() {
    console.log(state.comment)

    methods.handleReset()
  },
  handleReset() {
    state.commentDialogVisable = false
    state.comment = ''
    commentEditor.value.handleReset()
  },
}

onMounted(async () => {
  await import('@/components/common/MDEditor/components/ClCommentBtn')

  previewContainer = previewRef.value?.root?.$el

  commentBtnRef.value = methods.initCommentBtnCreate()
  commentBtnRef.value.addEventListener('click', methods.handleComment, {
    signal: unmountedController.signal,
  })

  domLines.value = [...previewContainer.querySelectorAll('[data-v-md-line]')]
  domLines.value.forEach(methods.initBlockEvent)
})

onUnmounted(() => {
  previewContainer?.remove()
  commentBtnRef.value?.remove()
  unmountedController.abort()
})
</script>

<template>
  <MDPreviewBasic class="pm-root" ref="previewRef" :text="value" />
  <ElDialog
    class="pm-comment-dialog"
    v-model="state.commentDialogVisable"
    @close="methods.handleReset"
  >
    <section class="pm-comment-dialog_body">
      <blockquote class="pm-commented-content">
        <MDPreviewBasic :text="state.commentedMDContent" />
      </blockquote>
      <MDComment
        ref="commentEditor"
        v-model="state.comment"
        @update="state.comment = $event"
        height="12rem"
      />
    </section>

    <template #title>
      <ElButton type="primary" size="small" @click="methods.handleSubmit"> 评论 </ElButton>
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
  // max-width: 50%;
  height: 70%;
  width: 80%;

  overflow: hidden;
  .pm-comment-dialog_body {
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

// .hover-comment-btn,
// .select-comment-btn {
//   position: absolute;
//   background-color: #fff;
//   border: 1px solid #ccc;
//   font-size: 12px;
//   padding: 2px 6px;
//   border-radius: 4px;
//   cursor: pointer;
//   z-index: 1000;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//   user-select: none;
// }

// .select-comment-btn {
//   background-color: #f3f3f3;
// }
</style>
