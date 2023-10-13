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
                v-model="form.branch_id"
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
            <q-btn
              flat
              type="submit"
              label="Salvar"
              color="primary"
              v-close-popup
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
      created_by_user_id: "",
    });
    const getClientList = async (name = "", phone = "") => {
      if (!phone) {
        return await api
          .get(`/client/${name}`)
          .then((res) => res?.data)
          .catch((e) => console.log({ e }));
      }
      return await api
        .get(`/client/${name}/${phone}`)
        .then((res) => res?.data)
        .catch((e) => console.log({ e }));
    };
    const searchClient = async () => {
      let { name, phone } = client.value;
      let clients = await getClientList(name, phone);
      // let clients = [
      //   { id: "", name: "aaa", phone: "", document: "", mail: "" },
      //   { id: "", name: "bbb", phone: "", document: "", mail: "" },
      //   { id: "", name: "cccc", phone: "", document: "", mail: "" },
      // ];
      console.log({ clients });
      let c = clients.filter((c) => new RegExp(`${name}`).test(c.name));
      // client.product.name = result.name;
      // client.product.document = result.document;
      // client.product.phone = result.phone;
      // client.product.mail = result.mail;
      console.log(client.value, { c });
    };

    const onSave = () => {
      try {
        form.value.product = `${brand.value} ${model.value}`;
        console.log("xx", form.value);
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
