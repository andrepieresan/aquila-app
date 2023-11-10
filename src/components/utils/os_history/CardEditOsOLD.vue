<template>
  <q-form class="row forms" @submit="onSave">
    <div v-for="item in items()" class="fields col-6">
      <q-field
        color="black"
        v-if="item.isClient && !item.editable"
        outlined
        :label="item.label"
        stack-label
      >
        {{ client[item.value] }}
      </q-field>
      <q-input
        color="black"
        v-else-if="item.isTicket && item.editable"
        outlined
        :label="item.label"
        v-model="this[item.value]"
        stack-label
      >
        <template v-slot:before>
          <q-input
            id="test"
            style="width: 100%"
            color="black"
            outlined
            :label="item.label"
            v-model="this[item.value]"
            stack-label
          />
        </template>
      </q-input>
      <q-field
        color="black"
        v-else-if="item.isTicket"
        outlined
        :label="item.label"
        stack-label
      >
        {{ this[item.value] }}
      </q-field>
      <q-field
        color="black"
        v-else-if="item.isOs && !item.editable"
        outlined
        :label="item.label"
        stack-label
      >
        {{ form[item.value] }}
      </q-field>
    </div>
    <div style="float: bottom; width: 100%">
      <q-select
        outlined
        v-model="form.status"
        :options="options"
        label="Situação da Ordem de Serviço"
      />
      <q-input
        color="black"
        outlined
        v-model="form.defect_obs"
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
    let client = ref({
      id: 0,
      name: "",
      phone: "",
      document: "",
      mail: "",
    });

    let form = ref({
      os_number: 0,
      client_id: 0,
      branch_id: 0,
      product: "",
      defect_obs: "",
      status: "",
      product_serial: "",
      created_by_user_id: useAuthStore().user_id,
    });

    return {
      align: "center",
      options: [
        "Aguardando autorização do orçamento",
        "Aguardando cliente buscar",
        "Entregue",
        "Em manutenção",
        "Aguardando manutenção",
      ],
      model: "",
      brand: "",
      form,
      client,
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
      return Number(this.part_cost) + Number(this.service_cost);
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
          value: "name",
          label: "Nome do cliente",
        },
        {
          isClient: true,
          value: "phone",
          label: "Telefone",
        },
        {
          isClient: true,
          value: "mail",
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
          isTicket: true,
          editable: true,
          valueReport: "service_cost",
          labelReport: "",
          value: "service_cost",
          label: "Custo do serviço  (R$)",
        },
        {
          isOs: true,
          value: "product_serial",
          label: "Serial",
        },
        {
          isTicket: true,
          editable: true,
          value: "part_cost",
          label: "Custo da peça  (R$)",
        },
        {
          isTicket: true,
          value: "ticket_amount",
          label: "Valor total (R$)",
        },
      ];
    },

    clearForms() {
      client.value = { id: "", name: "", phone: "", document: "", mail: "" };
      form.value = {
        service_cost: "",
        part_cost: "",
        ticket_amount: "",
        branch_name: "",
        client_id: "",
        branch_id: "",
        product: "",
        defect_obs: "",
        status: "",
        product_serial: "",
      };
      brand.value = "";
      model.value = "";
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
        part_cost,
        ticket_amount,
        mail,
      } = await this.getOsData(this.$route.params.id);

      this.client = {
        name: client_name,
        phone: client_phone,
        mail,
      };

      this.form = {
        os_number,
        branch_name,
        product,
        product_serial,
        status,
        defect_obs,
        service_cost,
        part_cost,
      };

      this.part_cost = /null/gi.test(part_cost) ? 0 : part_cost;
      this.service_cost = /null/gi.test(service_cost) ? 0 : service_cost;

      this.ticket_amount = ticket_amount | (service_cost + part_cost);

      let ticket = {
        os_number,
        defect_obs,
        part_cost: this.part_cost,
        service_cost: this.service_cost,
      };

      useOsHistoryStore().setTicketOs(ticket);
      useOsHistoryStore().setOsStatus(this.form.status);
    },

    async onSave() {
      let { status, defect_obs, os_number } = this.form;

      let ticket = {
        os_number,
        status,
        defect_obs,
        part_cost: this.part_cost,
        service_cost: this.service_cost,
        ticket_amount: this.ticket_amount,
      };

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

      await api
        .post(`services/edit`, ticket, {
          headers: {
            Authorization: useAuthStore().token,
            xid: useAuthStore().user_id,
          },
        })
        .then((res) => {
          useOsHistoryStore().setTicketOs(ticket);
          useOsHistoryStore().setOsStatus(status);
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
  #test {
    padding: 11em 1em;
  }
}
</style>
