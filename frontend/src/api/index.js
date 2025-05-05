/**
 * @typedef authApi
 * @property {string} verifyCode
 * @property {string} register
 * @property {string} login
 * @property {string} logout
 */

/**
 * @typedef apiList
 * @property {authApi} authApi
 * @property {userApi} userApi
 */

export const apiList = {
  authApi: {
    verifyCode: '/api/verifyCode',
    register: "/api/register",
    login: "/api/login",
    logout: "/api/logout"
  },
  userApi: {
    home: "/api/home",
    userInfo: "/user/info",
    bookList: "/api/bookList",
    docList: "/api/docList"
  },
  createApi: {
    createBook: "/api/createBook",
    createDoc: "/api/createDoc",
    createDocGroup: "/api/createDocGroup"
  },
  docApi: {
    fetchDoc: "/api/doc",
    updateDoc: "/api/updateDoc",
    delDoc: "/api/delDoc",
    delDocGroup: "/api/delDocGroup"
  },
  historyApi: {
    fetchDocHistory: "/api/historyList",
    fetchDocHistoryDetail: "/api/historyDetail"
  },
  favoriteApi: {
    fetchFavoriteGroup: "/favorite/favoriteGroup",
    fetchFavorite: "/favorite/favorite",
    addFavorite: "/favorite/addFavorite",
    delFavorite: "/favorite/delFavorite"
  }
}
