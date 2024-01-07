import { defineStore } from "pinia";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuth: false,
    token: localStorage.getItem("x-api"),
    user_id: localStorage.getItem("x-id"),
  }),

  getters: {
    async checkToken(state) {
      try {
        let { data } = await api
          .get("/checkToken", {
            headers: {
              Authorization: state.token,
              xid: state.user_id,
            },
          })
          .catch((e) => {});
        console.log("checkTOKEN", data);
        return data;
      } catch (e) {
        return false;
      }
    },
  },

  actions: {
    setCredentials(token, user_id) {
      this.isAuth = true;
      this.token = token;
      this.user_id = user_id;
      localStorage.setItem("x-api", token);
      localStorage.setItem("x-id", user_id);
    },
  },
});
