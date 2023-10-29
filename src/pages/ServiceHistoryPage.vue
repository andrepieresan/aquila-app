<template>
  <div class="context">
    <q-input
      class="search"
      rounded
      outlined
      v-model="search"
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
      :columns="setColumns()"
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
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

export default {
  components: { MainTable },

  methods: {
    async filterRows(text) {
      this.rows = (this.rows || []).filter((os) => {
        if (
          new RegExp(`${text}`, `gi`).test(os.client_name) ||
          new RegExp(`${text}`, `gi`).test(os.os_number) ||
          new RegExp(`${text}`, `gi`).test(os.branch_name)
        ) {
          return os;
        }
      });
      if (!text) {
        this.rows = await this.getRows();
      }
    },
    setColumns() {
      return [
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
        },
        {
          name: "product",
          label: "Produto",
          field: "product",
          align: "center",
        },
        {
          name: "branch_name",
          label: "Filial",
          field: "branch_name",
          align: "center",
        },
        { name: "status", label: "Status", field: "status", align: "center" },
        {
          name: "created_at",
          label: "Entrada",
          field: "created_at",
          align: "center",
        },
      ];
    },
  },
  setup() {
    const search = ref("");
    const rows = ref([]);
    const bus = inject("bus");

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
      return rows;
    };

    bus.on("resetTableOs", async () => {
      rows.value = await getRows();
    });

    return {
      search,
      getRows,
      rows,
    };
  },
  async mounted() {
    this.rows = await this.getRows();
  },
  watch: {
    search(text) {
      this.filterRows(text);
    },
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
