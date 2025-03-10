import { defineStore } from "pinia"
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  let token = ref("");

  return {
    token
  }
})
