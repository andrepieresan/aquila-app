<template>
  <q-dialog>
    <q-card style="max-width: 70vw">
      <q-card-section>
        <div class="text-center text-h6">{{ title }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="scroll">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          style="height: 70vh; width: 60vw; padding: 1em"
        >
          <div style="float: left; width: 40%">
            <q-input
              standout
              v-model="name"
              label="Nome"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || '*']"
            />
            <q-input
              standout
              v-model="phone"
              label="Telefone"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || '*']"
            />
            <q-input standout v-model="doc" label="Documento" />
            <q-input standout v-model="doc" label="Endereço" />
          </div>
          <div style="float: right; width: 60%">
            <q-input
              standout
              v-model="product"
              label="Modelo"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || '*']"
            />
            <q-input
              standout
              v-model="phone"
              label="Marca"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || '*']"
            />
            <q-input
              standout
              v-model="phone"
              label="Serial"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || '*']"
            />

            <q-select
              standout
              v-model="model"
              :options="options"
              label="Situação da Ordem de Serviço"
            />
            <q-input standout v-model="text" label="Observação" autogrow />
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="xxx" color="primary" v-close-popup />
        <q-btn flat label="Salvar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  props: {
    title: {
      type: String,
    },
  },

  setup() {
    return {
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
.q-input {
  padding: 15px;
}
</style>
