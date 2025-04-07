import { requestDoc, requestDocDel, requestDocList, requestDocUpdate } from "@/api/user";
import router from "@/router";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";

export const useDocStore = defineStore("doc", () => {
  const route = useRoute();

  const currentDocState = reactive({
    isLoading: true,
    bookName: "",
    bookDesc: "",
    title: "",
    content: "",
    role: {
      book: "",
      doc: ""
    },
    docList: [],
    docInfo: {}
  })

  const handleRole = {
    isOwner(type) {
      return currentDocState.role[type] === "owner"
    },
    isEditor(type) {
      return currentDocState.role[type] === "editor"
    },
    isViewer(type) {
      return currentDocState.role[type] === "viewer"
    },
    isOwnerOrEditor(type) {
      return currentDocState.role[type] === "owner" || currentDocState.role[type] === "editor"
    }
  }

  const fetchDocList = () => requestDocList({
    book_id: route.params.book
  }).then((res) => {
    const { docList, bookName, bookDescription, role } = res.data
    currentDocState.docList = docList;
    currentDocState.bookName = bookName;
    currentDocState.bookDesc = bookDescription;
    if (role) currentDocState.role.book = role.split(":")[1];
  })

  const fetchDoc = () => requestDoc({
    email: route.params.user,
    book_id: route.params.book,
    doc_id: route.params.doc
  }).then((result) => {
    if (!result.data) return router.push(`/${route.params.user}/${route.params.book}`);

    const { title, content, role } = result.data
    currentDocState.docInfo = result.data

    currentDocState.title = title
    currentDocState.content = content
    if (role) currentDocState.role.doc = role.split(":")[1];
  }).catch((err) => {
    console.log(err)
  })

  const updateDoc = () => requestDocUpdate({
    doc_id: route.params.doc,
    title: currentDocState.title,
    content: currentDocState.content
  }).then((res) => {
    ElMessage.success('保存成功！')
    fetchDocList();
  })

  const delDoc = (doc_id) => requestDocDel({
    doc_id
  }).then((res) => {
    ElMessage.success('删除成功！')
    fetchDocList();
    return router.replace(`/${route.params.user}/${route.params.book}`);
  })

  const socketMethods = {
    updateDoc: (data) => {
      if (data.doc_id === route.params.doc) {
        currentDocState.content = data.content
      }
    }
  }

  const restoreCurrentState = () => {
    for (const k in currentDocState) {
      if (typeof currentDocState[k] === "string") currentDocState[k] = "";
      else if (Array.isArray(currentDocState[k])) currentDocState[k] = [];
    }

    currentDocState.isLoading = true;
  }

  return {
    currentDocState,
    fetchDocList,
    fetchDoc,
    updateDoc,
    delDoc,
    restoreCurrentState,
    handleRole
  }
})