import { requestDoc, requestDocDel, requestDocList, requestDocUpdate } from '@/api/user'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

export const useDocStore = defineStore('doc', () => {
  const route = useRoute()

  const currentDocState = reactive({
    isLoading: true,

    bookInfo: {},

    title: '',
    content: '',
    role: {
      book: '',
      doc: '',
    },
    collaborators: [],
    docList: [],
    docInfo: {
      title: '',
      content: '',
    },
    editorView: {
      selection: '',
      isReadonly: false,
      isTranslateMode: false,
    },
  })

  const handleRole = {
    isOwner(type) {
      return currentDocState.role[type] === 'owner'
    },
    isEditor(type) {
      return currentDocState.role[type] === 'editor'
    },
    isViewer(type) {
      return currentDocState.role[type] === 'viewer'
    },
    isOwnerOrEditor(type) {
      return currentDocState.role[type] === 'owner' || currentDocState.role[type] === 'editor'
    },
  }

  const fetchDocList = () =>
    requestDocList({
      book_id: route.params.book,
    }).then((res) => {
      const { docList, bookInfo, role } = res.data

      currentDocState.docList = docList
      currentDocState.bookInfo = bookInfo
      if (role) currentDocState.role.book = role.split(':')[1]
    })

  const fetchDoc = () =>
    requestDoc({
      email: route.params.user,
      book_id: route.params.book,
      doc_id: route.params.doc,
    })
      .then((result) => {
        if (!result.data) return router.push(`/${route.params.user}/${route.params.book}`)

        const { title, content, role } = result.data
        currentDocState.docInfo = result.data

        currentDocState.title = title
        currentDocState.content = content

        if (role) currentDocState.role.doc = role.split(':')[1]
      })
      .catch((err) => {})

  const updateDoc = (callback, isAutoSave = false) =>
    requestDocUpdate({
      doc_id: route.params.doc,
      title: currentDocState.docInfo.title,
      content: currentDocState.docInfo.content,
    }).then((res) => {
      if (!isAutoSave) ElMessage.success('保存成功！')
      fetchDocList()
    })

  const delDoc = (doc_id) =>
    requestDocDel({
      doc_id,
    }).then((res) => {
      ElMessage.success('删除成功！')
      fetchDocList()
      return router.replace(`/${route.params.user}/${route.params.book}`)
    })

  const restoreCurrentState = () => {
    Object.assign(currentDocState, {
      title: '',
      content: '',
      role: {
        book: '',
        doc: '',
      },
      collaborators: [],
      docInfo: {},
    })
  }

  return {
    currentDocState,
    fetchDocList,
    fetchDoc,
    updateDoc,
    delDoc,
    restoreCurrentState,
    handleRole,
  }
})
