import { defineStore } from "pinia"
import { reactive, ref } from "vue";

export const useUserStore = defineStore("user", () => {
  let token = ref("");
  const user = reactive({
    username: "",
    avatar: "",
    email: ""
  })

  return {
    token,
    user
  }
})
