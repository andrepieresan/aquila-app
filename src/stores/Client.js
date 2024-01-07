import { defineStore } from "pinia";

export const useClientStore = defineStore("client", {
  state: () => ({
    client: {
      client_id: "",
      branch_id: "",
      name: "",
      phone: "",
      document: "",
      mail: "",
    },
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    clear() {
      this.client.client_id = "";
      this.client.branch_id = "";
      this.client.name = "";
      this.client.document = "";
      this.client.phone = "";
      this.client.mail = "";
    },
    setClientId(client_id) {
      this.client.client_id = client_id;
    },
    setClient(client) {
      this.client.client_id = client.client_id;
      this.client.branch_id = client.branch_id;
      this.client.name = client.name;
      this.client.document = client.document;
      this.client.phone = client.phone;
      this.client.mail = client.mail;
    },
  },
});
