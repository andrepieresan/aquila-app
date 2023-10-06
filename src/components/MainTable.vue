<template>
  <q-table
    class="my-sticky-header-last-column-table"
    flat
    bordered
    :title="headerTitle"
    :rows="rows"
    :columns="columns"
    row-key="name"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-menu v-if="popup" touch-position>
          <q-list>
            <!-- <q-item clickable>
              <q-item-section>test#dados:{{ props.row }}</q-item-section>
            </q-item> -->
            <q-item v-close-popup clickable>
              <q-item-section>Visualizar</q-item-section>
            </q-item>
            <q-item v-close-popup clickable>
              <q-item-section @click="edit = true">Editar</q-item-section>
            </q-item>
            <q-item v-close-popup clickable>
              <q-item-section>Finalizar</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
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

  <Modal v-model="edit" type="edit" title="Editar ordem de serviço" />
</template>

<script>
import { defineComponent, ref } from "vue";
import Modal from "./Modal.vue";

export default defineComponent({
  name: "MainTable",
  props: {
    popup: {
      type: Boolean,
    },
    columns: {
      type: Object,
    },
    rows: {
      type: Object,
    },
    headerTitle: {
      type: String,
    },
  },
  setup() {
    return {
      edit: ref(false),
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
