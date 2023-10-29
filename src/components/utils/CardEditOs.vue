<template>
  <q-card-section class="modalContent">
    <q-form @submit="onSave" @reset="onReset" style="height: 75vh; width: 60vw">
      <div class="forms">
        <div style="margin-top: 1em; float: top">
          <div style="display: flex">
            <q-input
              style="width: 60%"
              standout
              v-model="client.name"
              label="Nome Cliente"
            />
            <q-input
              style="width: 40%"
              standout
              v-model="client.phone"
              label="Telefone"
            />
          </div>
        </div>
        <div style="float: left; width: 60%">
          <q-input
            standout
            v-model="form.branch_name"
            label="Filial"
            lazy-rules
          />
          <q-input standout v-model="client.document" label="Documento" />
          <q-input standout v-model="client.mail" label="Endereço" />
        </div>
        <div style="float: right; width: 40%">
          <q-input standout v-model="form.product" label="produto" />
          <q-input standout v-model="form.product_serial" label="Serial" />
        </div>
        <div>
          <q-select
            standout
            v-model="form.status"
            :options="options"
            label="Situação da Ordem de Serviço"
          />
          <q-input
            style="margin: 1em"
            standout
            v-model="form.defect_obs"
            type="textarea"
            label="Defeito"
          />
        </div>
      </div>
      <q-separator />
      <div class="btn-bottom">
        <q-card-actions align="right">
          <q-btn
            flat
            to="/os-history"
            label="Cancelar"
            color="primary"
            v-close-popup
          />
          <q-btn flat type="submit" label="Salvar" color="primary" />
        </q-card-actions>
      </div>
    </q-form>
  </q-card-section>
</template>
<script>
import { defineComponent } from "vue";
import { useAuthStore } from "src/stores/Auth";

export default defineComponent({
  name: "CardEditOs",
  data() {
    return {
      options: [
        "Aguardando autorização do orçamento",
        "Aguardando cliente buscar",
        "Entregue",
        "Em manutenção",
        "Aguardando manutenção",
      ],
      model: "",
      brand: "",
      form: {
        client_id: "",
        branch_id: "",
        product: "",
        defect_obs: "",
        status: "",
        product_serial: "",
        created_by_user_id: useAuthStore().user_id,
      },
      client: {
        id: "",
        name: "",
        phone: "",
        document: "",
        mail: "",
      },
    };
  },
  props: {
    type: String,
    row: Object,
    title: String,
  },
  methods: {
    clearForms() {
      client.value = { id: "", name: "", phone: "", document: "", mail: "" };
      form.value = {
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
        client_name,
        client_phone,
        created_at,
        os_number,
        product,
        product_serial,
        status,
        branch_name,
      } = await this.getOsData(this.$route.params.id);
      this.client.name = "x";
      this.client = {
        name: client_name,
        phone: client_phone,
      };
      this.form = {
        branch_name,
        product_serial,
        status,
        defect_obs,
      };
      console.log({ client_name, client_phone });
    },

    async onSave() {
      console.log("aqxui", route.params);
    },
  },
  async mounted() {
    this.setData();
  },
});
</script>

<style lang="scss">
.modalContent {
  display: flex;
  justify-content: center;
}
.btn-bottom {
  margin: 4em 1em;
}
.forms {
  padding: 0.1em 2em;
  .q-input {
    padding: 0.7em 1em;
  }
  .q-select {
    padding: 0.7em 1em;
  }
}
</style>
