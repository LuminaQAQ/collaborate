import { requestDoc, requestDocList, requestDocUpdate } from "@/api/user";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { reactive } from "vue";
import { useRoute } from "vue-router";


export const useDocStore = defineStore("doc", () => {
  const route = useRoute();

  const currentDocState = reactive({
    bookName: "",
    title: "",
    content: "",
    docList: []
  })

  const fetchDocList = () => requestDocList({
    book_id: route.params.book
  }).then((res) => {
    currentDocState.docList = res.data.docList;
    currentDocState.bookName = res.data.bookName;
  })

  const fetchDoc = () => requestDoc({
    email: route.params.user,
    book_id: route.params.book,
    doc_id: route.params.doc
  }).then((result) => {
    const { title, content } = result.data

    currentDocState.title = title
    currentDocState.content = content
  }).catch((err) => {
    console.log(err)
  })

  const updateDoc = () => requestDocUpdate({
    book_id: route.params.book,
    title: currentDocState.title,
    content: currentDocState.content
  }).then((res) => {
    ElMessage.success('保存成功！')
    fetchDocList();
  })

  return {
    currentDocState,
    fetchDocList,
    fetchDoc,
    updateDoc
  }
})