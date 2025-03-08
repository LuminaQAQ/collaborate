const { defineStore } = require("pinia");
const { ref } = require("vue");

export const useUserStore = defineStore("user", () => {
  let token = ref("");

  return {
    token
  }
})
