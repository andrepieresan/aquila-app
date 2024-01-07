<template>
  <q-dialog v-model="showModal" persistent>
    <q-card style="max-width: 70vw">
      <q-card-section>
        <div style="padding: 0.5em" class="text-center text-h4">
          {{ title }}
        </div>
      </q-card-section>
      <q-separator />
      <ModalStoreOs v-if="/store_os/gi.test(type)" />
      <ModalStoreMaterial v-if="/material/gi.test(type)" />
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";
import ModalStoreOs from "./utils/os_history/CardStoreOs.vue";
import ModalStoreMaterial from "./utils/material/CardStoreMaterial.vue";
export default defineComponent({
  name: "Modal",
  components: { ModalStoreOs,ModalStoreMaterial },
  props: {
    type: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  setup() {
    const showModal = ref(false);
    return {
      showModal,
    };
  },
});
</script>

<style lang="scss"></style>
