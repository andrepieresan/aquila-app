<template>
  <MainTable :columns="columns" :rows="rows" class="main-table-content" />
</template>
<script>
import MainTable from "src/components/MainTable.vue";
export default {
  components: { MainTable },
  setup() {
    const columns = [
      {
        name: "client_name",
        label: "Nome Cliente",
        field: "client_name",
        align: "center",
      },
      {
        name: "client_name",
        label: "Nome Cliente",
        field: "client_name",
        align: "center",
      },
    ];
    return {
      setup() {
        return {
          columns,
          rows,
        };
      },
    };
  },
};
</script>
<style lang="scss"></style>
