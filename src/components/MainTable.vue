<template>
  <q-table
    class="my-sticky-header-last-column-table"
    flat
    bordered
    :title="headerTitle"
    :rows="rows"
    :columns="columns"
    row-key="name"
    @row-click="layout = true"
  >
    <template v-slot:body-cell-actions="props">
      <q-tr :props="props">
        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="os_number" :props="props">
          {{ props.row.os_number }}
        </q-td>
        <q-td key="product" :props="props">
          <div class="text-pre-wrap">{{ props.row.product }}</div>
        </q-td>
        <q-td key="close_at" :props="props">
          {{ props.row.close_at }}
        </q-td>
        <q-td key="received_at" :props="props">
          {{ props.row.received_at }}
        </q-td>
        <q-td key="send_at" :props="props">
          {{ props.row.send_at }}
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <Modal v-model="layout" title="Editar ordem de serviço" />
</template>

<script>
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
import { defineComponent, ref } from "vue";
import Modal from "./Modal.vue";

export default defineComponent({
  name: "MainTable",
  props: {
    headerTitle: {
      type: String,
    },
  },
  setup() {
    return {
      layout: ref(false),
      columns,
      rows,
    };
  },
  components: { Modal },

  methods: {},
});
</script>

<style lang="scss">
.my-sticky-header-last-column-table {
  // height: 310px;
  // max-width: 600px;

  td:last-child {
    background-color: #00b4ff;
  }
  tr th {
    position: sticky;
    z-index: 2;
    background: #00b4ff;
  }
  thead tr:last-child th {
    top: 48px;
    z-index: 3;
  }
  thead tr:first-child th {
    top: 0;
    z-index: 1;
  }
  tr:last-child th:last-child {
    z-index: 3;
  }
  td:last-child {
    z-index: 1;
  }
  td:last-child,
  th:last-child {
    position: sticky;
    right: 0;
  }
  tbody {
    scroll-margin-top: 48px;
  }
}
</style>
