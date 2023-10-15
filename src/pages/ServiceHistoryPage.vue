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
      sortBy="os_number"
      :rowsPerPage="10"
      :popup="true"
      :columns="columns"
      :rows="rows"
      class="main-table-content"
    />
  </div>
</template>
<script>
import { ref, inject } from "vue";
import { api } from "src/boot/axios";
import MainTable from "src/components/MainTable.vue";
import { useAuthStore } from "src/stores/Auth";
import { date } from "quasar";

export default {
  components: { MainTable },

  methods: {},

  setup() {
    const rows = ref([]);
    const bus = inject("bus");
    const columns = [
      {
        name: "client_name",
        label: "Nome Cliente",
        field: "client_name",
        align: "center",
      },
      {
        name: "os_number",
        align: "center",
        label: "Número de Os",
        field: "os_number",
        sortable: true,
      },
      { name: "product", label: "Produto", field: "product", align: "center" },
      { name: "status", label: "Status", field: "status", align: "center" },
      {
        name: "created_at",
        label: "Entrada",
        field: "created_at",
        align: "center",
        sortable: true,
        format: (value) => date.formatDate(value, `DD/MM/YYYY - HH:mm`),
      },
    ];
    const getRows = async () => {
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
    };

    bus.on("resetTableOs", async () => {
      rows.value = await getRows();
    });

    return {
      columns,
      getRows,
      rows,
    };
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
