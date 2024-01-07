<template>
  <q-form class="row forms" @submit="onSave">
    <div
      v-for="item in items()"
      :class="!item.report ? 'fields col-6' : 'fields col-4'"
    >
      <q-select
        v-if="item.select"
        outlined
        clearable
        v-model="this[item.value]"
        :options="item.options"
        :label="item.label"
      />
      <q-field
        v-else-if="!item.editable"
        color="black"
        outlined
        :label="item.label"
        stack-label
      >
        {{ this[item.value] }}
      </q-field>
      <q-input
        v-else-if="item.editable"
        color="black"
        outlined
        :label="item.label"
        v-model="this[item.value]"
        stack-label
      />
    </div>
    <div style="float: bottom; width: 100%">
      <q-select
        outlined
        v-model="status"
        :options="options"
        label="Situação da Ordem de Serviço"
      />
      <q-input
        color="black"
        outlined
        v-model="defect_obs"
        label="Defeito"
        stack-label
      />
      <q-card-actions align="right">
        <q-btn
          text-color="blue-7"
          flat
          to="/os-history"
          label="Cancelar"
          v-close-popup
        />
        <q-btn
          text-color="blue-7"
          flat
          type="submit"
          label="Salvar"
          color="primary"
        />
      </q-card-actions>
    </div>
  </q-form>
</template>
<script>
import { defineComponent, inject, ref } from "vue";
import { useAuthStore } from "src/stores/Auth";
import { api } from "src/boot/axios";
import InputEditor from "../../InputEditor.vue";
import { useOsHistoryStore } from "src/stores/OsHistory";

