<template>
  <div class="context">
    <q-input
      class="search"
      rounded
      outlined
      v-model="text"
      label="Pesquisar cliente, loja ou número de os"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <MainTable
      :popup="true"
      :columns="columns"
      :rows="rows"
      class="main-table-content"
    />
  </div>
</template>
<script>
import MainTable from "src/components/MainTable.vue";

const columns = [
  {
    name: "name",
    required: true,
    label: "Nome Cliente",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "os_number",
    align: "center",
    label: "Número de Os",
    field: "os_number",
    sortable: true,
  },
  { name: "product", label: "Produto", field: "product", sortable: true },
  { name: "close_at", label: "Fechado", field: "close_at" },
  { name: "received_at", label: "Entrada", field: "received_at" },
  {
    name: "send_at",
    label: "Saida",
    field: "send_at",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
];

const rows = [
  {
    name: "ANDRE DEKO",
    os_number: 159,
    product: "NEXTEL",
    close_at: "DD/MM/YYYY",
    received_at: "DD/MM/YYYY",
    send_at: "DD/MM/YYYY",
  },
  {
    name: "ANDRE DEKO",
    os_number: 151,
    product: "NEXTEL",
    close_at: "DD/MM/YYYY",
    received_at: "DD/MM/YYYY",
    send_at: "DD/MM/YYYY",
  },
  {
    name: "ANDRE DEKO",
    os_number: 152,
    product: "NEXTEL",
    close_at: "DD/MM/YYYY",
    received_at: "DD/MM/YYYY",
    send_at: "DD/MM/YYYY",
  },
  {
    name: "ANDRE DEKO",
    os_number: 153,
    product: "NEXTEL",
    close_at: "DD/MM/YYYY",
    received_at: "DD/MM/YYYY",
    send_at: "DD/MM/YYYY",
  },
  {
    name: "ANDRE DEKO",
    os_number: 154,
    product: "NEXTEL",
    close_at: "DD/MM/YYYY",
    received_at: "DD/MM/YYYY",
    send_at: "DD/MM/YYYY",
  },
  {
    name: "ANDRE DEKO",
    os_number: 155,
    product: "NEXTEL",
    close_at: "DD/MM/YYYY",
    received_at: "DD/MM/YYYY",
    send_at: "DD/MM/YYYY",
  },
  {
    name: "ANDRE DEKO",
    os_number: 156,
    product: "NEXTEL",
    close_at: "DD/MM/YYYY",
    received_at: "DD/MM/YYYY",
    send_at: "DD/MM/YYYY",
  },
  {
    name: "ANDRE DEKO",
    os_number: 157,
    product: "NEXTEL",
    close_at: "DD/MM/YYYY",
    received_at: "DD/MM/YYYY",
    send_at: "DD/MM/YYYY",
  },
  {
    name: "ANDRE DEKO",
    os_number: 158,
    product: "NEXTEL",
    close_at: "DD/MM/YYYY",
    received_at: "DD/MM/YYYY",
    send_at: "DD/MM/YYYY",
  },
  {
    name: "ANDRE DEKO",
    os_number: 159,
    product: "NEXTEL",
    close_at: "DD/MM/YYYY",
    received_at: "DD/MM/YYYY",
    send_at: "DD/MM/YYYY",
  },
];
export default {
  components: { MainTable },
  setup() {
    return {
      rows,
      columns,
    };
  },
};
</script>
<style lang="scss">
.search {
  justify-self: center;
  width: 60vw;
  padding-bottom: 3em;
}
.context {
  display: grid;
  padding: 3em;
}
</style>
