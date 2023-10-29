<template>
  <q-table
    class="my-sticky-header-last-column-table"
    flat
    bordered
    :title="headerTitle"
    :rows="rows"
    :columns="columns"
    :pagination="pagination"
  >
    <template v-slot:header-cell="props">
      <q-th :props="props">{{ props.col.label }} </q-th>
    </template>
    <template v-slot:loading="props">
      <q-inner-loading>
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </template>
    <template v-slot:no-data="props"> </template>
    <template v-slot:body-cell="props">
      <q-td :props="props">{{ props.value }} </q-td>
      <q-menu v-if="popup" touch-position>
        <q-list>
          <!-- <q-item clickable>
              <q-item-section>test#dados:{{ props.row }}</q-item-section>
            </q-item> -->
          <q-item v-close-popup clickable>
            <q-item-section @click="visualizer(props.row.os_number)"
              >Visualizar</q-item-section
            >
          </q-item>
          <q-item v-close-popup clickable>
            <q-item-section @click="edit(props.row.os_number)"
              >Editar</q-item-section
            >
          </q-item>
          <q-item v-close-popup clickable>
            <q-item-section>Finalizar</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </template>
  </q-table>
  <Modal v-model="modal" type="edit" title="Editar ordem de serviço" />
</template>

<script>
import { defineComponent, ref, inject } from "vue";
import Modal from "./Modal.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MainTable",
  components: { Modal },
  props: {
    sortBy: {
      type: String,
    },
    rowsPerPage: {
      type: Number,
    },
    popup: {
      type: Boolean,
    },
    columns: {
      type: Array,
    },
    rows: {
      type: Object,
    },
    headerTitle: {
      type: String,
    },
  },
  setup(props) {
    const router = useRouter();
    let modal = ref(false);
    const edit = (id) => {
      router.push({ name: `os-edit`, params: { id } });
    };
    const visualizer = (id) => {
      router.push({ name: `os-card`, params: { id } });
    };
    return {
      modal,
      edit,
      visualizer,
      pagination: {
        sortBy: props.sortBy,
        descending: true,
        page: 1,
        rowsPerPage: props.rowsPerPage,
      },
    };
  },

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
  td:first-child {
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
