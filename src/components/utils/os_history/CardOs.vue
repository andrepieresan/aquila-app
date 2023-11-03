<template>
  <q-card-section class="row modalContent">
    <q-form @submit="onSave" style="height: 75vh; width: 60vw">
      <div class="forms row">
        <div class="col" style="display: flex; margin-top: 1em; float: top">
          <q-field style="width: 60%" standout label="Nome Cliente" stack-label>
            {{ client.name }}
          </q-field>
          <q-field style="width: 40%" standout label="Telefone" stack-label>
            {{ client.phone }}
          </q-field>
        </div>
        <div class="col" style="width: 100%">
          <q-field standout label="Filial" stack-label>
            {{ form.branch_name }}
          </q-field>
        </div>
        <div class="col" style="display: flex">
          <q-field style="width: 50%" standout label="Produto" stack-label>
            {{ form.product }}
          </q-field>
          <q-field style="width: 50%" standout label="Serial" stack-label>
            {{ form.product_serial }}
          </q-field>
        </div>
        <div class="col">
          <q-select
            standout
            v-model="form.status"
            :options="options"
            label="Situação da Ordem de Serviço"
          />
          <q-input
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
        branch_name,
        client_name,
        client_phone,
        created_at,
        os_number,
        product,
        product_serial,
        status,
        defect_obs,
      } = await this.getOsData(this.$route.params.id);

      this.client = {
        name: client_name,
        phone: client_phone,
      };
      this.form = {
        branch_name,
        product,
        product_serial,
        status,
        defect_obs,
      };
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
  display: block;
  padding: 0.1em 2em;
  .q-field {
    padding: 0.7em 1em;
  }
  .q-select {
    padding: 0.7em 1em;
  }
}
</style>
