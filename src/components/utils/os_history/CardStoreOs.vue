<template>
  <div class="main">
    <q-card-section>
      <q-form class="row forms" @submit="onSave">
        <div class="col-6" v-for="item in items()">
          <q-input
            label-color="black-7"
            v-if="item.isClient"
            :label="item.label"
            v-model="client[item.value]"
            outlined
          >
            <template v-if="/phone/gi.test(item.value)" v-slot:after>
              <q-btn
                id="search_btn"
                icon="saved_search"
                @click="searchClient()"
                color="primary"
              />
            </template>
          </q-input>
          <q-input
            label-color="black-7"
            v-else-if="item.isOs"
            :label="item.label"
            v-model="form[item.value]"
            outlined
          />
        </div>
        <div class="bottom">
          <q-select
            label-color="black-7"
            outlined
            v-model="form.status"
            :options="options"
            label="Situação da Ordem de Serviço"
          />
          <q-input
            label-color="black-7"
            outlined
            v-model="form.defect_obs"
            type="textarea"
            label="Defeito"
          />
          <q-card-actions align="right">
            <q-btn
              text-color="blue-7"
              v-if="btnClient"
              flat
              label="Editar Cliente"
              @click="editClient(client)"
            />
            <q-btn
              text-color="blue-7"
              flat
              label="Cancelar"
              color="primary"
              v-close-popup
            />
            <q-btn text-color="blue-7" flat type="submit" label="Salvar" />
          </q-card-actions>
        </div>
      </q-form>
    </q-card-section>
  </div>
</template>
<script>
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/Auth";
import { useClientStore } from "src/stores/Client";
import { inject, defineComponent, ref } from "vue";

export default defineComponent({
  name: "ModalStoreOs",
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
        model: ref(""),
        brand: ref(""),
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
    items() {
      return [
        {
          isClient: true,
          value: "name",
          label: "Primeiro nome",
        },
        {
          isClient: true,
          value: "phone",
          label: "Telefone",
        },
        {
          isClient: true,
          value: "document",
          label: "Documento",
        },
        {
          isOs: true,
          value: "model",
          label: "Modelo",
        },
        {
          isClient: true,
          value: "mail",
          label: "Endereço",
        },
        {
          isOs: true,
          value: "brand",
          label: "Marca",
        },
        {
          isOs: true,
          value: "branch_name",
          label: "Filial",
        },
        {
          isOs: true,
          value: "product_serial",
          label: "Serial",
        },
      ];
    },
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
    async getClientData(name, contact) {
      try {
        if (!name && !contact) {
          return false;
        }

        let data = { name, contact };
        // name = name.replace("", "-");
        return await api
          .post(`/client/show`, data, {
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
        useClientStore().clear();

        name = name.trimEnd();
        name = name.trimStart();
        let contact = phone.trim();

        if (!name && !contact) {
          this.$q.notify({
            type: "warning",
            position: "top",
            message: "Preencha para encontrar o cliente",
            timeout: 1500,
          });
          return;
        }
        let infoClient = await this.getClientData(name, contact);

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
            contact,
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
            contact: this.client.phone,
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
              client_id = res?.data;
              useClientStore().setClientId(client_id);
            })
            .catch((e) => {
              alert(`sem sucess`);
            });
        }

        if (branch_name) {
          branch_id = await api
            .post(`/branch`, { branch_name })
            .then((res) => res?.data)
            .catch((e) => console.log(e.message));
        }

        let osData = {
          client_id: useClientStore().client.client_id | client_id,
          branch_id,
          created_by_user_id: useAuthStore().user_id,
          product: `${this.form.brand} ${this.form.model}`,
          product_serial,
          status,
          defect_obs,
        };

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
        contact: client.phone,
        mail: client.mail,
        document: client.document,
      };
      return await api
        .post(`/client/update`, data)
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
.main {
  width: 50vw;
  .forms {
    margin: 2em 0;
    min-width: 40vw;
    min-height: 35vh;
    padding: 2em 2em;
    .q-field {
      padding: 0.7em 1em;
    }
    .q-select {
      padding: 0.7em 1em;
    }
    #search_btn {
      margin: 1.4em 0.3em;
      // margin-left: 40px;
      width: 20px;
      height: 20px;
    }
    .bottom {
      float: bottom;
      width: 100%;
    }
  }
}
</style>
