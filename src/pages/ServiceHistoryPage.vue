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
      <template v-slot:after>
        <q-btn icon="event" round color="grey">
          <q-popup-proxy
            :offset="[-20, -20]"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              :locale="{
                months,
                monthsShort,
              }"
              v-model="date"
              default-view="Months"
              mask="DD/MM/YYYY"
              range
              minimal
            >
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="Cancel" color="primary" flat v-close-popup />
                <q-btn
                  label="OK"
                  color="primary"
                  flat
                  @click="save"
                  v-close-popup
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
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
import CustomParseFormat from "dayjs/plugin/customParseFormat";

export default {
  components: { MainTable },

  methods: {
    async getRows() {
      let { from, to } = this.date;
      dayjs.extend(CustomParseFormat);
      from = dayjs(from, "DD-MM-YYYY").format("YYYY-MM-DD");
      to = dayjs(to, "DD-MM-YYYY").format("YYYY-MM-DD");
      let rows = await api
        .get(`/services/${from}/${to}`, {
          headers: {
            Authorization: useAuthStore().token,
            xid: useAuthStore().user_id,
          },
        })
        .then((res) => res.data)
        .catch((e) => console.log(e.message));
      return rows;
    },
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
        {
          name: "status",
          label: "Status",
          field: "status",
          align: "center",
        },
        {
          name: "created_at",
          label: "Entrada",
          field: "created_at",
          align: "center",
          sortOrder: "ad",
          sortable: true,
          sort: (a, b, rowA, rowB) => {
            if (dayjs(a).unix() < dayjs(b).unix()) {
              return 1;
            } else {
              return -1;
            }
          },
          format: (value, row) => dayjs(value).format("DD/MM/YYYY HH:mm:ss"),
        },
      ];
    },
    async save() {
      this.rows = await this.getRows();
    },
  },
  setup() {
    const search = ref("");
    const rows = ref([]);
    const bus = inject("bus");
    const date = ref({
      from: dayjs().subtract(1, "month").format("DD/MM/YYYY"),
      to: dayjs().format("DD/MM/YYYY"),
    });

    bus.on("resetTableOs", async () => {
      rows.value = await this.getRows();
    });

    return {
      monthsShort: [
        "JAN",
        "FEV",
        "MAR",
        "ABR",
        "MAIO",
        "JUN",
        "JUL",
        "AGO",
        "SET",
        "OUT",
        "NOV",
        "DEZ",
      ],
      months: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ],
      date,
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
