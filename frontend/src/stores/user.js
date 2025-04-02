import { requestLogin } from "@/api/auth";
import router from "@/router";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia"
import { reactive, ref } from "vue";

export const useUserStore = defineStore("user", () => {
  let token = ref("");

  const user = reactive({
    username: "",
    avatar: "",
    email: ""
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
        .catch((err) => console.log(err))
    }
  }

  return {
    token,
    layoutState,
    user,
    methods
  }
})
