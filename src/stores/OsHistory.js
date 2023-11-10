import { defineStore } from "pinia";

export const useOsHistoryStore = defineStore("OsHistory", {
  state: () => ({
    from: "",
    to: "",
    ticket_os: {
      os_number: 0,
      status: "",
      defect_obs: "",
      part_cost: 0,
      service_cost: 0,
    },
  }),

  getters: {},

  actions: {
    setTicketOs(ticket) {
      this.ticket_os.defect_obs = ticket.defect_obs;
      this.ticket_os.part_cost = ticket.part_cost;
      this.ticket_os.service_cost = ticket.service_cost;
      this.ticket_os.os_number = ticket.os_number;
    },
    setOsStatus(status) {
      this.ticket_os.status = status;
    },
    setDate(from, to) {
      this.from = from;
      this.to = to;
    },
  },
});
