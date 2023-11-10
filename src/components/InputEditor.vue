<template>
  <q-popup-edit :model-value="editRow" :v-model="editRow" v-slot="scope">
    <q-input outlined autofocus dense v-model="scope.value">
      <template v-slot:after>
        <q-btn
          flat
          dense
          color="negative"
          icon="cancel"
          @click.stop.prevent="scope.cancel"
        />

        <q-btn
          flat
          dense
          color="positive"
          icon="check_circle"
          @click.stop.prevent="scope.set"
          @click="edit(scope.value, editKey, obj)"
        />
      </template>
    </q-input>
  </q-popup-edit>
</template>
<script>
import { ref, inject } from "vue";

export default {
  name: "InputEdit",
  props: {
    obj: {
      type: String,
    },
    editKey: {
      type: String,
    },
    editRow: {
      type: String,
    },
  },
  data() {
    const bus = inject("bus");
    return {
      bus,
      row: ref(""),
      edd: ref(""),
      open: ref(false),
    };
  },
  methods: {
    edit(editRow, editKey, row) {
      let data = {
        editRow,
        editKey,
        row,
      };
      this.bus.emit("change", data);
    },
  },
};
</script>
<style lang="scss"></style>
