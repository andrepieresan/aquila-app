<template>
  <!--STORE OS MODAL-->
  <q-card-section class="scroll modalContent">
    <q-form @submit="onSave" style="height: 75vh; width: 60vw">
      <div class="forms">
        <div class="row sectionLeft">
          <q-input
            class="col-6"
            label="Primeiro nome"
            v-model="client.name"
            standout
          />
          <q-input
            class="col-6"
            label="Telefone"
            v-model="client.phone"
            standout
          >
            <template v-slot:after>
              <q-btn
                id="save-btn"
                icon="saved_search"
                @click="searchClient()"
                color="primary"
              />
            </template>
          </q-input>
          <q-input
            class="col-6"
            label="Filial"
            v-model="form.branch_name"
            standout
          />
          <q-input class="col-6" label="Modelo" v-model="model" standout />
          <q-input
            class="col-6"
            label="Documento"
            v-model="client.document"
            standout
          />
          <q-input class="col-6" label="Marca" v-model="brand" standout />
          <q-input
            class="col-6"
            label="Endereço"
            v-model="client.mail"
            standout
          />
          <q-input
            class="col-6"
            label="Serial"
            v-model="form.product_serial"
            standout
          />
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
          v-if="btnClient"
          flat
          label="Editar Cliente"
          color="primary"
          @click="editClient(client)"
        />
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn flat type="submit" label="Salvar" color="primary" />
      </q-card-actions>
    </q-form>
  </q-card-section>
</template>
<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/Auth";
import { useClientStore } from "src/stores/Client";
import { inject, defineComponent, ref } from "vue";

export default defineComponent({
  name: "ModalStoreOs",
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
  data() {
    return {
      btnClient: ref(false),
      authStore: useAuthStore(),
      bus: inject("bus"),
      options: [
        "Aguardando autorização do orçamento",
        "Aguardando cliente buscar",
        "Entregue",
        "Em manutenção",
        "Aguardando manutenção",
      ],
      showModal: ref(false),
      model: ref(""),
      brand: ref(""),
      client: ref({
        id: "",
        name: "",
        phone: "",
        document: "",
        mail: "",
      }),
      form: {
        client_id: ref(""),
        branch_id: ref(""),
        branch_name: ref(""),
        product: ref(""),
        defect_obs: ref(""),
        status: ref(""),
        product_serial: ref(""),
        created_by_user_id: useAuthStore().user_id,
      },
    };
  },
  methods: {
    clearForms() {
      this.client = {
        id: "",
        name: "",
        phone: "",
        document: "",
        mail: "",
      };
      this.form = {
        client_id: "",
        branch_id: "",
        product: "",
        defect_obs: "",
        status: "",
        product_serial: "",
      };
      this.brand = "";
      this.model = "";
      useClientStore().clear();
    },
    async getClientData(name, phone) {
      try {
        if (!name && !phone) {
          return false;
        }
        // name = name.replace("", "-");
        return await api
          .get(`/client/${phone}/${name}`, {
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
    async searchClient() {
      try {
        let { name, phone } = this.client;

        console.log(name, phone);
        useClientStore().clear();

        if (!name && !phone) {
          this.$q.notify({
            type: "warning",
            position: "top",
            message: "Preencha telefone para encontrar o cliente",
            timeout: 1500,
          });
          return;
        }

        let infoClient = await this.getClientData(name, phone);

        console.log(infoClient);
        if (infoClient) {
          this.client.document = infoClient.document;
          this.client.mail = infoClient.mail;
          this.client.id = infoClient.client_id;
          // this.form.branch_name = infoClient.branch_name;
          this.client.name = infoClient.client_name;
          this.client.phone = infoClient.phone;

          useClientStore().setClient({
            branch_id: infoClient.branch_id,
            client_id: infoClient.client_id,
            name: infoClient.client_name,
            phone,
            document: infoClient.document,
            mail: infoClient.mail,
          });
          this.btnClient = true;
          return this.$q.notify({
            type: "positive",
            position: "top",
            message: "Cliente encontrado",
            timeout: 1500,
          });
        }
      } catch (e) {}
    },
    async onSave() {
      try {
        let branch_id = "";
        let client_id = "";
        let { branch_name, product_serial, status, defect_obs } = this.form;

        if (useClientStore().client.client_id === "") {
          let clientData = {
            name: this.client.name,
            phone: this.client.phone,
            document: this.client.document,
            mail: this.client.mail,
          };
          await api
            .post("/client", clientData, {
              headers: {
                Authorization: useAuthStore().token,
                xid: useAuthStore().user_id,
              },
            })
            .then((res) => {
              client_id = res?.data?.id;
              useClientStore().setClientId(client_id);
              console.log(client_id);
            })
            .catch((e) => {
              alert(`sem sucess`);
            });
        }

        if (branch_name) {
          console.log(branch_name);
          // return;
          branch_id = await api
            .post(`/branch`, { branch_name })
            .then((res) => res?.data)
            .catch((e) => console.log(e.message));
        }

        let osData = {
          client_id: useClientStore().client.client_id | client_id,
          branch_id,
          created_by: useAuthStore().user_id,
          product: `${this.brand} ${this.model}`,
          product_serial,
          status,
          defect_obs,
        };
        console.log({ osData });
        // return;////
        await api.post("/services/store", osData, {
          headers: {
            Authorization: useAuthStore().token,
            xid: useAuthStore().user_id,
          },
        });
        this.$q.notify({
          type: "positive",
          position: "center",
          message: "Ordem de serviço criada",
          timeout: 1500,
        });
        this.bus.emit("close-modal");
        this.bus.emit("resetTableOs");
        this.clearForms();
      } catch (e) {
        this.$q.notify({
          type: "negative",
          position: "top",
          message: "Revise os campos",
          timeout: 1500,
        });
      }
    },
    async editClient(client) {
      console.log(client);
      if (
        new RegExp(`^${client.name}$`, `gi`).test(
          useClientStore().client.name
        ) &
        new RegExp(`^${client.mail}$`, `gi`).test(
          useClientStore().client.mail
        ) &
        new RegExp(`^${client.document}$`, `gi`).test(
          useClientStore().client.document
        ) &
        new RegExp(`^${client.phone}$`, `gi`).test(
          useClientStore().client.phone
        )
      ) {
        this.$q.notify({
          type: "negative",
          position: "top",
          message: "Nenhum campo alterado",
          timeout: 1500,
        });
        return;
      }
      const data = {
        name: client.name,
        phone: client.phone,
        mail: client.mail,
        document: client.document,
      };

      return await api
        .put(
          `/client/${useClientStore().client.phone}/${
            useClientStore().client.name
          }`,
          data
        )
        .then((res) => {
          useClientStore().setClient({
            client_id: client.id,
            name: client.name,
            phone: client.phone,
            document: client.document,
            mail: client.mail,
          });
          this.$q.notify({
            type: "positive",
            position: "top",
            message: "Cliente editado ;D",
            timeout: 1500,
          });
        })
        .catch((e) =>
          this.$q.notify({
            type: "negative",
            position: "top",
            message: "Tivemos algum problema",
            timeout: 1500,
          })
        );
    },
  },
  beforeUnmount() {
    this.clearForms();
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
  #save-btn {
    margin: 1.4em 0.3em;
    // margin-left: 40px;
    width: 20px;
    height: 20px;
  }
}
</style>
