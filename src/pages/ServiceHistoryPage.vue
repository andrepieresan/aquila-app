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
import { ref } from "vue";
import { api } from "src/boot/axios";
import MainTable from "src/components/MainTable.vue";
import { useAuthStore } from "src/stores/Auth";

const columns = [
  {
    name: "os_number",
    align: "center",
    label: "Número de Os",
    field: "os_number",
    sortable: true,
  },
  {
    name: "client_name",
    label: "Nome Clientxe",
    align: "left",
  },
  { name: "product", label: "Produto", field: "product", sortable: true },
  { name: "status", label: "Status", field: "status" },
  { name: "created_at", label: "Entrada", field: "received_at" },
];

export default {
  components: { MainTable },

  setup() {
    const rows = ref([]);
    return {
      rows,
      columns,
    };
  },

  methods: {
    async getRows() {
      let rows = await api
        .get("/services", {
          headers: {
            Authorization: useAuthStore().token,
            xid: useAuthStore().user_id,
          },
        })
        .then((res) => res.data)
        .catch((e) => {});
      console.log(rows);
      return rows;
    },
  },

  async mounted() {
    this.rows = await this.getRows();
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