export default defineComponent({
  name: "CardEditOs",

  components: {
    InputEditor,
  },

  watch: {
    service_cost() {
      let result = this.setTicket();
      this.ticket_amount = result;
    },
    part_cost() {
      let result = this.setTicket();
      this.ticket_amount = result;
    },
  },

  data() {
    return {
      part_name: "",
      service_name: "",
      os_number: "",
      client_id: "",
      branch_id: "",
      product: "",
      defect_obs: "",
      status: "",
      product_serial: "",
      branch_name: "",
      client_name: "",
      client_phone: "",
      client_document: "",
      client_mail: "",
      model: "",
      brand: "",
      created_by_user_id: useAuthStore().user_id,
      options: [
        "Aguardando autorização do orçamento",
        "Aguardando cliente buscar",
        "Entregue",
        "Em manutenção",
        "Aguardando manutenção",
      ],
      part_cost: ref(0),
      service_cost: ref(0),
      ticket_amount: ref(0),
    };
  },
  props: {
    type: String,
    row: Object,
    title: String,
  },
  methods: {
    setTicket() {
      return Number(this.part_cost) + Number(this.service_cost) || 0;
    },

    items() {
      return [
        {
          isOs: true,
          value: "os_number",
          label: "Número da Os",
        },
        {
          isClient: true,
          value: "client_name",
          label: "Nome do cliente",
        },
        {
          isClient: true,
          value: "client_phone",
          label: "Telefone",
        },
        {
          isClient: true,
          value: "client_mail",
          label: "Endereço",
        },
        {
          isOs: true,
          value: "branch_name",
          label: "Filial",
        },
        {
          isOs: true,
          value: "product",
          label: "Produto",
        },
        {
          select: true,
          report: true,
          options: ["LIMPEZA", "REPARO", "OUTRO"],
          value: "service_name",
          label: "Serviço",
        },
        {
          select: true,
          report: true,
          options: ["CONECTOR", "TELA", "CAMERA", "ALTO FALANTE", "OUTRO"],
          value: "material_name",
          label: "Peça",
        },
        {
          isTicket: true,
          editable: true,
          report: true,
          value: "product_serial",
          label: "Serial Produto",
        },
        {
          isTicket: true,
          editable: true,
          report: true,
          value: "service_cost",
          label: "Custo (R$)",
        },
        {
          isTicket: true,
          editable: true,
          report: true,
          value: "part_cost",
          label: "Custo (R$)",
        },
        {
          isTicket: true,
          editable: true,
          report: true,
          value: "ticket_amount",
          label: "Valor total (R$)",
        },
      ];
    },

    clearForms() {
      this.os_number = "";
      this.client_id = "";
      this.branch_id = "";
      this.product = "";
      this.defect_obs = "";
      this.status = "";
      this.product_serial = "";
      this.branch_name = "";
      this.client_name = "";
      this.client_phone = "";
      this.client_document = "";
      this.client_mail = "";
      this.model = "";
      this.brand = "";
    },

    async getOsData(id) {
      try {
        return await this.$api
          .get(`/services/${id}`, {
            headers: {
              Authorization: useAuthStore().token,
              xid: useAuthStore().user_id,
            },
          })
          .then((res) => res?.data);
      } catch (e) {
        this.$q.notify({
          type: "warning",
          position: "top",
          message: "Cliente não cadastrado",
          timeout: 1500,
        });
      }
    },

    async setData() {
      let {
        branch_name,
        client_name,
        client_phone,
        created_at,
        os_number,
        product,
        product_serial,
        status,
        defect_obs,
        service_cost,
        material_cost,
        ticket_amount,
        service_name,
        material_name,
        mail,
      } = await this.getOsData(this.$route.params.id);

      this.client_name = client_name;
      this.client_phone = client_phone;
      this.client_mail = mail;
      this.os_number = os_number;
      this.branch_name = branch_name;
      this.product = product;
      this.product_serial = product_serial;
      this.status = status;
      this.defect_obs = defect_obs;
      this.service_cost = service_cost;
      this.part_cost = material_cost;
      this.service_name = service_name;
      this.material_name = material_name;

      this.part_cost = /null/gi.test(material_cost) ? 0 : material_cost;
      this.service_cost = /null/gi.test(service_cost) ? 0 : service_cost;
      this.ticket_amount = ticket_amount || (service_cost + part_cost);

      let ticket = {
        os_number,
        defect_obs,
        part_cost: this.part_cost,
        service_cost: this.service_cost,
      };

      useOsHistoryStore().setTicketOs(ticket);
      useOsHistoryStore().setOsStatus(status);
    },

    async onSave() {
      let ticket = {
        os_number: this.os_number,
        status: this.status,
        defect_obs: this.defect_obs,
        material_name: this.part_name,
        material_cost: this.part_cost,
        service_name: this.service_name,
        service_cost: this.service_cost,
        ticket_amount: this.ticket_amount,
      };
      // console.log(ticket);
      // return;
      if (
        JSON.stringify(useOsHistoryStore().ticket_os) === JSON.stringify(ticket)
      ) {
        this.$q.notify({
          type: "warning",
          position: "top",
          message: "Sem alteração",
          timeout: 1500,
        });
        return;
      }
      // console.log({ticket});
      await api
        .post(`services/edit`, ticket, {
          headers: {
            Authorization: useAuthStore().token,
            xid: useAuthStore().user_id,
          },
        })
        .then((res) => {
          useOsHistoryStore().setTicketOs(ticket);
          useOsHistoryStore().setOsStatus(this.status);
          this.$q.notify({
            type: "positive",
            position: "top",
            message: "OS alterada!",
            timeout: 1500,
          });
        })
        .catch((e) => {
          this.$q.notify({
            type: "negative",
            position: "top",
            message: "Tivemos algum problema",
            timeout: 1500,
          });
        });
    },
  },
  async mounted() {
    this.setData();
  },
});
</script>

<style lang="scss">
.forms {
  margin: 5em 15em;
  .q-field {
    padding: 0.7em 1em;
  }
  .q-select {
    padding: 0.7em 1em;
  }
  .q-input {
  }
}
</style>
