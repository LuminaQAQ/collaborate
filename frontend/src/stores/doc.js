import { requestDoc, requestDocDel, requestDocList, requestDocUpdate } from "@/api/user";
import router from "@/router";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { reactive } from "vue";
import { useRoute } from "vue-router";

export const useDocStore = defineStore("doc", () => {
  const route = useRoute();

  const currentDocState = reactive({
    bookName: "",
    bookDesc: "",
    title: "",
    content: "",
    docList: []
  })

  const fetchDocList = () => requestDocList({
    book_id: route.params.book
  }).then((res) => {
    const { docList, bookName, bookDescription } = res.data
    currentDocState.docList = docList;
    currentDocState.bookName = bookName;
    currentDocState.bookDesc = bookDescription;
  })

  const fetchDoc = () => requestDoc({
    email: route.params.user,
    book_id: route.params.book,
    doc_id: route.params.doc
  }).then((result) => {
    if (!result.data) return router.push(`/${route.params.user}/${route.params.book}`);

    const { title, content } = result.data

    currentDocState.title = title
    currentDocState.content = content
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

  return {
    currentDocState,
    fetchDocList,
    fetchDoc,
    updateDoc,
    delDoc
  }
})