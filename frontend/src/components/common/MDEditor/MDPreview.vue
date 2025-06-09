<script setup>
import md from '@/utils/VMDBlockIdPlugin'

import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import Prism from 'prismjs'
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn'
import { onMounted, ref } from 'vue'

VMdPreview.use(vuepressTheme, {
  Prism,
})

VMdPreview.use(createTodoListPlugin())
VMdPreview.use(createCopyCodePlugin())
VMdPreview.use(createKatexPlugin())

defineProps({
  value: {
    type: String,
    default: '',
  },
})

// TODO: 评论系统
const previewRef = ref(null)

// onMounted(() => {
//   const root = previewRef.value?.$el

//   const commentBtn = document.createElement('div')
//   commentBtn.innerText = '💬'
//   commentBtn.className = 'comment-btn'
//   commentBtn.style.display = 'none'
//   document.body.appendChild(commentBtn)
//   commentBtnRef.value = commentBtn

//   const hoverBtn = document.createElement('div')
//   hoverBtn.innerText = '💬'
//   hoverBtn.className = 'comment-hover-btn'
//   hoverCommentRef.value = hoverBtn
//   document.body.appendChild(hoverBtn)

//   // 监听划词
//   document.addEventListener('mouseup', () => {
//     const sel = window.getSelection()
//     if (!sel || sel.isCollapsed) {
//       commentBtn.style.display = 'none'
//       return
//     }

//     const range = sel.getRangeAt(0)
//     const container = range.startContainer.parentElement.closest('[data-block-id]')
//     if (!container) return

//     const rect = range.getBoundingClientRect()
//     commentBtn.style.top = `${rect.top - 30 + window.scrollY}px`
//     commentBtn.style.left = `${rect.left + window.scrollX}px`
//     commentBtn.style.display = 'block'
//     selectedBlockId.value = container.getAttribute('data-block-id')
//   })

//   // 监听 hover 显示右侧按钮
//   const blocks = root.querySelectorAll('[data-block-id]')
//   blocks.forEach((block) => {
//     const blockId = block.getAttribute('data-block-id')

//     block.addEventListener('mouseenter', (e) => {
//       const rect = block.getBoundingClientRect()
//       hoverBtn.style.top = `${rect.top + window.scrollY}px`
//       hoverBtn.style.left = `${rect.right + 10 + window.scrollX}px`
//       hoverBtn.style.display = 'block'
//       hoverBtn.dataset.blockId = blockId
//     })

//     block.addEventListener('mouseleave', (e) => {
//       // 延迟隐藏防止按钮移开
//       setTimeout(() => {
//         if (!hoverBtn.matches(':hover')) {
//           hoverBtn.style.display = 'none'
//         }
//       }, 300)
//     })
//   })

//   // 防止按钮在鼠标移入后立刻消失
//   hoverBtn.addEventListener('mouseleave', () => {
//     hoverBtn.style.display = 'none'
//   })

//   // 点击评论按钮（hover）
//   hoverBtn.addEventListener('click', () => {
//     const id = hoverBtn.dataset.blockId
//     alert(`点击了块：${id}，打开评论面板`)
//   })

//   // 点击浮动评论按钮（划词）
//   commentBtn.addEventListener('click', () => {
//     const text = window.getSelection().toString()
//     alert(`对块 ${selectedBlockId.value} 中的文字 "${text}" 进行评论`)
//     commentBtn.style.display = 'none'
//   })
// })
</script>
<template>
  <v-md-preview ref="previewRef" :text="value" :markdown="md.render" />
</template>

<style lang="scss" scoped>
// .comment-btn {
//   position: absolute;
//   background: #fff;
//   border: 1px solid #ccc;
//   padding: 2px 4px;
//   font-size: 12px;
//   cursor: pointer;
//   z-index: 1000;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
// }

// .comment-hover-btn {
//   position: absolute;
//   right: -25px;
//   top: 0;
//   background: #eee;
//   border-radius: 4px;
//   padding: 2px 6px;
//   font-size: 12px;
//   cursor: pointer;
//   display: none;
// }
</style>
