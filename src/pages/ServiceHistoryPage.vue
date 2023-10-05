<template>
  <div class="context">
    <q-input
      class="search"
      rounded
      outlined
      v-model="text"
      label="Pesquisar cliente, número de os"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <MainTable class="main-table-content" />
  </div>
</template>
<script>
import MainTable from "src/components/MainTable.vue";

export default {
  components: { MainTable },
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
