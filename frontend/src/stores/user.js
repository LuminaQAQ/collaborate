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

  // const operatePermissions

  return {
    token,
    layoutState,
    user
  }
})
