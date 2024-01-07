<template>
  <div class="main">
    <q-card-section>
      <q-form class="row forms" @submit="onSave">
        <div class="col-6" v-for="item in items()">
          <q-input
            label-color="black-7"
            :label="item.label"
            v-model="this[item.value]"
            outlined
          />
        </div>
        <div class="bottom">
          <q-card-actions align="right">
            <q-btn
              text-color="blue-7"
              flat
              label="Cancelar"
              color="primary"
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
    </q-card-section>
  </div>
</template>
<script>
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/Auth";
import { inject, defineComponent, ref } from "vue";

export default defineComponent({
  name: "ModalStoreOs",
  data() {
    return {
      code: ref(""),
      name: ref(""),
      qty: ref(""),
      initial_qty: ref(""),
      sale_cost: ref(""),
      btnClient: ref(false),
      authStore: useAuthStore(),
      bus: inject("bus"),
      showModal: ref(false),
    };
  },
  methods: {
    items() {
      return [
        {
          value: "code",
          label: "Código",
        },
        {
          value: "name",
          label: "Nome",
        },
        {
          value: "qty",
          label: "Quantidade",
        },
        {
          value: "sale_cost",
          label: "Valor de custo",
        },
      ];
    },

    clearForms() {
      this.code = "";
      this.name = "";
      this.qty = "";
      this.sale_cost = "";
    },

    async onSave() {
      try {
        let { code, name, qty, sale_cost } = this;
        console.log({ code, name, qty, sale_cost });
        await api
          .post(
            "/materials/store",
            { code, name, qty, sale_cost },
            {
              headers: {
                Authorization: useAuthStore().token,
                xid: useAuthStore().user_id,
              },
            }
          )
          .then((res) => {
            this.$q.notify({
              type: "positive",
              position: "center",
              message: "Material adicionado",
              timeout: 1500,
            });
            this.bus.emit("close-modal");
            // this.bus.emit("resetTableOs");
            this.clearForms();
          })
          .catch((e) =>
            this.$q.notify({
              type: "negative",
              position: "top",
              message: "Algo deu errado!",
              timeout: 1500,
            })
          );
      } catch (e) {
        this.$q.notify({
          type: "negative",
          position: "top",
          message: "Revise os campos",
          timeout: 1500,
        });
      }
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
