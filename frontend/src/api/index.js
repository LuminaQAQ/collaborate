/**
 * @typedef login
 * @property {string} verifyCode
 */

/**
 * @typedef apiList
 * @property {login} login
 */

export const apiList = {
  loginApi: {
    verifyCode: '/api/verifyCode',
    register: "/api/register",
    login: "/api/login"
  }
}
