<template>
  <q-dialog v-model="showModal" persistent>
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
            <q-btn flat type="submit" label="Salvar" color="primary" />
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
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/Auth";
import { useClientStore } from "src/stores/Client";
import { inject, defineComponent, ref } from "vue";
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
    const bus = inject("bus");
    const $q = useQuasar();
    const showModal = ref(false);
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

    const getClientData = async (name, phone) => {
      try {
        if (!name && !phone) {
          return false;
        }
        return await api
          .get(`/client/${phone}`, {
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
      try {
        let { name, phone } = client.value;

        useClientStore().clear();

        if (!name && !phone) {
          $q.notify({
            type: "warning",
            position: "top",
            message: "Preencha telefone para encontrar o cliente",
            timeout: 1500,
          });
          return;
        }

        let infoClient = await getClientData(name, phone);

        if (infoClient) {
          client.value.document = infoClient.document;
          client.value.mail = infoClient.mail;
          // form.value.branch_name = infoClient.branch_name;
          client.value.name = infoClient.client_name;
          client.value.phone = infoClient.phone;

          useClientStore().setClient({
            branch_id: infoClient.branch_id,
            client_id: infoClient.client_id,
            name: infoClient.client_name,
            phone,
            document: infoClient.document,
            mail: infoClient.mail,
          });

          return $q.notify({
            type: "positive",
            position: "top",
            message: "Cliente encontrado",
            timeout: 1500,
          });
        }

        $q.notify({
          type: "negative",
          position: "top",
          message: "Cliente não cadastrado",
          timeout: 1500,
        });
      } catch (e) {}
    };

    const onSave = async () => {
      try {
        if (useClientStore().client.client_id === "") {
          let clientData = {
            name: client.value.name,
            phone: client.value.phone,
            document: client.value.document,
            mail: client.value.mail,
          };
          await api
            .post("/client/store", clientData, {
              headers: {
                Authorization: useAuthStore().token,
                xid: useAuthStore().user_id,
              },
            })
            .then((res) => {
              let client_id = res?.data?.id;
              useClientStore().setClientId(client_id);
              return;
            });
        }
        let osData = {
          client_id: useClientStore().client.client_id,
          branch_id: useClientStore().client.branch_id,
          created_by: useAuthStore().user_id,
          product: `${brand.value} ${model.value}`,
          product_serial: form.value.product_serial,
          status: form.value.status,
          defect_obs: form.value.defect_obs,
        };
        await api.post("/services/store", osData, {
          headers: {
            Authorization: useAuthStore().token,
            xid: useAuthStore().user_id,
          },
        });
        $q.notify({
          type: "positive",
          position: "center",
          message: "Ordem de serviço criada",
          timeout: 1500,
        });
        bus.emit("close");
        bus.emit("resetTableOs");
        clearForms();
      } catch (e) {
        $q.notify({
          type: "negative",
          position: "center",
          message: "Revise os campos",
          timeout: 1500,
        });
      }
    };
    return {
      newClient: ref(true),
      showModal,
      bus,
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
