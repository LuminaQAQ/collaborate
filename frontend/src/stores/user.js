import { requestLogin } from "@/api/auth";
import { requestBookList, requestUserInfo } from "@/api/user";
import router from "@/router";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia"
import { reactive, ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = reactive({
    username: "",
    avatar: "",
    email: "",
    userInfo: {
      username: "",
      email: "",
      created_at: "",
      avatar: ""
    },
    token: localStorage.getItem("token") || null,
    bookList: []
  })

  const layoutState = reactive({
    mainAsideIsCollapse: false,
  })

  const methods = {
    login({ email, pwd }) {
      requestLogin({
        email,
        pwd
      })
        .then((res) => {
          const { token, username, avatar, created_at } = res.data
          user.token = token
          user.username = username
          user.avatar = avatar
          user.created_at = created_at
          localStorage.setItem('token', token)

          ElMessage.success('登录成功，即将跳转至主页...')

          router.replace('/dashboard')
        })
        .catch((err) => { })
    },
    fetchUserInfo() {
      requestUserInfo()
        .then((res) => {
          user.userInfo = res.data

          const { username, avatar, email, created_at } = res.data
          user.username = username
          user.avatar = avatar
          user.email = email
          user.created_at = created_at
        })
        .catch((err) => console.log(err))
    },
    fetchBookList() {
      requestBookList()
        .then((res) => (user.bookList = res.data.bookList))
        .catch((err) => console.log(err))
    },
    logout() {
      Object.assign(user, {
        username: "",
        avatar: "",
        email: "",
        token: null,
        bookList: []
      })
    }
  }

  return {
    layoutState,
    user,
    methods
  }
})
