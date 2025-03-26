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
    delDpc: "/api/delDoc"
  }
}
