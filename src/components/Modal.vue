<template>
  <q-dialog>
    <q-card style="max-width: 70vw">
      <q-card-section>
        <div style="padding: 0.5em" class="text-center text-h4">
          {{ title }}
        </div>
      </q-card-section>

      <q-separator />

      <!--STORE OS MODAL-->
      <q-card-section v-if="/store/gi.test(type)" class="scroll modalContent">
        <q-form
          @submit="onSave"
          @reset="onReset"
          style="height: 75vh; width: 60vw"
        >
          <div class="forms">
            <div style="margin-top: 1em; float: top">
              <div style="display: flex">
                <!-- BUSCAR POR CLIENTE | CRIAR CLIENTE-->
                <q-input
                  style="width: 60%"
                  standout
                  v-model="client.name"
                  label="Nome Cliente"
                >
                  <q-list>
                    <q-item v-for="c in clients" clickable>
                      <q-item-section>{{ c }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-input>
                <!-- BUSCAR POR NUMERO | CRIAR LOJA-->
                <q-input
                  style="width: 30%"
                  standout
                  v-model="client.phone"
                  label="Telefone"
                />
                <q-btn
                  style="width: 10%"
                  @click="searchClient"
                  color="primary"
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
              <q-input
                standout
                v-model="client.document"
                :key="client.document"
                label="Documento"
              />
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
              <!-- <q-input
              style="margin: 1em"
              standout
              v-model="text"
              type="textarea"
              label="Observação"
            /> -->
            </div>
          </div>
          <q-separator style />
          <q-card-actions style="padding: 1em" align="right">
            <!-- <q-btn
              flat
              type="cancel"
              label="xxx"
              color="primary"
              v-close-popup
            /> -->
            <q-btn
              v-close-popup
              flat
              type="submit"
              label="Salvar"
              color="primary"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>

      <!--UPDATE OS MODAL-->
      <q-card-section
        v-else-if="/edit/gi.test(type)"
        class="scroll modalContent"
      >
        <div class="formsEdit">
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            style="height: 70vh; width: 60vw"
          >
            <div style="display: inline-flex">
              <q-input standout v-model="branch" label="Nome" />
              <q-input standout v-model="phone" label="Telefone" lazy-rules />
              <q-input standout v-model="product" label="Produto" />
            </div>
            <!-- <div style="float: right; width: 40%">
              <q-input standout v-model="product" label="Produto" />
            </div> -->
            <div style="float: left; width: 100%; padding: 1em">
              <q-select
                standout
                v-model="model"
                :options="options"
                label="Situação da Ordem de Serviço"
              />
            </div>
            <div style="float: left; width: 100%; padding: 1em">
              <q-input
                standout
                v-model="text"
                type="textarea"
                label="Observação"
              />
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/Auth";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Modal",
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
  setup() {
    const clients = ref([]);
    const model = ref("");
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
      created_by_user_id: useAuthStore().user_id,
    });

    const getClientData = async (name, phone) => {
      try {
        if (!name && !phone) {
          return false;
        }
        return await api
          .get(`/client/${name}/${phone}`, {
            headers: {
              Authorization: useAuthStore().token,
              xid: useAuthStore().user_id,
            },
          })
          .then((res) => res?.data)
          .catch((e) => {});
      } catch (e) {
        console.log("sem autenticacao");
      }
    };

    const searchClient = async () => {
      let { name, phone } = client.value;
      let infoClient = await getClientData(name, phone);
      console.log(infoClient);
      if (!infoClient) {
        alert("nao existe este cliente");
        return false;
      }

      client.value.document = infoClient.document;
      client.value.mail = infoClient.mail;
      form.value.branch_name = infoClient.branch_name;
      form.value.branch_id = infoClient.branch_id;
      form.value.client_id = infoClient.client_id;
      return;
    };

    const onSave = async () => {
      try {
        const data = {
          client_id: form.value.client_id,
          branch_id: form.value.branch_id,
          created_by: useAuthStore().user_id,
          product: `${brand.value} ${model.value}`,
          product_serial: form.value.product_serial,
          status: form.value.status,
          defect_obs: form.value.defect_obs,
        };
        console.log({ data });
        return await api.post("/services/store", data, {
          headers: {
            Authorization: useAuthStore().token,
            xid: useAuthStore().user_id,
          },
        });
      } catch (e) {
        let message = `Error: ${e.message}`;
        console.log(message);
        console.log(e.stack);
      }
    };
    return {
      model,
      brand,
      form,
      client,
      clients,
      onSave,
      searchClient,
      options: [
        "Aguardando autorização do orçamento",
        "Aguardando cliente buscar",
        "Entregue",
        "Em manutenção",
        "Aguardando manutenção",
      ],
    };
  },
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
.formsEdit {
  // background-color: black;
  padding: 0.1em 2em;
  .q-input {
    padding: 0.7em 1em;
  }
  .q-select {
    padding: 0.7em 1em;
  }
}
</style>
