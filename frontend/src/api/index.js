export const apiList = {
  authApi: {
    verifyCode: '/api/verifyCode',
    register: '/api/register',
    login: '/api/login',
    logout: '/api/logout',
  },
  userApi: {
    home: '/api/home',
    userInfo: '/user/info',
    bookList: '/api/bookList',
    docList: '/api/docList',
  },
  createApi: {
    createBook: '/api/createBook',
    createDoc: '/api/createDoc',
    createDocGroup: '/api/createDocGroup',
  },
  docApi: {
    fetchDoc: '/api/doc',
    updateDoc: '/api/updateDoc',
    delDoc: '/api/delDoc',
    delDocGroup: '/api/delDocGroup',
    comment: '/api/comment/:doc_id',
    fetchComments: '/api/comments/:doc_id',
    uploadDocFile: '/api/uploadDocFile',
    moveDoc: '/api/moveDoc',
    copyDoc: '/api/copyDoc',
  },
  historyApi: {
    fetchDocHistory: '/api/historyList',
    fetchDocHistoryDetail: '/api/historyDetail',
  },
  favoriteApi: {
    fetchFavoriteGroup: '/favorite/favoriteGroup',
    fetchFavoriteList: '/favorite/favoriteList',
    createFavoriteGroup: '/favorite/createFavoriteGroup',
    updateFavoriteGroup: '/favorite/updateFavoriteGroup',
    delFavoriteGroup: '/favorite/delFavoriteGroup',
    addToFavorite: '/favorite/addToFavorite',
    delFavorite: '/favorite/delFavorite',
  },
  shareApi: {
    fetchJoinURL: '/share/getJoinURL',
    urlJoinToShare: '/share/urlJoinToShare',
  },
  bookApi: {
    editBook: '/api/editBook',
    delBook: '/api/delBook',
  },
  aiApi: {
    chat: '/ai/chat',
  },
}
