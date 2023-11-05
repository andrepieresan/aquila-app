<template>
  <q-form class="row forms" @submit="onSave">
    <div v-for="item in items()" class="col-6 fields">
      <q-field
        color="black"
        v-if="item.isClient"
        outlined
        :label="item.label"
        stack-label
      >
        <InputEditor
          v-if="item.editable"
          :editKey="item.value"
          :editRow="client[item.value]"
          obj="client"
        />
        {{ client[item.value] }}
      </q-field>
      <q-field
        color="black"
        v-else-if="item.isOs"
        outlined
        :label="item.label"
        stack-label
      >
        <InputEditor
          v-if="item.editable"
          :editKey="item.value"
          :editRow="form[item.value]"
          obj="form"
        />
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
      <q-field color="black" outlined label="Defeito" stack-label>
        <InputEditor
          editKey="form.defect_obs"
          editRow="form.defect_obs"
          obj="form"
        />
        {{ form.defect_obs }}
      </q-field>
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
  data() {
    let client = ref({
      id: "",
      name: "",
      phone: "",
      document: "",
      mail: "",
    });
    let form = ref({
      client_id: "",
      branch_id: "",
      product: "",
      defect_obs: "",
      status: "",
      product_serial: "",
      created_by_user_id: useAuthStore().user_id,
    });
    const bus = inject("bus");
    bus.on("change", (value) => {
      let { editRow, editKey, row: linha } = value;
      let x = linha[editKey];
      console.log("testse", x);
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
    };
  },
  props: {
    type: String,
    row: Object,
    title: String,
  },
  methods: {
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
          editable: true,
          isOs: true,
          value: "service_cost",
          label: "Custo do serviço",
        },
        {
          isOs: true,
          value: "product_serial",
          label: "Serial",
        },
        {
          editable: true,
          isOs: true,
          value: "part_cost",
          label: "Custo da peça",
        },

        {
          editable: true,
          isOs: true,
          value: "ticket_amount",
          label: "Valor Total",
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
        ticket_amount,
      };
      useOsHistoryStore().setOsStatus(this.form.status);
    },

    async onSave() {
      let { status } = this.form;

      if (new RegExp(`^${status}$`, `gi`).test(useOsHistoryStore().status)) {
        this.$q.notify({
          type: "warning",
          position: "top",
          message: "Sem alteração",
          timeout: 1500,
        });
        return;
      }

      await api
        .post(
          `services/${this.$route.params.id}/set-status`,
          { status },
          {
            headers: {
              Authorization: useAuthStore().token,
              xid: useAuthStore().user_id,
            },
          }
        )
        .then((res) => {
          useOsHistoryStore().setOsStatus(status);
          this.$q.notify({
            type: "positive",
            position: "top",
            message: "Status alterado!",
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
  margin: 5em 25em;
  .q-field {
    padding: 0.7em 1em;
  }
  .q-select {
    padding: 0.7em 1em;
  }
}
</style>
