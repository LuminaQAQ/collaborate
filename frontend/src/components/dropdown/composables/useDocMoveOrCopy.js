import { reactive } from 'vue'
import { requestBookList, requestDocList } from '@/api/user'

export function useDocMoveOrCopy() {
  const state = reactive({
    dialogVisible: false,
    docTreeLoading: false,
    selectedBookId: 0,
    selectedDocTarget: {},
    bookList: [],
    docList: [],
  })

  const fetchBookList = async () => {
    const res = await requestBookList()
    return res.data.bookList
  }

  const fetchDocList = async (book_id) => {
    state.docTreeLoading = true
    try {
      const res = await requestDocList({ book_id })
      state.docTreeLoading = false
      return res.data.docList
    } catch (err) {
      state.docTreeLoading = false
      throw err
    }
  }

  return {
    state,
    fetchBookList,
    fetchDocList,
  }
}
