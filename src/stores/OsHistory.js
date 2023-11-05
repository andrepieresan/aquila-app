import { defineStore } from "pinia";

export const useOsHistoryStore = defineStore("OsHistory", {
  state: () => ({
    from: "",
    to: "",
    status: "",
  }),

  getters: {},

  actions: {
    setOsStatus(status) {
      this.status = status;
    },
    setDate(from, to) {
      this.from = from;
      this.to = to;
    },
  },
});
