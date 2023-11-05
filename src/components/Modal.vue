<template>
  <q-dialog v-model="showModal" persistent>
    <q-card style="max-width: 70vw">
      <q-card-section>
        <div style="padding: 0.5em" class="text-center text-h4">
          {{ title }}
        </div>
      </q-card-section>
      <q-separator />
      <ModalStoreOs />
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";
import ModalStoreOs from "./utils/os_history/CardStoreOs.vue";
export default defineComponent({
  name: "Modal",
  components: { ModalStoreOs },
  props: {
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
