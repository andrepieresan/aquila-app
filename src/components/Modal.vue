<template>
  <q-dialog>
    <q-card style="max-width: 70vw">
      <q-card-section>
        <div style="padding: 0.5em" class="text-center text-h4">
          {{ title }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="/store/gi.test(type)" class="scroll modalContent">
        <q-form
          class="forms"
          @submit="onSubmit"
          @reset="onReset"
          style="height: 70vh; width: 60vw"
        >
          <div style="margin-top: 1em; float: top; width: 100%">
            <q-input standout v-model="name" label="Nome Cliente"> </q-input>

            <q-input standout v-model="branch" label="Filial"> </q-input>
          </div>
          <div style="float: left; width: 60%">
            <q-input
              standout
              v-model="phone"
              label="Contato (Celular)"
              lazy-rules
            />
            <q-input standout v-model="doc" label="Documento" />
            <q-input standout v-model="mail" label="Endereço" />
          </div>
          <div style="float: right; width: 40%">
            <q-input standout v-model="product" label="Modelo" />
            <q-input standout v-model="phone" label="Marca" />
            <q-input standout v-model="phone" label="Serial" />
          </div>
          <div style="float: bottom; width: 100%">
            <q-select
              standout
              v-model="model"
              :options="options"
              label="Situação da Ordem de Serviço"
            />
            <q-input
              style="margin: 1em"
              standout
              v-model="text"
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
        </q-form>
      </q-card-section>

      <q-card-section
        v-else-if="/edit/gi.test(type)"
        class="scroll modalContent"
      >
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          style="height: 70vh; width: 60vw"
        >
          <div style="float: left; width: 40%">
            <q-input standout v-model="branch" label="Nome" />
            <q-input standout v-model="phone" label="Telefone" lazy-rules />
            <q-input standout v-model="doc" label="Documento" />
            <q-input standout v-model="doc" label="Endereço" />
          </div>
          <div style="float: right; width: 60%">
            <q-input standout v-model="product" label="Modelo" />
            <q-input standout v-model="phone" label="Marca" />
            <q-input standout v-model="phone" label="Serial" />
            <q-input standout v-model="text" label="#######" />
          </div>
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
.forms {
  margin: 1em 3em;
  .q-input {
    padding: 0.7em 1em;
  }
  .q-select {
    padding: 0.7em 1em;
  }
}
</style>
