<template>
  <!--STORE OS MODAL-->
  <q-card-section class="scroll modalContent">
    <q-form @submit="onSave" @reset="onReset" style="height: 75vh; width: 60vw">
      <div class="forms">
        <div style="margin-top: 1em; float: top">
          <div style="display: flex">
            <q-input
              style="width: 60%"
              standout
              v-model="client.name"
              label="Nome Cliente"
            >
            </q-input>
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
          <q-input standout v-model="model" label="Modelo" />
          <q-input standout v-model="brand" label="Marca" />
          <q-input standout v-model="form.product_serial" label="Serial" />
        </div>
        <div style="float: bottom; width: 100%">
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
      <q-separator style />
      <q-card-actions style="padding: 1em" align="right">
        <q-btn
          flat
          @click="tes()"
          label="Cancelar"
          color="primary"
          v-close-popup
        />
        <q-btn flat type="submit" label="Salvar" color="primary" />
      </q-card-actions>
    </q-form>
  </q-card-section>
</template>
<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/Auth";
import { inject, defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
  name: "ModalEditOs",
  props: {
    type: {
      type: String,
    },
    row: {
      type: Object,
    },
    title: {
      type: String,
    },
  },
  created() {
    console.log("aqui", this.$route);
  },
  setup() {
    const bus = inject("bus");
    const $q = useQuasar();
    const model = ref("");
    const route = useRoute();
    const brand = ref("");
    const client = ref({
      id: "",
      name: "",
      phone: "",
      document: "",
      mail: "",
    });

    const form = ref({
      client_id: "",
      branch_id: "",
      product: "",
      defect_obs: "",
      status: "",
      product_serial: "",
      created_by_user_id: useAuthStore().user_id,
    });

    const clearForms = () => {
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
    };

    const tes = () => {
      route.params.id = "";
    };

    const getOsData = async (id) => {
      try {
        return await api
          .get(`/services/${id}`, {
            headers: {
              Authorization: useAuthStore().token,
              xid: useAuthStore().user_id,
            },
          })
          .then((res) => res?.data);
      } catch (e) {
        $q.notify({
          type: "warning",
          position: "top",
          message: "Cliente não cadastrado",
          timeout: 1500,
        });
      }
    };

    const onSave = async () => {
      console.log("aqxui", route.params);
    };

    return {
      tes,
      bus,
      model,
      brand,
      form,
      client,
      onSave,
      options: [
        "Aguardando autorização do orçamento",
        "Aguardando cliente buscar",
        "Entregue",
        "Em manutenção",
        "Aguardando manutenção",
      ],
    };
  },
  async mounted() {},
});
</script>

<style lang="scss">
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
