<template>
  <MainTable class="main-table-content" />
</template>
<script>
import MainTable from "src/components/MainTable.vue";
export default {
  components: { MainTable },
  setup() {
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
