<template>
  <div class="context">
    <q-input
      class="search"
      rounded
      outlined
      v-model="search"
      label="Pesquisar material"
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
import { useOsHistoryStore } from "src/stores/OsHistory";
import dayjs from "dayjs";
import CustomParseFormat from "dayjs/plugin/customParseFormat";

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
          name: "code",
          label: "Código",
          field: "code",
          align: "center",
        },
        {
          name: "name",
          align: "center",
          label: "Nome",
          field: "name",
        },
        {
          name: "qty",
          label: "Quantidade",
          field: "qty",
          align: "center",
        },
        {
          name: "sale_cost",
          label: "Custo",
          field: "sale_cost",
          align: "center",
        },
        {
          name: "status",
          label: "Status",
          field: "status",
          align: "center",
        },
        {
          name: "branch_name",
          label: "Filial",
          field: "branch_name",
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
        .get(
          `/materials`,
          {
            headers: {
              Authorization: useAuthStore().token,
              xid: useAuthStore().user_id,
            },
          }
        )
        .then((res) => res.data)
        .catch((e) => console.log(e.message));
        console.log(rows);
      return rows;
    };

    bus.on("resetTableOs", async () => {
      rows.value = await getRows();
    });

    return {
      getRows,
      search,
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
.main-table-content {
  min-width: 40vw;
  margin: 1em 7em;
}
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
