import { request } from "@/utils/request.js"
import { apiList } from "./index.js"

const { verifyCode, register, login } = apiList.authApi

/**
 * @typedef verifyCodeData
 * @property {string} email
 */
/**
 * 发送验证码
 * @param {verifyCodeData} data
 * @returns {import("axios").AxiosPromise}
 */
export const requestVerifyCode = (data) => {
  return request(verifyCode, {
    method: 'post',
    data
  })
}

/**
 * @typedef registerData
 * @property {string} email
 * @property {string | number} pwd
 * @property {string | number} code
 */
/**
 * 用户注册
 * @param {registerData} data
 */
export const requestRegister = (data) => {
  return request(register, {
    method: 'post',
    data
  })
}

/**
 * @typedef loginData
 * @property {string} email
 * @property {string | number} pwd
 */
/**
 * 用户登录
 * @param {loginData} data
 * @returns
 */
export const requestLogin = (data) => {
  return request(login, {
    method: "post",
    data
  })
}
